const middleware = require('./middleware');
const User = require('app/models/user');
const passport = require('passport')
const JWT = require('jsonwebtoken');
const config = require('../../../config');

class apiAuth extends  middleware {
    handle(req , res , next) {
        const token = req.signedCookies.api_token
        // console.log(req.user)

        // console.log(token)
        JWT.verify(token , config.jsonwebtoken.secret_key , async (err , decode)=> {
            if(err){
                console.log(err)
                return res.json({
                    data : 'توکن ارسالی معتبر نیست',
                    success : false
                })
            }

            User.findById(decode.id , (err , user) => {
                if(err){throw err}

                if(user){
                    user.token = token
                    req.user = user
                    // console.log(req.user)
                    next();
                    return ;
                } else {
                    return res.json({
                        data : 'چنین کاربری وجود ندارد',
                        success : false
                    })
                }
            })
            
        })
    }

}

module.exports = new apiAuth();