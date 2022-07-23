const express = require('express')
const app = express()
const body_parser = require('body-parser')
const user_controller = require('./controllers/users/registerController.js')
const jsonParser = body_parser.json()
// add middlewares and controller handlers

app.use(js)
app.use('/users', user_controller)
app.listen(5000)