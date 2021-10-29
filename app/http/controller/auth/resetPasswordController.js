const Controller = require('app/http/controller/controller')
const User = require('app/models/user');
const PasswordReset = require('app/models/passwordReset')


class ForgotPassword extends Controller {

    async showResetPasswordForm(req , res){
        const title = 'بازیابی رمز عبور'
        const token = req.params.token
        res.render('home/auth/passwordReset' , {title , token , recaptcha  : this.recaptcha.render()})    
        
    }

    async resetPasswordProcess(req , res ){
        await this.recaptchaValidation(req , res)
        const result = await this.validationData(req , res)
        if(result){
            return this.resetPassword(req , res )
        }

 
        return this.back(req , res)
    }

    async resetPassword(req  , res) {
        let field = await PasswordReset.findOne({$and : [{email : req.body.email } , {token : req.body.token}]})

        if(! field){
            req.flash('validationMessage' , 'اطلاعات وارد شده صحیح نمی باشند')
            return this.back(req , res)
        }

        if(field.use){
            req.flash('validationMessage' , 'از این لینک بازیابی رمز عبور قبلا استفاده شده است')
            return this.back(req , res)
        }

        let user =await User.findOne({email : field.email})


        await user.$set({password : user.hashPassword(req.body.password)});
        await user.save();


        if(! user){
            req.flash('validationMessage' , 'چنین کاربری با این ایمیل وجود ندارد')
            return this.back(req , res)
        }

        field.updateOne({use : true})


        await this.sweetAlert(req , {
            title : '',
            message : 'بازیابی رمز عبور با موفقیت انجام شد',
            type : 'success',
            button : 'باشه'
        })

        return res.redirect('/auth')

    }

}



module.exports = new ForgotPassword();