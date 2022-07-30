const { Joi } = require('celebrate')

const RegisterSerializer = Joi.object().keys({
    username: Joi.string().required(),
    email: Joi.string().required(),
    password: Joi.string().required(),
    confirm_password: Joi.ref('password'),
    birth_date: Joi.date().required()
})

const LoginSerializer = Joi.object().keys({
    email: Joi.string().required(),
    password: Joi.string().required()
})

const CommentSerializer = Joi.object().keys({
    caption: Joi.string().required(),
})


module.exports = { RegisterSerializer, LoginSerializer, CommentSerializer }