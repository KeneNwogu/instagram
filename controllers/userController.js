const express = require('express')
const router = express.Router()
const { User, Followers } = require('../models')
const { Op } = require('sequelize')
const { celebrate, Joi, errors, Segments } = require('celebrate')
const { RegisterSerializer, LoginSerializer } = require('../serializers')
const user = require('../models/user')
const { isAuthenticated } = require('../middlewares/authMiddleware')

router.post('/register', 

    celebrate({
        [Segments.BODY]: RegisterSerializer
    }), 

    async (req, res, next) => {
        
        res.setHeader('Content-Type', 'application/json')
        let { email, username, password, birth_date } = req.body
        try {
            let user = await User.findAll({
                where: {
                    [Op.or]: [
                        { email: email },
                        { username: username }
                    ]   
                }
            })
    
            if(user.length > 0){
                return res
                .status(400)
                .end(JSON.stringify({ success: false, message: "user with email or username already exists" }))
            }
            user = User.create({ email, username, password, birth_date })
            return res
                    .end(JSON.stringify({ success: true, message: "successfully created user" }))
        }
        catch(err) {
            res.status(500).json({ success: false }).end()
        }
})

router.post('/login', 
    celebrate({
        [Segments.BODY]: LoginSerializer
    }),

    (req, res, next) => {
        let { email, password } = req.body
    }
)

router.get('/:user_id/followers', isAuthenticated, async(req, res) => {
    let user_id = req.params.user_id
    try {
        let user = await User.findOne({
            id: user_id
        })

        if (user !== null){
            let followers = await user.getFollowers()
            return res.json({ success: true, followers: followers })
                    .end()
            
        }
    }
    catch(err){
        console.log(err)
        return res
            .status(500)
            .json({ success: false })
            .end()
    }
})

router.post('/:user_id/follow', isAuthenticated, async(req, res) => {
    let user_id = req.params.user_id
    try {
        let user = await User.findOne({
            id: user_id
        })

        if (user !== null){
            // check if current user is following the user_id
            let current_user_id = req.user.id
            let followers = await user.getFollowers();

            if (!(current_user_id in followers)){
                await Followers.create({
                    followerId: current_user_id,
                    followingId: user_id
                })
                console.log(900)
            }

            else{
                await Followers.destroy({
                    followerId: current_user_id,
                    followingId: user_id
                })
            }
            
            return res.json({ success: true })
                    .end()
            
        }
    }
    catch(err){
        console.log(err)
        return res
            .status(500)
            .json({ success: false })
            .end()
    }
})

router.get('/:user_id/following', isAuthenticated, async(req, res) => {
    let user_id = req.params.user_id
    try {
        let user = await User.findOne({
            id: user_id
        })

        if (user !== null){
            let followers = await user.getFollowing()
            return res.json({ success: true, followers: followers })
                    .end()
            
        }
    }
    catch(err){
        console.log(err)
        return res
            .status(500)
            .json({ success: false })
            .end()
    }
})

module.exports = router