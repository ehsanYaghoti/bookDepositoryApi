const autoBind = require('auto-bind');
const { validationResult } = require('express-validator');
const Recaptcha = require('express-recaptcha').RecaptchaV2
const isMongoId = require('validator/lib/isMongoId');
const sharp = require('sharp');
const path = require('path');

module.exports =  class controller {
    constructor(){
        autoBind(this),
        this.setConfigRecaptcha()
    }
    
    setConfigRecaptcha(){
        this.recaptcha = new Recaptcha('6LdQCnYaAAAAAJORGrWxBlb_U5cYNGi9LHqzNABx' ,
                                        '6LdQCnYaAAAAAJyTzK9JXwvqJ2pvB_bZDi25jXJQ',
                                        {hl : 'fa'}) 
    }


    recaptchaValidation(req , res){
        return new Promise((resolve , reject)=>{
            this.recaptcha.verify(req , (err , data)=>{
                if(err){
                    req.flash('validationMessage' , 'گزینه امنیتی مربوط به شناسایی ربات خاموش می باشد،لطفا مجدداً تلاش بفرمایید');
                    return this.back(req , res);
                } else {
                    resolve(true)
                }
            })
        })

    }



    validationData(req , res){
        let errors = validationResult(req).errors
        let errorMessages = [] 
        errors.forEach(element => {
            errorMessages.push(element.msg)
        });
        
        if(errorMessages.length){
            req.flash('validationMessage' , errorMessages)
            return false;
        }  

        return true;
    }

    back(req , res) {
        // console.log(req.body)
        req.flash('formData' , req.body)
        res.redirect(`${req.header('Referer')}`)
    }

    sweetAlert(req , data) {
        let title = data.title || '',
            message = data.message || '',
            type = data.type || 'info',
            button = data.button || null,
            timer = data.timer || 2000

        req.flash('sweetalert' , { title , message , type , button , timer })
    }


    slug(title){
        return title.replace(/([^a-zA-Z0-9آ-ی۰-۹]|-)+/g , "-")
    }

    isMongoId(idParam){
        if( ! isMongoId(idParam)){
            return this.error(404 , "آی دی وارد شده صحیح نمی باشد")
        }
    }

    error(status = 500 , message){
        let err = new Error(message)
        err.status = status
        console.log(err)
        throw err;
    }

    apiError(status = 500 , message){
        let err = new Error(message)
        err.status = status
        console.log(err)
        res.json({
            data : err ,
            success : false
        })
    }

    imageResize(image , res){
        const imageInfo = path.parse(image.path)
        let AddressImages = {}
        AddressImages['original'] = this.getUrlImages(`${image.destination}/${image.filename}`)
        
        const resize = size =>{
            let imageName = `${imageInfo.name}-${size}${imageInfo.ext}`
            AddressImages[size] = this.getUrlImages(`${image.destination}/${imageName}`)
            sharp(image.path)
            .resize(size , null)
            .toFile(`${image.destination}/${imageName}`)
        }
        let imageSizes = [1080 , 720 , 480 , 360]
        
        imageSizes.map(resize)
            
        return AddressImages
    }

    getUrlImages(dir){
        return dir.substr(8);
    }



}