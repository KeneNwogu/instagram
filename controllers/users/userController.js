const express = require('express')
const router = express.Router()
const { User } = require('../../models')

router.post('/register', async (req, res, next) => {
    let { email="", username, password, birth_date } = req.body

    if(!email || !username || !password || !birth_date){
        res.end(JSON.stringify({ success: false, message: "invalid input was passed" }))
        return
    }
    
    res.setHeader('Content-Type', 'application/json')
    let user = await User.findAll({
        where: {
            email: email
        }
    })

    if(user.length > 0){
        res.end(JSON.stringify({ success: false, message: "user with email already exists" }))
        return
    }
    user = User.create({ email, username, password, birth_date })
    res.end(JSON.stringify({ success: true, message: "successfully created user" }))
})

module.exports = router