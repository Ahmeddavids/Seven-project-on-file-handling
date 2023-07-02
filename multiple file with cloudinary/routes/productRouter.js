const express = require('express')
const router = express.Router()
const { createProduct, getAll, getOne, updateProduct, deleteProduct } = require('../controllers/productController')

router.post('/product', createProduct)

router.get('/product', getAll)

router.get('/product/:id', getOne)

router.patch('/product/:id', updateProduct)

router.delete('/product/:id', deleteProduct)



module.exports = router