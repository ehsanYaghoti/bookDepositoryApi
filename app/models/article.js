const mongoose = require('mongoose')
const Schema = mongoose.Schema
const mongoosePaginate  = require('mongoose-paginate-v2') ;


const ArticleSchema =  Schema({
    user : {type : Schema.Types.ObjectId , ref : 'User'},
    books : [{type : Schema.Types.ObjectId , ref : 'Book'}],
    authors : [{type : Schema.Types.ObjectId , ref : 'Author'}],
    categories : [{type : Schema.Types.ObjectId , ref : 'Category'}],
    title : {type : String , required : true},
    slug : {type : String , required : true},
    image : {type : String , required : true},
    statement : {type : String , required : true},
    commentCount : {type : Number , default : 0},
    viewCount : {type : Number , default : 0},
},{timestamps : true , toJson : { virtuals : true} })

ArticleSchema.plugin(mongoosePaginate);


ArticleSchema.virtual('comments' , {
    ref : 'Comment',
    localField : '_id',
    foreignField : 'article'
})

module.exports = mongoose.model('Article' , ArticleSchema)