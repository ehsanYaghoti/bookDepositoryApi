const mongoose = require('mongoose')
const Schema = mongoose.Schema
const shoppedSchema =   Schema({
    user : {type : Schema.Types.ObjectId , ref : 'User'},
    book : {type : Schema.Types.ObjectId , ref : 'Book'},
},{timestamps : true })

module.exports = mongoose.model('Shopped' , shoppedSchema)