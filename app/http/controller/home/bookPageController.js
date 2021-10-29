const User = require('app/models/user');
const Book = require('app/models/book');
const Category = require('app/models/category');


class homePageController {

    async single(req , res , next){
        try {

            const books = await Book.find({});
            const book = await Book.findOne({slug : req.params.slug}).populate({path : 'categories' , select : 'name slug _id'})

            // let statement = unescape(book.statement)

            // escape()

            // console.log(statement)

            const title = book.title

            res.render('home/books/single-book'  , {title , book , books})
            
        } catch (err) {
            console.log(err);
            next(err);
        }
    }

    
    async categoryPage(req , res , next){
        try {

            const category = await Category.findOne({slug : req.params.slug}).populate('childrens').exec()
            const books = await Book.paginate({categories : category._id} , {select : 'thumb title author publicationDate price discount'})



            // console.log(category.childrens)
            // console.log(books)

            const title = category.name

            res.render('home/books/books'  , {title ,  books , category })
            
        } catch (err) {
            console.log(err);
            next(err);
        }
    }

}


module.exports = new homePageController();