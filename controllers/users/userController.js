const express = require('express')
const router = express.Router()
const { User } = require('../../models')
const { celebrate, Joi, errors, Segments } = require('celebrate')
const { RegisterSerializer, LoginSerializer } = require('../../serializers')

router.post('/register', 

    celebrate({
        [Segments.BODY]: RegisterSerializer
    }), 

    async (req, res, next) => {
        
        res.setHeader('Content-Type', 'application/json')
        let { email, username, password, birth_date } = req.body

        if(!email || !username || !password || !birth_date){
            return res
            .status(200)
            .end(JSON.stringify({ success: false, message: "invalid input was passed" })) 
        }

        let user = await User.findAll({
            where: {
                email: email
            }
        })

        if(user.length > 0){
            return res
            .status(400)
            .end(JSON.stringify({ success: false, message: "user with email already exists" }))
        }
        user = User.create({ email, username, password, birth_date })
        return res
                .end(JSON.stringify({ success: true, message: "successfully created user" }))
})

router.post('/login', 
    celebrate({
        [Segments.BODY]: LoginSerializer
    }),

    (req, res, next) => {
        let { email, password } = req.body
    }
)

module.exports = router