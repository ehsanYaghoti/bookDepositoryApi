const mongoose = require('mongoose');
const Schema = mongoose.Schema ;
const mongoosePaginate  = require('mongoose-paginate-v2') ;

const BookSchema =  Schema({
    user : {type : Schema.Types.ObjectId , ref : 'User'},
    title : {type : String , required : true},
    slug : {type : String , required : true},
    author : {type : String , required : true},
    translator : {type : String , default : null},
    statement : {type : String , required :true},
    publisher : {type : String , required : true},
    publicationDate : {type : String , required : true},
    publicationPlace : {type : String , required : true},
    ISBN : {type : String , required : true},
    language : {type : String , required : true},
    dimensions : {type : String , required : true},
    weight : {type : String , required : true},
    image : {type : String , required : true},
    images : {type : Object , required : true},
    thumb : {type : String , required : true },
    price : {type : Number , required : true},
    discount : {type : Number , default : 0},
    rating : {type : Number , default : 0},
    commentCount : {type : Number , default : 0},
    viewCount : {type : Number , default : 0},
    categories : [{type : Schema.Types.ObjectId , ref : 'Category'}],
    tags : {type : String , required : true},
},{timestamps : true  , toJson : { virtuals : true}})


BookSchema.plugin(mongoosePaginate);

BookSchema.methods.path = function(){
    return `/books/${this.slug}`
}

BookSchema.virtual('comments' , {
    ref : 'Comment',
    localField : '_id',
    foreignField : 'book'
})

module.exports = mongoose.model('Book' , BookSchema);