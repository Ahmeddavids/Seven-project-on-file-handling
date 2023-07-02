const express = require('express')
const fileUploader = require('express-fileupload')

require('./config/config')
const productRouter = require('./routes/productRouter')
const PORT = 2026

const app = express()
app.use(express.json())
app.use(fileUploader({useTempFiles: true}))


app.use('/api', productRouter)

app.listen(PORT, () => {
        console.log(`Server is listening to port: ${PORT}`);
})