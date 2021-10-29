const session = require('express-session');
const mongoose = require('mongoose');
const MongoStore = require('connect-mongo')(session)

module.exports = {
        name : 'bookdirectory_session',
        secret : 'sessionsecretkey' ,
        resave : true,
        saveUninitialized : true,
        cookie : { expires : new Date(Date.now() + 1000 * 60 * 60 * 6)},
        store : new MongoStore({mongooseConnection : mongoose.connection})
} 