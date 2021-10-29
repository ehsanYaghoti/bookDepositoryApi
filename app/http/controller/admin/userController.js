const Controller = require('../controller')
const User = require('app/models/user');
const passport = require('passport')
const CORS = require('cors')
class userController extends Controller {
    async index(req , res){ 
        // console.log(req.query)

        const options = {
        
            page :  req.query.page || 1 ,
            limit : req.query.limit || 10 ,
            sort : { email : req.query.sortEmail , username : req.query.sortUsername  , createdAt : req.query.sortCreatedAt } ,
            select :  '_id username email premission createdAt admin avatar'

        }

        function timeMaker(){
            let createdAt = req.query.createdAt
            let date = Date.now()
            switch (createdAt) {
                case '1monthAgo':
                    date =  Date.now() - 1000 * 60 * 60 * 24 * 30
                    return new Date(date)
                    break;
                case '2monthAgo':
                    date = Date.now() - 1000 * 60 * 60 * 24 * 60
                    return new Date(date)
                break;
                case '1yearAgo' :
                    date = Date.now() - 1000 * 60 * 60 * 24 * 30 * 12 
                    return new Date(date)
                break;
                default :
                    date = Date.now() - 1000 * 60 * 60 * 24 * 30 * 24
                    return new Date(date)
                break;
            }
        }

        function premissionMaker(){     
            let premission = req.query.premission
            switch (premission) {
                case 'admin':
                    return true
                    break;
                case 'viewer':
                    return false
                break;
                default :
                    return false
                break;
            }
        }
                
        let username = new RegExp(req.query.username , 'g')
        let createdAt = await timeMaker()
        let premissionState = await premissionMaker()


        console.log(username , createdAt , premissionState)
        let users = await User.paginate( { $or : [{username } , {email : username} ] , admin : premissionState , createdAt : {"$gte" : createdAt } } , options)

        if(users.docs.length === 0){ return res.json({ data : 'چنین کاربری وجود ندارد' , 
        success : false
        })}

        return res.json({
            data :  users ,
            success : true
        })
    }

    async createProcess(req , res , next){
        // await this.recaptchaValidation(req , res)
        const result = await this.validationData(req , res)
        if(result){ 
            return this.create(req , res , next)
        }

        
        return res.json({
            result ,
            messages : req.flash('validationMessage'),
        })

    }

    async create(req , res , next ){
        try {



            passport.authenticate('local.register' , {failureRedirect : 'http://localhost:3000/users/create'
                , successRedirect : 'http://localhost:3000/users' 
                , failureFlash : true } , ()=> {

                res.json({ 
                    result : true
                })
            })(req  , res , next)

        } catch (err) {
            return res.json({
                data : err.meesage,
                succcess : false
            }) 
        }

    }

    async editForm (req , res) {
    try {
        this.isMongoId(req.params.id)
        let id = `${req.params.id}`
        const user = await  User.findById(id)
        
        if(! user){
            //  this.error(404 , 'چنین کاربر ای یافت نشد')
             return res.josn('چنین کاربر ای یافت نشد')
        };


        return res.json({
            data :  user ,
            success : true
        })
    } catch (err) {
        return res.json({
            data : err,
            success : false
        })
    }
    }

    async editProcess(req , res , next){
        // await this.recaptchaValidation(req , res)
        const success = await this.validationData(req , res)
        if(success){
            return this.edit(req , res , next)
        }

        // req.flash('formData' , req.body)
        // console.log(success)
        return res.json({
            success ,
            messages : req.flash('validationMessage'),
        })

    }

    async edit(req , res , next){
        try {

            const {username , email} = req.body

            let user = await  User.findByIdAndUpdate(req.params.id , {$set : {
                username ,
                email
            }})

            console.log(user)

            return res.json({
                data : user,
                success : true
            })

        } catch (err) {
            return res.json({
                data : err,
                success : false
            })
        }
    }

    async delete(req , res , next) {
        try {
            this.isMongoId(req.params.id)
            const user = await User.findById(req.params.id)

            if(! user){ this.error(404 , 'چنین کاربر ای یافت نشد')};
            
            await user.deleteOne()    

            return res.json({
                data : 'deleted',
                success : true
            })

        } catch (err) {
            return res.json({
                data : this.error(404,  err),
                success : false
            })
        }
    }


}



module.exports = new userController();