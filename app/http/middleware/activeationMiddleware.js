const middleware = require('./middleware')
const User = require('app/models/user')

class activation extends middleware {
    async handle(req , res , next){

        if(req.isAuthenticated()){
            if(req.user.active) {
                return next();
            } else {
                this.sweetAlert(req , {
                    title : 'توجه',
                    message : 'حساب کاربری شما فعال نیست لطفا از فرم ورود اقدام به فعال سازی کنید',
                    type : 'warning',
                    button : 'باشه'
                })

                req.logout();
                res.clearCookie('remember_token');
                return res.redirect('/')
            }
        } else {
            next();
        }
    }


}


module.exports = new activation;