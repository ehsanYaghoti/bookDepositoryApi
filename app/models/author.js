const mongoose = require('mongoose');
const Schema = mongoose.Schema ;
const mongoosePaginate  = require('mongoose-paginate-v2') ;

const AuthorSchema =  Schema({
    user : {type : Schema.Types.ObjectId , ref : 'User'},
    name : { type : String , required : true },
    slug : {type : String , required : true},
    statement : {type : String , required :true},
    books : [{type : Schema.Types.ObjectId , ref : 'Book'}],
    articles : [{type : Schema.Types.ObjectId , ref : 'Article'}],
    categories : [{type : Schema.Types.ObjectId , ref : 'Category'}],

},{timestamps : true  , toJson : { virtuals : true}})


AuthorSchema.plugin(mongoosePaginate);




module.exports = mongoose.model('Author' , AuthorSchema);