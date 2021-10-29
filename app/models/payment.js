const mongoose = require('mongoose')
const Schema = mongoose.Schema
const paymentSchema =   Schema({
    user : {type : Schema.Types.ObjectId , ref : 'User'},
    book : {type : Schema.Types.ObjectId , ref : 'User'},
    vip : {type : Boolean , default : 0},
    payment : {type : Boolean , default : 0},
    resNumber : {type : Number , required : true},
    price : {type : String , required : true},
},{timestamps : true })

module.exports = mongoose.model('Payment' , paymentSchema)