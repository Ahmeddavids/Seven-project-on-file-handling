const productModel = require('../models/productModel');
const cloudinary = require('../utils/cloudinary')
const validator = require('fastest-validator')

// Create a new product
const createProduct = async (req, res) => {
    try {
        const { name, price } = req.body;
        const imageUrls = []
        const publicIds = []
        // checks if the user is passing an image 
        if (req.files && req.files.images) {
            // iterates over the images being uploaded and get their paths
            for (const image of req.files.images) {
                // uploads the images to the cloudinary storage
                const file = await cloudinary.uploader.upload(image.tempFilePath, { folder: 'Class-Drill' });
                //   pushes the image urls and public ids into the arrays created above
                imageUrls.push(file.secure_url);
                publicIds.push(file.public_id);
            }
        }
        const product = new productModel({
            name,
            price,
            images: imageUrls,
            public_id: publicIds
        })

        // validate users input using the fastest-validtor
        const validateSchema = {
            name: { type: "string", optional: false, min: 4, max: 50 },
            price: { type: "number", optional: false, min: 3, max: 9999000000 },
            images: { type: "array", items: "string", optional: false }
        }
        const v = new validator();
        const validation = v.validate(req.body, validateSchema)
        if (!validation) {
            res.status(400).json({
                message: 'Error trying to validate',
                Error: validation[0].message
            })
            return;
        }

        // save  the corresponding input into the database
        const savedProduct = await product.save()
        if (!savedProduct) {
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
        if (allProducts.length === null) {
            res.status(200).json({
                message: 'There are no products in this databse'
            })
        } else {
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

        if (!oneProduct) {
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
      const productId = req.params.id;
      const product = await productModel.findById(productId);
  
      if (!product) {
        return res.status(404).json({
          message: `Product with id: ${productId} not found`,
        });
      }
  
      const { name, price } = req.body;
      const data = {
        name: name || product.name,
        price: price || product.price,
      };
  
      // Handle image update
      if (req.files && req.files.images) {
        const updatedImageUrls = [];
        const updatedPublicIds = [];
  
        // Delete existing images in Cloudinary
        for (const publicId of product.public_id) {
          await cloudinary.uploader.destroy(publicId);
        }
  
        // Upload new images and store their URLs and public IDs
        for (const image of req.files.images) {
            const file = await cloudinary.uploader.upload(image.tempFilePath, { folder: 'Class-Drill' });
          updatedImageUrls.push(file.secure_url);
          updatedPublicIds.push(file.public_id)

        }
  
        // Replace the image URLs and public IDs with the updated ones
        data.images = updatedImageUrls;
        data.public_id = updatedPublicIds;
      }
  
      const updatedProduct = await productModel.findByIdAndUpdate(productId, data, { new: true });
  
      if (updatedProduct) {
        res.status(200).json({
          message: `Product successfully updated`,
          data: updatedProduct,
        });
      } else {
        res.status(400).json({
          message: 'Can not update product',
        });
      }
    } catch (error) {
      res.status(500).json({
        Error: error.message,
      });
    }
  };
  


// deleting a product
const deleteProduct = async (req, res) => {
    try {
        const productId = req.params.id
        const product = await productModel.findById(productId)
        if (!product) {
            res.status(404).json({
                message: `Product with id: ${productId} not found`
            })
        } else {
            for (const publicId of product.public_id) {
                await cloudinary.uploader.destroy(publicId);
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
    deleteProduct,
}