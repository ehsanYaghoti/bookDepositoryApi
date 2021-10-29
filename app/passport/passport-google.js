const passport = require('passport');
const googleStrategy = require('passport-google-oauth').OAuth2Strategy
const User = require('app/models/user')

passport.serializeUser(function(user, done) {
    done(null, user.id);
});
   
passport.deserializeUser(function(id, done) {
    User.findById(id, function (err, user) {
      done(err, user);
    });
});


passport.use('google' , new googleStrategy({
    clientID : process.env.GOOGLE_CLIENTID,
    clientSecret : process.env.GOOGLE_SECRET,
    callbackURL : process.env.GOOGLE_CALLBACKURL
} , (accessToken , refreshToken , profile , done) => {

    User.findOne({email : profile.emails[0].value} , (err , user)=>{
        if(err){ return done(err)};
        if(user){ 
            
            // user.setRememberToken(res , 30);
            return done(null , user)
        };

        const newUser = new User({
            username : profile.displayName,
            email : profile.emails[0].value,
            password : profile.id
        })

        newUser.save(err => {
            if(err){throw err };

            done(null , newUser)
        })


    })


}));