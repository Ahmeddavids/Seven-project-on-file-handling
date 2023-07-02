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
    }],
    public_id: [{
        type: String
    }]
}, {timestamps: true});


const productModel = mongoose.model('multipleMulter/cloud', productSchema)

module.exports = productModel