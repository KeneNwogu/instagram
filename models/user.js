const Sequelize = require('sequelize')

user_schema = {
    username: Sequelize.STRING,
    email: Sequelize.STRING,
    password_hash: Sequelize.STRING,
    birth_date: Sequelize.DATE
}