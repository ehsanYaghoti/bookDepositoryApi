const express =  require('express')
const router = express.Router();
const passport = require('passport');

// Controllers
const authController = require('app/http/controller/auth/authController')
const registerController = require('app/http/controller/auth/registerController')
const loginController = require('app/http/controller/auth/loginController')
const forgotPasswordController = require('app/http/controller/auth/forgotPasswordController')
const resetPasswordController = require('app/http/controller/auth/resetPasswordController')



// Validators
const registerValidator = require('app/http/validator/registerValidator')
const loginValidator = require('app/http/validator/loginValidator');
const forgotPasswordValidator = require('app/http/validator/forgotPasswordValidator');
const resetPasswordValidator = require('app/http/validator/resetPasswordValidator');




// Middlewares
const redirectIfAuthenticated = require('app/http/middleware/redirectIfAuthenticated');



// //Routes
router.get('/' , redirectIfAuthenticated.handle , authController.showAuthForms);

//forgotPassword
router.get('/forgot-password' , forgotPasswordController.showForgotPasswordForm);
router.post('/forgotpassword' , forgotPasswordValidator.handle() ,  forgotPasswordController.sendResetLink);
router.get('/password/reset/:token' , resetPasswordController.showResetPasswordForm);
router.post('/password/reset' , resetPasswordValidator.handle() ,  resetPasswordController.resetPasswordProcess);


//local
router.post('/register' , registerValidator.handle() , registerController.registerProcess);
router.post('/login' , loginValidator.handle() , loginController.loginProcess);

//google
router.get('/google' , passport.authenticate('google' , {scope : ['profile' , 'email']}));
router.get('/google/callback' , passport.authenticate('google' , {
    successRedirect : '/',
    failureRedirect : '/auth'
}))

module.exports = router;