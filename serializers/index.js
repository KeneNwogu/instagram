const { Joi } = require('celebrate')

const RegisterSerializer = Joi.object().keys({
    username: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().required(),
    confirm_password: Joi.ref('password'),
    birth_date: Joi.date().required()
})

const UserSerializer = Joi.object().keys({
    username: Joi.string(),
    email: Joi.string().email(),
    birth_date: Joi.date(),
    bio: Joi.string().min(10).max(100)
})

const LoginSerializer = Joi.object().keys({
    email: Joi.string().required(),
    password: Joi.string().required()
})

const CommentSerializer = Joi.object().keys({
    caption: Joi.string().required(),
})


module.exports = { RegisterSerializer, LoginSerializer, CommentSerializer, UserSerializer }