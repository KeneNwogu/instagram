// authentication logic goes here
// attach user to request object
const { User } = require('../models')

let authenticationMiddleware = {
    authenticate: function(req, res, next) {
        
    },
    isAuthenticated: async function(req, res, next) {
        req.user = await User.findOne({
            where: {
                email: "kcee@test.com"
            }
        })
        next();
    },
    isAuthenticatedOrReadOnly: async function(req, res, next){
        
    }
}

module.exports = authenticationMiddleware