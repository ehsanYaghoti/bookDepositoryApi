const validator = require('./validator');
const { check } = require('express-validator');


class registrtValidator extends validator{
    handle(){
        return [
            check('title').not().isEmpty()
            .withMessage('فیلد عنوان نباید خالی باشد')
            .trim().escape(),
            check('author').not().isEmpty()
            .withMessage('فیلد نام نویسنده نباید خالی باشد')
            .trim().escape(),
            check('statement').not().isEmpty()
            .withMessage('فیلد توضیح نباید خالی باشد')
            .trim().escape(),
            check('publisher').not().isEmpty()
            .withMessage('فیلد نام ناشر نباید خالی باشد')
            .trim().escape(),
            check('publicationDate').not().isEmpty()
            .withMessage('فیلد تاریخ انتشار نباید خالی باشد')
            .trim().escape(),
            check('publicationPlace').not().isEmpty()
            .withMessage('فیلد مکان انتشار نباید خالی باشد')
            .trim().escape(),
            check('ISBN').not().isEmpty()
            .withMessage('فیلد شماره شابک نباید خالی باشد')
            .trim().escape(),
            check('language').not().isEmpty()
            .withMessage('فیلد زبان نباید خالی باشد')
            .trim().escape(),
            check('dimensions').not().isEmpty()
            .withMessage('فیلد ابعاد نباید خالی باشد')
            .trim().escape(),
            check('weight').not().isEmpty()
            .withMessage('فیلد وزن نباید خالی باشد')
            .trim().escape(),
            check('image').not().isEmpty()
            .withMessage('فیلد عکس نباید خالی باشد')
            .trim().escape(),
            check('price').not().isEmpty()
            .withMessage('فیلد قیمت نباید خالی باشد')
            .trim().escape(),
            check('rating').not().isEmpty()
            .withMessage('فیلد نمره نباید خالی باشد')
            .trim().escape(),
            check('categories').not().isEmpty()
            .withMessage('فیلد دسته بندی نباید خالی باشد')
            .trim().escape(),
            check('tags').not().isEmpty()
            .withMessage('فیلد تگ ها نباید خالی باشد')
            .trim().escape(),
        ]
    }
}



module.exports = new registrtValidator;