const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const basketSchema = Schema({
    username : {type : String , required : true},
    books : [{type : Schema.Types.ObjectId , ref : 'Book'}],
    

},{timestamps : true })


module.exports = mongoose.model('Basket' , basketSchema)