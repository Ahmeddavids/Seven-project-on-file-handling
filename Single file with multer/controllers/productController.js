const productModel = require('../models/productModel');
const fs = require('fs')
const validator = require('fastest-validator')

// Create a new product
const createProduct = async (req, res) => {
    try {
        const {name, price} = req.body;
        const product = new productModel({
            name,
            price,
            image: req.file.filename
        })

        // validate users input using the fastest-validtor
        const validateSchema = {
            name: {type: "string", optional: false, min: 4, max: 50},
            price: {type: "number", optional: false, min: 3, max: 1000000},
            image: {type: "string", optional: false}
        }
        const v = new validator();
        const validation = v.validate(product, validateSchema)
        if(!validation) {
            res.status(400).json({
                message: 'Error trying to validate',
                Error: validation[0].message
            })
        }
        // save  the corresponding input into the database
        const savedProduct = await product.save()
        if(!savedProduct){
            res.status(400).json({
                message: 'Product not created'
            })
        } else {
            res.status(201).json({
                message: 'Product created successfully',
                data: savedProduct
            })
        }
    } catch (error) {
        res.status(500).json({
        Error: error.message
        })
    }
}

// Get all products
const getAll = async (req, res) => {
    try {
        const allProducts = await productModel.find()
        if(allProducts.length === null) {
            res.status(200).json({
                message: 'There are no products in this databse'
            })
        } else{
            res.status(200).json({
                message: `List of all products in this databse`,
                data: allProducts,
                totalProducts: `The total number of products are ${allProducts.length}`
            })
        }
    } catch (error) {
        res.status(500).json({
        Error: error.message
        })
    }
}


// Getting one product
const getOne = async (req, res) => {
    try {
        const productId = req.params.id
        const oneProduct = await productModel.findById(productId)

        if(!oneProduct) {
            res.status(404).json({
                message: `Product with id: ${productId} not found`
            })
        } else {
            res.status(200).json({
                message: 'Product information displaying',
                data: oneProduct
            })
        }
    } catch (error) {
        res.status(500).json({
            Error: error.message
        })
    }
}

// updating a product
const updateProduct = async (req, res) => {
    try {
        const productId = req.params.id
        const product = await productModel.findById(productId)
        const {name, price} = req.body
        if(!product) {
            res.status(404).json({
                message: `Product with id: ${productId} not found`
            })
        } else {
            const bodyData = {
                name: name || product.name,
                price: price || product.price,
                image: product.image
            }
            
            if (req.file && req.file.filename) {
                const oldImage = `uploads/${product.image}`
                if(fs.existsSync(oldImage)){
                    fs.unlinkSync(oldImage)
                }
                bodyData.image = req.file.filename
            }
            const newProduct = await productModel.findByIdAndUpdate(productId, bodyData, {new: true})
            if (newProduct) {
                res.status(200).json({
                    message: `Product successfully updated`,
                    data: newProduct
                })
            } else {
                res.status(400).json({
                    message: 'Can not update product'
                })
            }
        }
    } catch (error) {
        res.status(500).json({
            Error: error.message
        })
    }
}


// deleting a product
const deleteProduct = async (req, res) => {
    try {
        const productId = req.params.id
        const product = await productModel.findById(productId)
        if(!product) {
            res.status(404).json({
                message: `Product with id: ${productId} not found`
            })
        } else {

            const oldimage = `uploads/${product.image}`
            if(fs.existsSync(oldimage)){
                fs.unlinkSync(oldimage)
            }
            const deletedProduct = await productModel.findByIdAndDelete(productId)
            if (deletedProduct) {
                res.status(200).json({
                    message: `Product successfully deleted`,
                    data: deletedProduct
                })
            } else {
                res.status(400).json({
                    message: 'Can not delete product'
                })
            }
        }
    } catch (error) {
        res.status(500).json({
            Error: error.message
        })
    }
}












module.exports = {
    createProduct,
    getAll,
    getOne,
    updateProduct,
    deleteProduct
}