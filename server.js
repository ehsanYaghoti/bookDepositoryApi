require('app-module-path').addPath(__dirname)
const App = require('./app')
require('dotenv').config({path:"./.env"});

global.config = require('./config')
// console.log(global.config)

new App();