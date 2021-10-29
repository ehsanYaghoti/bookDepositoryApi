const controller = require('app/http/controller/controller')
const User = require('app/models/user')
const passport = require('passport');

class registerController extends controller {
    async registerProcess(req , res , next){
        await this.recaptchaValidation(req , res)
        const result = await this.validationData(req , res)
        if(result){
            return this.register(req , res , next)
        }

        return this.back(req , res)

    }


    async register(req , res , next ){
        try {

            passport.authenticate('local.register' , {
                successRedirect : '/',
                failureRedirect : '/auth',
                failureFlash : true
            } )(req  , res , next)

        } catch (err) {
            throw err;
        }

    }

}


module.exports = new registerController();