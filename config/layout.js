const path = require('path');
const expressLayouts = require('express-ejs-layouts');


module.exports = {
    static_dir : 'public',
    view_dir : path.resolve('./resources/views'),
    view_engine : 'ejs',
    ejs : {
        expressLayouts,
        extractScripts : true,
        extractStyles : true ,
        master_dir : 'home/master'
    }
} 