const mongoose = require('mongoose')

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    images: [{
        type: String,
        require: true
    }]
}, {timestamps: true});


const productModel = mongoose.model('multer-products', productSchema)

module.exports = productModel