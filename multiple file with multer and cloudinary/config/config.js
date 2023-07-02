require('dotenv').config()
const mongoose = require('mongoose')

const url = process.env.ATLAS_LOGIN

mongoose.connect(url).then(() => {
    console.log('Database connected successfully');
}).catch((e) => {
    console.log(e.message);
})