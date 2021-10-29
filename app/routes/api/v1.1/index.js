const express =  require('express')
const app = express()
const router = express.Router();

router.get('/' , (req , res)=>{
    res.json('Welcome To Api V 1.1')
})


module.exports = router;