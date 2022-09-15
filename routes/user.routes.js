const { createNewUser, getUserById, createAuthToken } = require('../controllers/user.controller')
const express = require('express')
const { celebrate, Segments } = require('celebrate')
const { RegisterSerializer } = require('../serializers')

const router = express.Router()


router
    .route('/')
    .post(celebrate({ [Segments.BODY]: RegisterSerializer }), createNewUser)

router
    .route('/:user_id')
    .get(getUserById)

router
    .route('/get-token')
    .post(createAuthToken)

module.exports = router