const express = require('express')
const router = express.Router()
const { Post, Comment, User, Like, sequelize } = require('../models')
const fileUpload = require('express-fileupload')
const cloudinary = require('cloudinary').v2
const authMiddleware = require('../middlewares/authMiddleware')
const fs = require('fs')
const { celebrate, Segments } = require('celebrate')
const { CommentSerializer } = require('../serializers')
// const { User } = require('../schemas')

// TODO: add isAuthenticatedOrReadOnly to this endpoint
const getAllPosts = async (req, res) => {
    try{
        let posts = await Post.getAllPosts()
        return res.json({ success: true, posts: posts }).end()
    }
    catch(err){
        console.log(err.message)
        return res.status(500).json({ success: false }).end()
    }
}

const createPost = async (req, res) => {
    let { caption } = req.body
    let user = req.user

    if(!caption && req.files.images.length < 1) return res.status(400).end({success: false, message: 'Provide a caption or post'}) 

    try {
        let image_urls = await Promise.all(req.files.images
            .map(async (file) => {
                // upload file, push resulting url to new array
                let [ name, extension ] = file.name.split('.')
                if(!extension in ['jpg', 'jpeg', 'png']){
                    return res.status(400).end({success: false, message: 'Invalid file format was provided'})
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
    
        return res.json({'success': true, 'message': 'Successfully created post'}).end()
    }
    catch(err){
        return res.status(500).json({success: false}).end()
    }
}

const deletePost = async (req, res) => {
    let post_id = req.params.post_id
    try {
        let post = await Post.getPostById(post_id);
        if(post === null){
            return res.status(404).json({success: false, message: "post has been deleted or does not exist"}).end()
        }
        
        if (post.UserId === req.user.id) await post.destroy(); 
        else return res.status(403).json({ success: false, message: "user is not authorised to delete this post"})

        return res.json({ success: true }).end()
    }
    catch(err) {
        return res.status(500).json({success: false}).end()
    }
}

const getPostById = async (req, res) => {
    let post_id = req.params.post_id
    try {
        let post = await Post.getPostById(post_id);
        if(post === null){
            return res.status(404).json({success: false, message: "post has been deleted or does not exist"}).end()
        }
        return res.json(post.toJSON()).end()
    }
    catch(err) {
        return res.status(500).json({success: false}).end()
    }
}

const createComment = async (req, res) => {
    try{
        let post_id = req.params.post_id
        let post = await Post.getPostById(post_id)
        if (post === null) return res.end(JSON.stringify({ success: false, message: "post does not exist or has been deleted"}))
    
        post.addComment(req.body.caption, req.user.id)
        return res.end(JSON.stringify({ success: true, message: "successfully added comment."}))
    }
    catch(err){
        res.status(500).json({ success: false }).end()
    } 
}

const likeOrUnlikePost = async (req, res) => {
    let post_id = req.params.post_id
    try {
        let post = await Post.getPostById(post_id)
        if (post === null) return res.end(JSON.stringify({ success: false, message: "post does not exist or has been deleted"}))

        let like = await Like.getLike(post.id, req.user.id)
        let liked = false

        if (like !== null) {
            await Like.unLikePost(post.id, req.user.id)
        }
        else{
            await Like.likePost(post.id, req.user.id)
            liked = true
        }

        return res.end(JSON.stringify({ success: true, liked }))

    } catch (error) {
        res.status(500).json({ success: false }).end()
    }
}

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
    
        return res.status(404).json({ success: false, message: "post not found" })
                .end()
    }
    catch(err) {
        res.status(500).json({ success: false }).end()
    } 
})

module.exports = {
    getAllPosts,
    createPost,
    getPostById,
    createComment,
    likeOrUnlikePost,
    deletePost
}