const express = require('express')
const router = express.Router()
const upload  = require('../utils/multer')
const { createProduct, getAll, getOne, updateProduct, deleteProduct, updateProductIndex } = require('../controllers/productController')

router.post('/product', upload.fields([{name: 'images', min: 3}]), createProduct)

router.get('/product', getAll)

router.get('/product/:id', getOne)

router.patch('/product/:id', upload.fields([{name: 'images', min: 3}]), updateProduct)

router.delete('/product/:id', deleteProduct)

// router.patch('/product/:id/image/:imageIndex', upload.fields([{name: 'images'}]), updateProductIndex)


module.exports = router