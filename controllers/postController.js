const express = require('express')
const router = express.Router()
const { Post, Comment, User, Like } = require('../models')
const fileUpload = require('express-fileupload')
const cloudinary = require('cloudinary').v2
const authMiddleware = require('../middlewares/authMiddleware')
const bcrypt = require('bcrypt')
const fs = require('fs')
const { celebrate, Segments } = require('celebrate')
const { CommentSerializer } = require('../serializers')
// const { User } = require('../schemas')

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

router.get('/:post_id/comments', async (req, res) => {
    let post_id = req.params.post_id
    try {
        let post = await Post.findOne({
            where: {
                id: post_id
            },
            include: [
                { model: User, attributes: ['username'], as: 'user'},
                { 
                    model: Comment, 
                    include: { model: User, attributes: ['username'], as: 'user' }, 
                    as: 'comments', 
                    attributes: ['caption', 'createdAt'], 
                }
            ]
        })
        return res.json(post)
            .end()
    }
    
    catch(err) {
        console.log(err)
        res.status(500)
        .json({success: false})
        .end()
    }
})

router.post('/:post_id/comments', [
    celebrate({
        [Segments.BODY]: CommentSerializer
    }), authMiddleware.isAuthenticated], 
    async (req, res) => {
        res.setHeader('Content-Type', 'application/json')
        try{
            let post_id = req.params.post_id
            let post = await Post.findOne({
                where: {
                    id: post_id
                }
            })
            if (post === null) {
                return res.end(JSON.stringify({ success: false, message: "post does not exist or has been deleted"}))
            }
            await Comment.create({
                caption: req.body.caption,
                PostId: post_id,
                UserId: req.user.id
            })
            return res.end(JSON.stringify({ success: true, message: "successfully added comment."}))
        }
        catch(err){
            console.log(err)
            res.status(500).json({ success: false }).end()
        }   
    }
)


router.post('/:post_id/like', authMiddleware.isAuthenticated, async(req, res) => {
    let post_id = req.params.post_id
    try{
        let post = await Post.findOne({
            where: {
                id: post_id
            }
        })
        if (post !== null) {
            let like = await Like.findOne({
                where: {
                    PostId: post_id,
                    UserId: req.user.id
                }
            })
    
            if (like !== null) {
                await Like.destroy({
                    where: {
                        PostId: post_id,
                        UserId: req.user.id
                    }
                })
                return res.json({ liked: false })
                        .end()
            }
            await Like.create({
                PostId: post_id,
                UserId: req.user.id
            }).catch((err) => console.log(err))
            return res.end(JSON.stringify({ liked: true }))
        }
        return res.end(JSON.stringify({ success: false, message: 'post was not found' }))
    }
    catch(err){
        res.status(500).json({ success: false }).end()
    }
})


router.get('/:post_id/likes', authMiddleware.isAuthenticated, async(req, res) => {
    let post_id = req.params.post_id
    try {
        let post = await Post.findOne({
            where: {
                id: post_id
            }
        })
    
        if (post !== null) {
            let likes = await Like.findAll({
                PostId: post_id,
                include: { model: User, as: 'user'},
                attributes: ['createdAt']
            }).catch(err => console.log(err))
            return res.json(likes).end()
        }
    
        return res.json({ success: false, message: "post not found" })
                .end()
    }
    catch(err) {
        res.status(500).json({ success: false }).end()
    } 
})

module.exports = router