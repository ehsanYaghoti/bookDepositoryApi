const Controller = require('app/http/controller/controller');
const User = require('app/models/user');
const ActiveationCode = require('app/models/activeationCode');
const client = require('app/helper/sms');

class userController extends Controller {
    async activation(req , res){

        let activationCode = await ActiveationCode.findOne({code : req.params.code}).populate('user').exec();

        if(! activationCode){
            this.sweetAlert(req , {
                title : 'توجه',
                message : 'لینک فعال سازی اکانت  معتبر نمی باشد لطفا دوباره اقدام کنید',
                type : 'warning',
                button : 'بسیار خوب'
            })

            return res.redirect('/')
        }

        if(activationCode.use){
            this.sweetAlert(req , {
                title : 'توجه',
                message : 'لینک فعال سازی اکانت قبلا استفاده شده است لطفا دوباره اقدام کنید',
                type : 'warning',
                button : 'بسیار خوب'
            })

            return res.redirect('/')
        }

        if(activationCode.expire < new Date()){
            this.sweetAlert(req , {
                title : 'توجه',
                message : 'لینک فعال سازی اکانت منقضی است لطفا دوباره اقدام کنید',
                type : 'warning',
                button : 'بسیار خوب'
            })

            return res.redirect('/')
        }

        let user = activationCode.user

        user.$set('active' , true);
        activationCode.$set('use' , true);

        await user.save();
        await activationCode.save();

        req.login(user , async (err)=>{
            if(err) console.log(err)

            if(req.body.rememberme) {
                user.setRememberToken(res);
            }

            await this.sweetAlert(req , {
                title : 'توجه',
                message :  'فعال سازی اکانت با موفقیت انجام شد',
                type : 'success',
                timer : 3000
            })
    
    
            return res.redirect('/')


        })



       
    }

    async panel(req , res , next){
        try {
            const id = req.user.id
            this.isMongoId(id)
            const user = await User.findById(id).select('_id username email fullName address idcardNumber birthDate createdAt updatedAt shopped vipType vipTime avatar')
            
            let vipTimeResiduary = user.vipTime.getTime() - Date.now()
            if(vipTimeResiduary <= 0){
                vipTimeResiduary = null
            } else {
                vipTimeResiduary = Math.floor(vipTimeResiduary / 1000 / 60 / 60 / 24) .toLocaleString('fa-IR')
            }

            // console.log(user)
            let birthDate = []
            if(user.birthDate !== null){
                let year =  parseInt(user.birthDate.substr(0 , 4)).toLocaleString('fa').replace(/٬/g, '') 
                let month = parseInt(user.birthDate.substr(5 , 2)).toLocaleString('fa')
                let day = parseInt(user.birthDate.substr(8 , 2)).toLocaleString('fa')
                birthDate.push(year , month , day)
                // birthDate[0].replace(/٬/g, '')
            }

            console.log(birthDate)
            res.render('home/userPanel/user' , {user , vipTimeResiduary , birthDate})
            // res.json({
            //     data : user
            // })
        } catch (err) {
            console.log(err);
            next();
        }
    }

    async uploadAvatar(req , res , next){
        try {

            console.log(req.body)
            let images = this.imageResize(req.file)
            const user = await User.findByIdAndUpdate(req.user._id , {$set : {
                avatar : images[480]
            }})

            return res.json({
                data : user,
                succes : true
            })
        } catch (err) {
            console.log(err)
            next(err)
        }
    }
    
    async updateInfo(req , res , next){
        try {

            const result = await this.validationData(req , res)
            // console.log(result)
            if(! result){
                return res.redirect('/user/panel')
            }

            console.log(req.body)
            const birthDate2 = (req.body.yyyy)-621 + '/' +  req.body.mm.toLocaleString('fa' , 'IR') + '/' + req.body.dd.toLocaleString('fa' , 'IR')
            console.log(birthDate2)
            // return;
            const user = await User.findByIdAndUpdate(req.user._id , {$set : {
                username : req.body.username,
                fullName : req.body.fullName,
                birthDate : birthDate2,
                idcardNumber : req.body.idcardNumber,
                email : req.body.email,
                address : req.body.address,
            }})

            return res.redirect('/user/panel')
            return res.json({
                data : user,
                succes : true
            })
        } catch (err) {
            console.log(err)
            next(err)
        }
    }

    async passwordForm(req , res , next){
        try {
            const id = req.user.id
            this.isMongoId(id)
            const user = await User.findById(id).select('_id username email fullName address idcardNumber birthDate createdAt updatedAt shopped vipType vipTime avatar')
    
            res.render('home/userPanel/password' , { user  , valid : false})

        } catch (err) {
            console.log(err);
            next(err);
        }

    }

    async passwordManger(req , res , next){
        try {

            const result = await this.validationData(req , res)
            // console.log(result)
            if(! result){
                return res.redirect('/user/password')
            }

            const user = await User.findById(req.user._id)

            if(! user){
                req.flash('validationMessage' , 'چنین کاربری وجود ندارد، لطفا دوباره وارد شوید')
                return  res.redirect('/user/password')
            }

            if(! user.comparePassword(req.body.password)){
                req.flash('validationMessage' , 'اطلاعات وارد شده صحیح نیست، لطفا دوباره تلاش بفرمائید')
                return  res.redirect('/user/password')

            }

            res.render('home/userPanel/password' , { user , valid : true })
            
        } catch (err) {
            console.log()
            next(err);
        }
    }

    async passwordChanger(req , res , next){
        try {

            const user = await User.findById(req.user._id)

            if(! user){
                req.flash('validationMessage' , 'چنین کاربری وجود ندارد، لطفا دوباره وارد شوید')
                return  res.redirect('/user/password')
            }

            const result = await this.validationData(req , res)
            console.log(result)
            if(! result){
                // req.flash('valid' , )
                return  res.render('home/userPanel/password' , { user , valid : true })

            }
            
            
            // const hashedPassword = await  user.hashPassword(req.body.newPassword)

            // console.log(hashedPassword)

            await user.$set('password' , user.hashPassword(req.body.newPassword))

            await user.save();

            // const updatedUser = await user.update({ $set : { 
            //     password : hashedPassword
            // }})

            // console.log(updatedUser)


            req.flash('validationMessage' , 'تغییر اطلاعات با موفقیت انجام شد')
            res.redirect('/user/password')
            



        } catch (err) {
            console.log(err)
            next(err)
        }
    }

    async phoneNumberForm(req , res , next){
        try {
            const id = req.user.id
            this.isMongoId(id)
            const user = await User.findById(id).select('_id username email fullName address idcardNumber birthDate createdAt updatedAt shopped vipType vipTime avatar')
            
            
            res.render('home/userPanel/phoneNumber' , { user })

        } catch (err) {
            console.log(err);
            next(err);
        }

    }

    async activeByPhoneNumber( req , res , next){
        try {   
            console.log(req.body.phonenumber)

            client.autoSendCode('09367449229' , "Signiture Footer For Branding")
            .then( (messageId)=>{
                console.log("message ID is :" , messageId)

            })
            .catch(err => console.log(err))

                        
            // client.manualSendCode("09301234567", "Verification Code: 595783 \nTrez WebService SMS")
            // .then((messageId) => {
            //     console.log("Sent Message ID: " + messageId);
            // })
            // .catch(error => console.log(error));


            
            res.redirect('/user/phoneNumber')

            // client.checkCode("09301234567", "595783")
            // .then((isValid) => {
            //     if (isValid) {
            //         console.log("Code 595783 for this number 09301234567 is valid and verified.");
            //     }
            //     else {
            //         console.log("Provided code for that number is not valid!");
            //     }
            // })
            // .catch(error => console.log(error));
        } catch (err) {
            console.log(err);
            next(err)
        }
    }

    async deviceManager(req , res , next){
        try {
            
            

        } catch (err) {
            console.log(err)
            next(err);
        }
    }


}



module.exports = new userController();