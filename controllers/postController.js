const express = require('express')
const router = express.Router()
const { Post } = require('../models')
const fileUpload = require('express-fileupload')
const cloudinary = require('cloudinary').v2
const authMiddleware = require('../middlewares/authMiddleware')
const bcrypt = require('bcrypt')
const fs = require('fs')

router.post('/', [fileUpload(), authMiddleware.isAuthenticated], async (req, res) => {
    // get user through auth middleware
    let { caption } = req.body
    let user = req.user

    let image_urls = await Promise.all(req.files.images
                        .map(async (file) => {
                            // upload file, push resulting url to new array
                            let [ name, extension ] = file.name.split('.')
                            if(!extension in ['jpg', 'jpeg', 'png']){
                                return res.status(400)
                                            .end({success: false, message: 'Invalid file format was provided'})
                            }
                            // TODO: sanitize filename 
                            let salt = name + extension
                            let path = __dirname + '/../tmp/' + file.name
                            file.mv(path)
                            file = await cloudinary.uploader.upload(path)
                            // delete newly created file
                            fs.unlinkSync(path)
                            return file.secure_url
                        }))
    await Post.create({
        caption: caption,
        images: image_urls,
        UserId: user.id
    })

    return res.json({'success': true, 'message': 'Successfully created post'})
            .end()
})

module.exports = router