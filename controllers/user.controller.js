const express = require('express')
const router = express.Router()
const { User, Followers } = require('../models')
const { celebrate, Joi, errors, Segments } = require('celebrate')
const { RegisterSerializer, LoginSerializer } = require('../serializers')
const user = require('../models/user')
const { isAuthenticated } = require('../middlewares/authMiddleware')
const jwt = require('jsonwebtoken')

require('dotenv').config()


const createNewUser = async (req, res) => {
    let { email, username, password, birth_date } = req.body
    try {
        let user_exists = await User.isEmailOrUsernameExists(email, username)
        if(user_exists){
            return res
            .status(400)
            .end(JSON.stringify({ success: false, message: "user with email or username already exists" }))
        }
        await User.create({ email, username, password, birth_date })
        return res
                .end(JSON.stringify({ success: true, message: "successfully created user" }))
    }
    catch(err) {
        console.log(err.message)
        res.status(500).json({ success: false }).end()
    }
}

const createAuthToken = async (req, res) => {
    let { email, password } = req.body;
    let user = await User.getUserByEmail(email);

    if (!user) return res.status(400).json({ success: false, message: "Invalid authentication credentials provided"});
    if (!user.checkPasswordHash(password)) return res.status(400).json({ success: false, message: "Invalid authentication credentials provided"});

    const access_token = jwt.sign(
        {'user_id': user.id},
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: '3600s'}
    );

    const refresh_token = jwt.sign(
        {'user_id': user.id},
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: '1d'}
    );

    res.cookie('jwt', refresh_token, { httpOnly: true, maxAge: 24 * 60 * 60 * 1000 })
    return res.json({ access_token });
}

const getUserById = async (req, res) => {
    try {
        let user = await User.getUserById(req.params.user_id)
        if (!user) return res.status(404).json({ success: false, message: "No user found"})
        return res.json(user.toJSON()).end();
    }
    catch(err){
        return res.status(500).json({ success: false }).end()
    }
}

const getCurrentUser = async (req, res) => {
    try {
        return res.json(req.user.toJSON()).end()
    }
    catch(err){
        return res.status(500).json({ success: false, message: err.message }).end()
    }
}

const getFollowers = async (req, res) => {
    let user_id = req.params.user_id
    try {
        let user = await User.getUserById(user_id);
        if (user === null) return res.status(404).json({ success: false, message: "No user found"})
        let followers = await user.getFollowers()
        return res.json({ success: true, followers: followers }).end()
    }
    catch(err){
        return res.status(500).json({ success: false, message: err.message }).end()
    }
}

const getFollowing = async (req, res) => {
    let user_id = req.params.user_id
    try {
        let user = await User.getUserById(user_id);
        if (user === null) return res.status(404).json({ success: false, message: "No user found"})
        let following = await user.getFollowing()
        return res.json({ success: true, following: following }).end()
    }
    catch(err){
        return res.status(500).json({ success: false }).end()
    }
}

const followOrUnfollowUser = async (req, res) => {
    let user_id = req.params.user_id
    try {
        let user = await User.getUserById(user_id)
        if (user === null) return res.status(404).json({ success: false, message: "No user found"})

        // check if current user is following the user_id
        let current_user_id = req.user.id
        let followers = await Followers.getFollowerIDs(user_id);
        let following = false;
        if (followers.includes(current_user_id)){
            await Followers.unfollowUser(current_user_id, user_id)
        }
        else{
            await Followers.followUser(current_user_id, user_id)
            following = true
        }
        
        return res.json({ success: true, following }).end() 
    }
    catch(err){
        return res.status(500).json({ success: false }).end()
    }
}


module.exports = {
    createNewUser,
    getUserById,
    createAuthToken,
    getCurrentUser,
    getFollowers,
    getFollowing,
    followOrUnfollowUser
}