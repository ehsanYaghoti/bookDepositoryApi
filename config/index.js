const service = require('./service');
const session = require('./session');
const database = require('./database');
const layout = require('./layout');

module.exports = {
    a : {
            b : process.env.APPDATA ,
            c : process.env.port,
        },
    layout,
    database,
    service,
    session,
    jsonwebtoken: { 
        secret_key : 'jsonwebtokensecretkey' 
    },
    cookie_secretkey : 'cookiesecretkey',
    port : process.env.APPLICATIONPORT,
    website_url : process.env.WEBSITE_URL,
    debug : true,
}