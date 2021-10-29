const middleware = require('./middleware');
const User = require('app/models/user');
const passport = require('passport')

class apiAuth extends  middleware {
    handle(req , res , next) {
        passport.authenticate('jwt' , {failureRedirect : 'http://localhost:4000' } , (err , user , info)=> {
            if(err || ! user){
                return res.json({
                    data : info.message || '403 شما اجازه دسترسی ندارید' ,
                    success : false,
                    state : err
                })    
            }

            req.user = user;
            next();
        })(req , res , next)
    }

}

module.exports = new apiAuth();