const express = require('express')
const router = express.Router()

router.post('/register', (req, res, next) => {
    // check if email in db
    let { email, username, password, date_of_birth } = req.body
    res.setHeader('Content-Type', 'application/json')
    res.end(JSON.stringify({ email, username, password, date_of_birth }))
})

module.exports = router