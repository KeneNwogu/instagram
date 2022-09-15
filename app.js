const express = require('express')
const app = express()
const body_parser = require('body-parser')
const user_routes = require('./routes/user.routes.js')
const responseMiddleware = require('./middlewares/responseMiddleware')
const json_parser = body_parser.json()
const { errors } = require('celebrate')
const cloudinary = require('cloudinary').v2

const dotenv = require('dotenv')
dotenv.config()

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true
})

app.use(json_parser);
app.use(responseMiddleware.addJsonHeader)
app.use('/api/v1/users', user_routes)

app.use(errors());
app.listen(5000, () => {
    console.log('Server started')
})