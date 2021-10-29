const Controller = require('../controller');
const Article = require('app/models/article');
const Category = require('app/models/category');


class articleController extends Controller {

    async index(req , res , next){ 
        try {
        // console.log(req.query)

        const options = {
        
            page :  req.query.page || 1 ,
            limit : req.query.limit || 10 ,
            sort : { title : req.query.sortArticleName } ,
            select :  '_id title books categories user' ,
            populate : ['books' ,
            {path : 'user' , select : '_id username'} , 
            {path : 'categories' , select : '_id name'}
            ]

        }

        let title = new RegExp(req.query.name , 'g')

        
        let articles = await Article.paginate({ $or : [{title } , {statement : title} ]} , options)

        // console.log(articles)
        if(articles.docs.length === 0){ return res.json({ data : ' مقاله جهت نمایش وجود ندارد' , 
            success : false
        })}


        return res.json({
            data :  articles ,
            success : true
        })
    } catch (err) {
        console.log(err)
        res.json({
            data :  'err' ,
            success : false
        })
        next();
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
            statement ,
            image ,
            books,
            categories,
        } = req.body

        const newArticle = new Article({
            user : req.user._id,
            title ,
            slug : this.slug(title) ,
            statement ,
            image ,
            books,
            categories,
        })

        await newArticle.save();

        return res.json({
            data : newArticle,
            success : true
        })

        } catch (err) {
            return res.json({
                data : err,
                success : false
            })
        }
    }

    async updateForm (req , res , next) {
        try {

        this.isMongoId(req.params.id)
        const article = await Article.findById(req.params.id)
        const categories = await Category.find({})

        if(! article){ this.error(404 , 'چنین مقاله ای یافت نشد')};

        // console.log(category , categories)


        return res.json({
            data : article ,
            categories,
            success : true
        })
                    
    } catch (err) {
        console.log(err)
        res.json({
            data : 'server error' ,
            success : true
        })
        next();
    }
    }

    async update(req , res , next) {
        try {

            const result = await this.validationData(req , res)
            if(! result){
                console.log('validation')
                return res.json({
                    success : result ,
                    messages : req.flash('validationMessage'),
                })
            }

            const {
                title ,
                statement ,
                books,
                image ,
                categories,
            } = req.body

            // console.log(req.body)
            await Article.findByIdAndUpdate(req.params.id ,  {$set : {
                user : req.user._id,
                title ,
                slug : this.slug(title) ,
                statement ,
                books,
                image ,
                categories ,
            }})


            return res.json({
                data : 'updated',
                success : true
            })

        } catch (err) {
            console.log(err)
            res.json({
                data : err,
                success : false
            })
            next();
        }
    }

    async delete(req , res , next) {
        try {
            this.isMongoId(req.params.id)
            const article = await Article.findById(req.params.id)
            // return res.json(category.childrens)
            if(! article){ this.apiError(404 , 'چنین مقاله ای یافت نشد')};
    
            await article.deleteOne()    
            

            return res.json({
                data : 'deleted',
                success : true
            })

        } catch (err) {
            console.log(err)
            res.json({
                data : this.apiError(404,  err),
                success : false
            })
            next();
        }
    }

}



module.exports = new articleController();