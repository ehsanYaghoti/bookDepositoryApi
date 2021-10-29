const controller = require('app/http/controller/controller.js')
const User = require('app/models/user')
const passport = require('passport')
const ActiveationCode = require('app/models/activeationCode')
const uniqueString = require('unique-string');
const mail = require('app/helper/mail');
const JWT = require('jsonwebtoken');
const config = require('../../../../config');


class loginController extends controller {
    async loginProcess(req , res , next){
        await this.recaptchaValidation(req , res)
        const result = await this.validationData(req , res)
        if(result){
            return this.login(req , res , next)
        }

        return this.back(req , res)

    }


    async login(req , res , next){
        try {
            passport.authenticate('local.login' , async  (err , user)=>{
                if(!user){ return res.redirect('/auth')}

                if(! user.active) {
                    const activeCode = await  ActiveationCode.find({user : user._id}).gt('expire' , new Date()).sort({createdAt : 1}).limit(1).populate('user').exec();

                    if(activeCode.length){
                        this.sweetAlert(req , {
                            title : 'توجه',
                            message : 'لینک فعال سازی اکانت قبلا ارسال شده است برای امتحان مجدد ۱۰ دقیقه صبر کنید',
                            type : 'warning',
                            timer : 3000
                        })

                        return this.back(req , res);
                        
                    }

                    //create activeation code

                    const newActiveationCode = new ActiveationCode({
                        user : user._id ,
                        code : uniqueString(),
                        expire : Date.now() + 1000 * 60 * 10
                    })

                    await newActiveationCode.save();

                    // send mail with defined transport object

                    const mailOptions  = {
                        from: '"وبسایت کتابخانه 👻" <info@nodejs.bookdirectory.ir>', // sender address
                        to: `${user.email}`, // list of receivers
                        subject: "فعال سازی حساب کاربری", // Subject line
                       
                        html:  `
                            <h2>فعال سازی حساب کاربری</h2>
                            <p>برای فعال سازی حساب کاربری روی لینک زیر کلیک کنید</p>
                            <a href="${process.env.WEBSITE_URL}/user/activation/${newActiveationCode.code}">فعال سازی</a>
                        `, // html body
                    }
            
            
                    mail.sendMail(mailOptions ,async (err , info)=>{
                        if(err) {console.log(err)};
            
                        console.log("Message sent: %s", info.messageId)

                        await this.sweetAlert(req , {
                            title : 'توجه',
                            message : 'ایمیل حاوی لینک فعال سازی اکانت به ایمیل شما ارسال شد',
                            type : 'success',
                            button : 'بسیار خب'
                        })
            
                        return res.redirect('/');
            
                    })

                    return;
                }

                req.login(user , err => { 
                    if(err){console.log(err)}
                    if(req.body.rememberme){
                        user.setRememberToken(res , 90);
                    }
                    if(user.admin){
                        const token  = JWT.sign({id : user._id} , config.jsonwebtoken.secret_key , { expiresIn : '90d'})
                        res.cookie('api_token' , token , {sameSite : false , maxAge : 1000 * 60 * 60 * 24 * 30 * 3 , httpOnly : true , signed : true})
                        console.log(token)
                    }
 


                    return res.redirect('/');
                })


            })(req  , res , next)


            

        } catch (err) {
            console.log(err) ;
            next()
        }

    }

}



module.exports = new loginController();