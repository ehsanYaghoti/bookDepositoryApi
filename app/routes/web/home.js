// Modules
const router = require('express').Router()

// Controllers
const userController = require('app/http/controller/userController');
const homeController = require('app/http/controller/homeController');
const homePageController = require('app/http/controller/home/homePageController');
const bookPageController = require('app/http/controller/home/bookPageController');



// Validators
const commentValidator = require('app/http/validator/commentValidator');
const userValidator = require('app/http/validator/userValidator');
const passwordValidator = require('app/http/validator/passwordValidator');
const newPasswordValidator = require('app/http/validator/newPasswordValidator');



// Middlewares
const apiAuthJWT = require('app/http/middleware/apiAuthJWT');
const convertFileToField = require('app/http/middleware/convertFileToField');

// Helpers
const upload = require('app/helper/uploadImage');

// 
//  First page routes
// 

router.get('/' , homePageController.index)

// 
//  User Panel Routes
//

router.post('/avatar-upload'   , upload.single('image') , convertFileToField.handle , userController.uploadAvatar);

router.get('/user/activation/:code' , userController.activation);

router.get('/user/panel' , userController.panel);
router.post('/user/panel/update' , userValidator.handle()  , userController.updateInfo);

router.get('/user/phonenumber' , userController.phoneNumberForm);
router.post('/user/activePhoneNumber' , userController.activeByPhoneNumber);

router.get('/user/password' , userController.passwordForm);
router.post('/user/confirmPassword' , passwordValidator.handle()  , userController.passwordManger);
router.post('/user/changePassword' ,  newPasswordValidator.handle() , userController.passwordChanger);

// router.get('/user/sessionManager' , userController.panel);



// 
// Comment Routes 
// 

router.post('/comment' ,  commentValidator.handle() , homeController.comment)

// 
//  Logout Route 
// 

router.get('/logout' , (req , res)=> {
    req.logout();
    res.clearCookie('remember_token');
    res.clearCookie('api_token');
    return res.redirect('/')
})

// 
// Books List By Categories Routes 
// 

router.get('/category/:slug' , bookPageController.categoryPage )

//
// Single Book Page Route
//

router.get('/books/:slug' , bookPageController.single)

// 
// Articles Routes 
// 

router.get('/articles' , (req , res)=>{
    res.json('articles Page')
})

module.exports = router;