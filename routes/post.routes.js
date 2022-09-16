const express = require('express')
const { celebrate, Segments } = require('celebrate')
const { isAuthenticated } = require('../middlewares/authMiddleware')
const { getAllPosts, createPost, getPostById, createComment, likeOrUnlikePost } = require('../controllers/post.controller')
const { CommentSerializer } = require('../serializers')
const fileUpload = require('express-fileupload')

const router = express.Router()

router
    .route('/')
    .get(getAllPosts)
    .post([isAuthenticated, fileUpload()], createPost)

router
    .route('/:post_id')
    .get(getPostById)

router
    .route('/:post_id/comments')
    .post([isAuthenticated, celebrate({ [Segments.BODY]: CommentSerializer })], createComment)

router
    .route('/:post_id/likes')
    .post(isAuthenticated, likeOrUnlikePost)
module.exports = router