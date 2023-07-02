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
    image: {
        type: String,
        require: true
    },
    public_id: {
        type: String
    }
}, {timestamps: true});


const productModel = mongoose.model('single-cloudinary', productSchema)

module.exports = productModel