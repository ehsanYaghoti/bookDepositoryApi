const mongoose = require('mongoose');
const uniqueString = require('unique-string');
const bcrypt = require('bcrypt');
const Schema = mongoose.Schema
const mongoosePaginate  = require('mongoose-paginate-v2');

const userSchema = Schema({
    username : {type : String , required : true},
    email : {type : String , required : true},
    password : {type : String , required :true},
    rememberToken : {type : String , default : null},
    admin : {type : Boolean , default : false},
    active : {type : Boolean , default : false},
    activePhoneNumber : {type : Boolean , default : false},
    phoneNumber : {type : String , default : null},
    roles : [{type : Schema.Types.ObjectId , ref : 'Role'}],
    vip : {type : Boolean , default : false},
    vipTime : {type : Date , default : new Date().toISOString()},
    vipType : {type : String , default : 'month'},
    shopped : [{type : Schema.Types.ObjectId , ref : 'shopped'}],
    avatar :  {type : String , default : null},
    fullName :  {type : String , default : null},
    birthDate :  {type : String , default : null},
    idcardNumber :  {type : Number , default : null},
    address :  {type : String , default : null},


},{timestamps : true })

userSchema.plugin(mongoosePaginate);


userSchema.methods.setRememberToken = function(res , days = 90) {
    const token = uniqueString();
    res.cookie('remember_token' , token , { maxAge : 1000 * 60 * 60 * 24 * days , signed : true});
    this.updateOne({rememberToken : token} , (err)=>{
        if(err)    console.log(err);
    })
}


userSchema.methods.hashPassword = function (password) {
    const salt = bcrypt.genSaltSync(15);
    const hash = bcrypt.hashSync(password , salt);
    return hash;
} 


userSchema.methods.comparePassword = function(password) {
    return bcrypt.compareSync(password  , this.password)
}

module.exports = mongoose.model('User' , userSchema)