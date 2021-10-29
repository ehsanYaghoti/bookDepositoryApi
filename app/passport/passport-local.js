const passport = require('passport');
const passportLocal = require('passport-local');
const localStrategy = passportLocal.Strategy
const User = require('app/models/user')

passport.serializeUser(function(user , done){
    done(null , user.id)
});

passport.deserializeUser(function(id , done){
    User.findById(id , function(err , user){
        done(err , user)
    })
});


passport.use('local.register' , new localStrategy({
    usernameField : 'email',
    passwordField : 'password' ,
    passReqToCallback : true
} , (req ,  email , password , done)=>{
    User.findOne({'email' : email} , (err , user )=>{
        if(err){
            return done(err);
        }

        if(user){
            return done(null , false , {message : 'چنین کاربری با این ایمیل قبلا ثبت نام کرده است'});
        }

        const newUser = new User({
            username : req.body.username,
            email
        })

        newUser.$set('password' , newUser.hashPassword(password))
        
        newUser.save(err => {
            if(err){done(err , false , req.flash('validationMessage' , 'ثبت نام با موفقیت انجام نشد لطفا دوباره تلاش کنید') )}

            done(null , newUser)
        })
    })


}))



passport.use('local.login' , new localStrategy({
    usernameField : 'email',
    passwordField : 'password' ,
    passReqToCallback : true
} , (req ,  email , password , done)=>{
    User.findOne({'email' : email} , (err , user )=>{
        if(err){
            return done(err);
        }

        if(! user || ! user.comparePassword(password)){
            
            return done(null , false ,  req.flash('validationMessage' , 'اطلاعات وارد شده صحیح نیست، لطفا دوباره تلاش بفرمائید') );
        }
       
        done(null , user)
    })

}))