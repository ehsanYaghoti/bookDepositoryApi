const middleware = require('./middleware')
const User = require('app/models/user')

class RememberLogin extends middleware {
    handle(req , res , next){
        // console.log(req.isAuthenticated())
        if(! req.isAuthenticated()) {
            const RememberToken = req.signedCookies.remember_token
            if(RememberToken) { return this.findUser(RememberToken , req , res , next) }
        }

        next();
    }

    findUser (rememberToken , req , res  , next){
        // console.log(rememberToken)
        User.findOne({rememberToken : rememberToken})
        .then(user => {
            // console.log(user)

            if(user){
                req.login(user , err=> {
                    if(err){next(err)};
    
                    next();
                })
            } else {
                res.clearCookie('remember_token');
                res.clearCookie('api_token');
                next();
            }

        })
        .catch(err => next(err))
    }
}


module.exports = new RememberLogin;