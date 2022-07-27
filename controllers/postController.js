const express = require('express')
const router = express.Router()
const { Post } = require('../models')
const fileUpload = require('express-fileupload')
const cloudinary = require('cloudinary').v2

router.post('/post', fileUpload(), async (req, res) => {
    // get user through auth middleware
    let { caption } = req.body
    let user = req.user
    let image_urls = Array.from(req.files)
                        .filter((file) => file.fieldName === "images")
                        .map((file) => {
                            // upload file, push resulting url to new array
                            let [ name, extension ] = file.name.split('.')
                            if(!extension in ['jpg', 'jpeg', 'png']){
                                return res.status(400)
                                            .end({success: false, message: 'Invalid file format was provided'})
                            }
                            file = cloudinary.uploader.upload(file).secure_url
                        })
    console.log(image_urls)
    await Post.create({
        caption: caption,
        images: image_urls,
        userId: user.id
    })

    return res.json({'success': true, 'message': 'Successfully created post'})
            .end()
})