const express = require('express');
const app = express();
const http = require('http');
const bodyParser = require('body-parser');
const session = require('express-session');
const cookieParser = require('cookie-parser');
// const validator = require('express-validator');
const mongoose = require('mongoose');
const MongoStore = require('connect-mongo')(session)
const config = require('../config');
const passport = require('passport');
const flash = require('connect-flash');
const helper = require('./helper')
const DeviceDetector  = require('node-device-detector');
const detector = new DeviceDetector
const requestIp = require('request-ip');
const device = require('express-device');

// Middlewares
const rememberMiddleware = require('app/http/middleware/loginMiddleware')
const activeationMiddleware = require('app/http/middleware/activeationMiddleware')


module.exports = class Application {

    constructor(){
        this.setupExpress();
        this.setMongoConnection();
        this.setConfig();
        this.setRoutes();
    }

    //Express Configuration
    setupExpress(){
        const server = http.createServer(app);
        server.listen(process.env.port , ()=> console.log(`App is running on port ${process.env.port}`) )
    }

    //Mongoose Configuration
    setMongoConnection(){
        mongoose.connect(config.database.url , {useNewUrlParser : true , useUnifiedTopology : true , useFindAndModify : false , useCreateIndex : true})
        mongoose.Promise = global.Promise
    }
   
    setConfig(){
        // console.log(config.service.google)
        // console.log(process.env)
        //Passports
        require('app/passport/passport-local.js')
        require('app/passport/passport-google.js')
        require('app/passport/passport-jwt.js')

        // console.log(new Window().navigator)
        
        //Body Parser Configuration
        app.use(express.json())
        app.use(express.urlencoded({extended : true}))

        
        // // inside middleware handler
        // const ipMiddleware = function(req, res, next) {
        //     const clientIp = requestIp.getClientIp(req); 
        //     console.log(clientIp)
        //     next();
        // };
        // // app.use(ipMiddleware)
        // app.use(requestIp.mw())
        // app.use(function(req, res , next) {
        //     const ip = req.clientIp;
        //     console.log(ip)
        //     next()
        // });

        // app.use(bodyParser.json())
        // app.use(bodyParser.urlencoded({extended : true}))

        //Front End Configuration 
        app.use(express.static('public'))
        app.set('view engine' , config.layout.view_engine)
        app.set('views' , config.layout.view_dir)
        app.use(config.layout.ejs.expressLayouts)
        app.set("layout extractScripts", config.layout.ejs.extractScripts)
        app.set("layout extractStyles", config.layout.ejs.extractStyles)
        app.set('layout' , config.layout.ejs.master_dir)

        // const userAgent = 'Mozilla/5.0 (Linux; Android 5.0; NX505J Build/KVT49L) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/43.0.2357.78 Mobile Safari/537.36';
        // const result = detector.parseOs(userAgent);
        // console.log('Result parse os', result);  
        
 
        // app.use(device.capture({parseUserAgent : true}))
        // device.enableDeviceHelpers(app)

        // app.use((req , res , next) => {
        //     console.log(req.device)
        //     next();
        // })

        //Auth Configuration
        app.use(session(config.session))
        app.use(cookieParser(config.cookie_secretkey))
        app.use(flash());
        app.use(passport.initialize());
        app.use(passport.session())
        app.use(rememberMiddleware.handle)

        //Helpers
        app.use((req , res , next)=>{

            app.locals = new helper(req , res).getObject();
            next();
        })
        
    }

    setRoutes(){
        //Routes Midllewares
        app.use(activeationMiddleware.handle)
        app.use(require('./routes/api'));
        app.use(require('./routes/web'));
    }

}