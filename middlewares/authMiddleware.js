// authentication logic goes here
// attach user to request object
const { User } = require('../models')
const jwt = require('jsonwebtoken')

require('dotenv').config()


let authenticationMiddleware = {
    isAuthenticated: async function(req, res, next) {
        const authHeader = req.headers['authorization'];
        if (!authHeader) res.sendStatus(401);
        if(authHeader.split(' ').length !== 2) res.sendStatus(401);

        const token = authHeader.split(' ')[1]
        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, 
            async (err, payload) => {
                if (err) return res.sendStatus(403);
                req.user = await User.getUserById(payload.user_id)
                next()
            } 
        )
    },
    isAuthenticatedOrReadOnly: async function(req, res, next){
        
    }
}

module.exports = authenticationMiddleware