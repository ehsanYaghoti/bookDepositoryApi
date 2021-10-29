const Controller = require('../controller');
const Book = require('app/models/book');
const Category = require('app/models/category');


class bookController extends Controller {

    async index(req , res){ 
        try {

        const options = {
        
            page :  req.query.page || 1 ,
            limit : req.query.limit || 10 ,
            sort : { title : req.query.sortBookName } ,
            select :  '_id title author translator publisher language price categories' ,
            populate : 'categories'

        }

        let title = new RegExp(req.query.name , 'g')

        
        let books = await Book.paginate({ $or : [{title } , {author : title} ]} , options)

        if(books.docs.length === 0){ return res.json({ data : ' محصول جهت نمایش وجود ندارد' , 
            success : false
        })}


        return res.json({
            data :  books ,
            success : true
        })
    } catch (err) {
            
        return res.json({
            data :  err ,
            success : false
        })
    }


    }

    async create(req , res) {
        try {


            const result = await this.validationData(req , res)
            if(! result){
                return res.json({
                    success : result ,
                    messages : req.flash('validationMessage'),
                })
            }
                
        

            const {
                title ,
                author ,
                translator ,
                statement ,
                publisher ,
                publicationDate ,
                publicationPlace ,
                ISBN ,
                language ,
                dimensions ,
                weight ,
                image ,
                price ,
                discount,
                rating ,
                categories,
                tags 
            } = req.body

            
            let categoriesArray = categories.split(',')
            

            let images = this.imageResize(req.file)
            const newBook = new Book({
                user : req.user._id,
                title ,
                slug : this.slug(title) ,
                author ,
                translator : translator === '' ? null : translator ,
                statement ,
                publisher ,
                publicationDate ,
                publicationPlace ,
                ISBN ,
                language ,
                dimensions ,
                weight ,
                image ,
                images ,
                thumb : images[480],
                price ,
                discount,
                rating ,
                categories : categoriesArray,
                tags 
            })

            await newBook.save();

            return res.json({
                data : newBook,
                success : true
            })

        } catch (err) {
            console.log(err)
            return res.json({
                data : err,
                success : false
            })
        }
    }

    async updateForm (req , res) {
        try {

        this.isMongoId(req.params.id)
        const book = await Book.findById(req.params.id).populate({path : 'categories' , select : '_id name'})
        const categories = await Category.find({})

        if(! book){ this.error(404 , 'چنین محصول ای یافت نشد')};

        return res.json({
            data : book ,
            categories,
            success : true
        })
                    
    } catch (err) {
        return res.json({
            data : err ,
            success : true
        })
    }
    }

    async update(req , res) {
        try {

            const result = await this.validationData(req , res)
            if(! result){
                return res.json({
                    success : result ,
                    messages : req.flash('validationMessage'),
                })
            }

            const {
                title ,
                author ,
                translator ,
                statement ,
                publisher ,
                publicationDate ,
                publicationPlace ,
                ISBN ,
                language ,
                dimensions ,
                weight ,
                image ,
                price ,
                discount ,
                rating ,
                categories ,
                tags 
            } = req.body

            let categoriesArray = categories.split(',')

            const book = await Book.findById(req.params.id)

            let images = book.images
            if(req.file){
                images = this.imageResize(req.file)
            } else {
                images = book.images
            }

            await Book.findByIdAndUpdate(req.params.id ,  {$set : {
                user : req.user._id,
                title ,
                slug : this.slug(title) ,
                author ,
                translator ,
                statement ,
                publisher ,
                publicationDate ,
                publicationPlace ,
                ISBN ,
                language ,
                dimensions ,
                weight ,
                image ,
                images ,
                thumb : images[480],
                price ,
                rating ,
                discount,
                categories : categoriesArray,
                tags 
            }})


            return res.json({
                data : 'updated',
                success : true
            })

        } catch (err) {
            console.log(err)
            return res.json({
                data : err,
                success : false
            })
        }
    }

    async delete(req , res , next) {
        try {
            this.isMongoId(req.params.id)
            const book = await Book.findById(req.params.id)
            // return res.json(category.childrens)
            if(! book){ this.error(404 , 'چنین محصول ای یافت نشد')};
    
            await book.deleteOne()    
            

            return res.json({
                data : 'deleted',
                success : true
            })

        } catch (err) {
            return res.json({
                data : this.error(404,  err),
                success : false
            })
        }
    }

}



module.exports = new bookController();