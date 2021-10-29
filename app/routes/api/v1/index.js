const express =  require('express')
const router = express.Router();

// Controllers
const homeController = require('./../../../http/controller/homeController')
const registerController = require('./../../../http/controller/auth/registerController')
const loginController = require('./../../../http/controller/auth/loginController')


// Valisators
const registerValidator = require('./../../../http/validator/registerValidator')
const loginValidator = require('./../../../http/validator/loginValidator')



// Routes
router.get('/' , homeController.index)


// Auth Routes
router.post('/register' , registerValidator.handle() , registerController.registerProcess);
router.post('/login' , loginValidator.handle() , loginController.loginProcess);



module.exports = router;