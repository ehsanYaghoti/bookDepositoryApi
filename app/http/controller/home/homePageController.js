const User = require('app/models/user');
const Book = require('app/models/book');

class homePageController {

    async index(req , res , next){
        try {
            const books = await Book.find({})

            // console.log(books)

            const title = 'صفحه اصلی'
            res.render('home/index' , { title , books })
            
        } catch (err) {
            console.log(err);
            next(err);
        }
    }


}

module.exports = new homePageController();