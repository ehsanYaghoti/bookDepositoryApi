const Controller = require('app/http/controller/controller');
const User = require('app/models/user');
const mail = require('app/helper/mail');
const PasswordReset = require('app/models/passwordReset')
const uniqueString = require('unique-string');
const config = require('../../../../config');

class ForgotPassword extends Controller {

    async showForgotPasswordForm(req , res){
        const title = 'فراموشی رمز عبور'

        res.render('home/auth/forgotPassword.ejs' , {title , recaptcha  : this.recaptcha.render() })    
        
    }

    async forgotPasswordProcess(req , res ){
        const result = await this.validationData(req , res)
        await this.recaptchaValidation(req , res)
        if(result){
            return this.sendResetLink(req , res )
        }

 
        return this.back(req , res)
    }

    async sendResetLink(req , res){

        let user = await User.findOne({email : req.body.email })
        if(! user){
            req.flash('errors' , 'چنین ایمیلی وجود ندارد');
            return this.back(req ,res);
        }

        const newPasswordReset = new PasswordReset({
            email : req.body.email,
            token  : uniqueString(),

        })

        await newPasswordReset.save();

        const mailOptions  = {
            from: '"وبسایت کتابخانه 👻" <info@nodejs.bookdirectory.ir>', // sender address
            to: `${newPasswordReset.email}`, // list of receivers
            subject: "بازیابی رمز عبور", // Subject line
           
            html:  `
                <h2>بازیابی رمز عبور</h2>
                <p>برای بازیابی رمز عبور روی لینک زیر کلیک کنید</p>
                <a href="${process.env.WEBSITE_URL}/auth/password/reset/${newPasswordReset.token}">بازیابی</a>
            `, // html body
          }


        await mail.sendMail(mailOptions ,async (err , info)=>{
            if(err) {console.log(err)};

            console.log("Message sent: %s", info.messageId)

            return

        })

        await this.sweetAlert(req , {
            title : 'توجه',
            message : 'ایمیل حاوی لینک پسورد به ایمیل شما ارسال شد',
            type : 'info',
            button : 'باشه'
        })

        return res.redirect('/auth')
        
    }
}



module.exports = new ForgotPassword();