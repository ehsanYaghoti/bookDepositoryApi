const express =  require('express')
const router = express.Router();
const api_v1 = require('./v1')
const api_v1_1 = require('./v1.1')

router.use('/api/v1' , api_v1)
router.use('/api/v1.1' , api_v1_1)


module.exports = router;