const mongoose = require('mongoose');
const Schema = mongoose.Schema
const mongoosePaginate  = require('mongoose-paginate-v2');

const commentSchema =   Schema({
    user : {type : Schema.Types.ObjectId , ref : 'User' },
    book : {type : Schema.Types.ObjectId , ref : 'Book' , default : undefined},
    article : {type : Schema.Types.ObjectId , ref : 'Article'  , default : undefined},
    parent : {type : Schema.Types.ObjectId , ref : 'Comment' , default : null},
    approved : {type : Boolean , default : 0},
    statement : {type : String , required : true}
},{timestamps : true , toJSON : { virtuals : true}})

commentSchema.plugin(mongoosePaginate);

commentSchema.virtual('comments' , {
    ref : 'Comment',
    localField : '_id',
    foreignField : 'parent'
});

const commentBelong = doc => {
    // console.log(doc)
    if(doc.book){
        return 'Book';
    } else if(doc.article){
        return 'Article';
    }
}

commentSchema.virtual('belongsTo' , {
    ref : commentBelong,
    localField : doc => commentBelong(doc).toLowerCase() ,
    foreignField : '_id',
    justOne : true
})


module.exports = mongoose.model('Comment' , commentSchema)