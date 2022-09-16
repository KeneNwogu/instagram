const { createNewUser, getUserById, createAuthToken, getCurrentUser, getFollowing, getFollowers, followOrUnfollowUser } = require('../controllers/user.controller')
const express = require('express')
const { celebrate, Segments } = require('celebrate')
const { RegisterSerializer } = require('../serializers')
const { isAuthenticated } = require('../middlewares/authMiddleware')

const router = express.Router()


router
    .route('/')
    .post(celebrate({ [Segments.BODY]: RegisterSerializer }), createNewUser)

router
    .route('/get-token')
    .post(createAuthToken)

router
    .route('/me')
    .get(isAuthenticated, getCurrentUser)

router
    .route('/:user_id')
    .get(getUserById)

router
    .route('/:user_id/followers')
    .get(getFollowers)
    .post(isAuthenticated, followOrUnfollowUser)

router
    .route('/:user_id/following')
    .get(getFollowing)

module.exports = router