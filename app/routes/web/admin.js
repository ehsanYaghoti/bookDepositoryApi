// Modules
const router = require('express').Router()
const CORS = require('cors')


// Controllers
const adminController = require('app/http/controller/admin/adminController');
const bookController = require('app/http/controller/admin/bookController');
const articleController = require('app/http/controller/admin/articleController');
const categoryController = require('app/http/controller/admin/categoryController');
const userController = require('app/http/controller/admin/userController');
const commentController = require('app/http/controller/admin/commentController');
const permissionController = require('app/http/controller/admin/permissionController');
const roleController = require('app/http/controller/admin/roleController');



// Validators
const registerValidator = require('app/http/validator/registerValidator');
const editUserValidator = require('app/http/validator/editUserValidator');
const bookValidator = require('app/http/validator/bookValidator');
const articleValidator = require('app/http/validator/articleValidator');
const permissionValidator = require('app/http/validator/permissionValidator');
const roleValidator = require('app/http/validator/roleValidator');
const categoryValidator = require('app/http/validator/categoryValidator');




// Middlewares
const apiAuthJWT = require('app/http/middleware/apiAuthJWT');
const convertFileToField = require('app/http/middleware/convertFileToField');

// Helpers
const upload = require('app/helper/uploadImage')

// 
//  Routes
// 

// CORS Configuration
let whitelist = ['http://localhost:3000' , 'http://localhost:4000']
let corsOptions = {
  origin:  whitelist ,
  allowedHeaders : ['Content-Type' ,'Authorization' , 'Origin' , 'Access-Control-Allow-Origin'],
  credentials : true,
  methods : 'GET,PUT,POST,DELETE'

}


// main Route

router.get('/'   ,(req , res)=>{ 
  // console.log(req.user)
  res.redirect('http://localhost:3000')

})

//  
// Upload Image
// 

router.post('/upload' , CORS(corsOptions)  , upload.single('image') , convertFileToField.handle , adminController.uploaded)

// 
// Books Routes
// 

router.get('/books'   , CORS(corsOptions) , bookController.index);

router.options('/books/create' , CORS());
router.post('/books/create' , CORS(corsOptions)  , upload.single('image') , convertFileToField.handle ,  bookValidator.handle() , bookController.create);

router.get('/books/edit/:id' , CORS(corsOptions) , bookController.updateForm);

router.options('/books/:id/update' , CORS(corsOptions) );
router.put('/books/:id/update'  , CORS(corsOptions) , upload.single('image') , convertFileToField.handle , bookValidator.handle() , bookController.update);

router.options('/books/:id' , CORS());
router.delete('/books/:id' , CORS(corsOptions) , bookController.delete);

// 
// Article Routes
// 


router.get('/articles'   , CORS(corsOptions) , articleController.index);

router.options('/articles/create' , CORS());
router.post('/articles/create' , CORS(corsOptions)  , articleValidator.handle() , articleController.create);

router.get('/articles/edit/:id' , CORS(corsOptions) , articleController.updateForm);

router.options('/articles/:id/update' , CORS(corsOptions) );
router.put('/articles/:id/update'  , CORS(corsOptions) , articleValidator.handle() , articleController.update);

router.options('/articles/:id' , CORS());
router.delete('/articles/:id' , CORS(corsOptions) , articleController.delete);

// 
// Comments Routes
// 

router.get('/comments' , CORS(corsOptions) , commentController.index);
// router.get('/comments/approve' , commentController.approved);
router.put('/comments/:id/approve' , commentController.update);
router.delete('/comments/:id' , commentController.delete);

// 
// Categories Routes
// 

router.get('/category'   , CORS(corsOptions) , categoryController.index);

router.options('/category/create' , CORS())
router.post('/category/create' , CORS(corsOptions) , categoryValidator.handle()  , categoryController.create);

router.get('/category/edit/:id' , CORS(corsOptions)   , categoryController.updateForm);

router.options('/category/:id/update' , CORS() )
router.put('/category/:id/update', CORS(corsOptions) , categoryController.update);

router.options('/category/:id', CORS())
router.delete('/category/:id' , CORS(corsOptions) , categoryValidator.handle()  , categoryController.delete);

// 
// Users Routes
//  

router.get('/user'  , CORS(corsOptions) , userController.index);

router.options('/user/create', CORS())
router.post('/user/create'  , CORS(corsOptions) , registerValidator.handle() , userController.createProcess)

router.options('/user/:id', CORS())
router.delete('/user/:id' , CORS(corsOptions) ,  userController.delete)

router.get('/user/edit/:id' , CORS(corsOptions) , userController.editForm)

router.options('/user/edit/:id', CORS())
router.put('/user/edit/:id' , CORS(corsOptions), editUserValidator.handle() , userController.editProcess)

// 
// Permission Routes
// 


router.get('/permissions'   , CORS(corsOptions) , permissionController.index);

router.options('/permissions/create' , CORS());
router.post('/permissions/create' , CORS(corsOptions)  , permissionValidator.handle() , permissionController.create);

router.get('/permissions/edit/:id' , CORS(corsOptions) , permissionController.updateForm);

router.options('/permissions/:id/update' , CORS(corsOptions) );
router.put('/permissions/:id/update'  , CORS(corsOptions) , permissionValidator.handle() , permissionController.update);

router.options('/permissions/:id' , CORS());
router.delete('/permissions/:id' , CORS(corsOptions) , permissionController.delete);

// 
// Role Routes
// 


router.get('/roles'   , CORS(corsOptions) , roleController.index);

router.options('/roles/create' , CORS());
router.post('/roles/create' , CORS(corsOptions)  , roleValidator.handle() , roleController.create);

router.get('/roles/edit/:id' , CORS(corsOptions) , roleController.updateForm);

router.options('/roles/:id/update' , CORS(corsOptions) );
router.put('/roles/:id/update'  , CORS(corsOptions) , roleValidator.handle() , roleController.update);

router.options('/roles/:id' , CORS());
router.delete('/roles/:id' , CORS(corsOptions) , roleController.delete);

module.exports = router;