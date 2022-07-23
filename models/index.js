const dotenv = require('dotenv')
dotenv.config()

const database_config = {
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    dialect: "postgres"
}

const Sequelize = require('sequelize')
const sequelize = new Sequelize(database_config)