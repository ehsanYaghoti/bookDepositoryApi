const validator = require('./validator');
const { check } = require('express-validator');


class registrtValidator extends validator{
    handle(){
        return [
            check('title').not().isEmpty()
            .withMessage('فیلد عنوان نباید خالی باشد')
            .trim().escape(),
            check('statement').not().isEmpty()
            .withMessage('فیلد توضیح نباید خالی باشد')
            .trim().escape(),
            check('image').not().isEmpty()
            .withMessage('فیلد عکس نباید خالی باشد')
            .trim().escape(),
            check('categories').not().isEmpty()
            .withMessage('فیلد دسته بندی نباید خالی باشد')
            .trim().escape(),
        ]
    }
}



module.exports = new registrtValidator;