const express =  require('express')
const router = express.Router();
const CORS = require('cors');


// Routers
const homeRouter = require('./home.js')
const adminRouter = require('./admin.js')
const authRouter = require('./auth.js')

// Middlewares
const redirectIfNotAdmin = require('app/http/middleware/redirectIfNotAdmin');
const apiAuth = require('app/http/middleware/apiAuth');
const apiAuthJWT = require('app/http/middleware/apiAuthJWT');

// CORS
let whitelist = ['http://localhost:3000' , 'http://localhost:4000']
let corsOptions = {
  origin: whitelist ,
  allowedHeaders : ['Content-Type' ,'Authorization' , 'Origin'],
  credentials : true,
  methods : 'GET,PUT,POST,DELETE'
}


// Home Routes
router.use('/' , homeRouter )

// Auth Routes
router.use('/auth'  , authRouter)

// Admin Routes
router.use('/admin'  , CORS(corsOptions) , redirectIfNotAdmin.handle  ,  apiAuthJWT.handle , adminRouter )



module.exports = router;