const validator = require('./validator');
const { check } = require('express-validator');

class registrtValidator extends validator{
    handle(){
        return [
            
            check('fullName').isLength({min : 5}).not().isAlpha('fa-IR')
            .withMessage('نام و نام خانوادگی باید حداقل ۵ حرف فارسی باشد')
            .escape(),

            check('yyyy').not().isEmpty()
            .withMessage('فیلد تاریخ تولد نباید خالی باشد')
            .trim().escape(),

            check('mm').not().isEmpty()
            .withMessage('فیلد تاریخ تولد نباید خالی باشد')
            .trim().escape(),

            check('dd').not().isEmpty()
            .withMessage('فیلد تاریخ تولد نباید خالی باشد')
            .trim().escape(),

            check('idcardNumber').isLength({min : 5})
            .withMessage('شماره ملی باید عدد باشد')
            .trim().escape(),

            check('address').isLength({min : 5})
            .withMessage('آدرس باید حداقل ۵ حرف فارسی باشد')
            .trim().escape(),

            check('username').isLength({min : 5})
            .withMessage('نام کاربری باید حداقل ۵ کاراکتر باشد')
            .trim().escape(),
            
            check('email').isEmail()
            .withMessage('فیلد ایمیل معتبر نیست').trim().escape(),
            

        ]
    }
}



module.exports = new registrtValidator;