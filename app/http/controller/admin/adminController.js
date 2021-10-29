const Controller = require('../controller')

class adminController extends Controller {
    uploaded(req , res , next){
        try {
            return res.json({
                data : req.body,
                success  : true
              })
        } catch (err) {
            console.log(err);
            this.apiError(500 , 'server err')
            next(err);
        }
    }
}

module.exports = new adminController();