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
const user_schema = require('./user.js')
const post_schema = require('./post.js')

const UserModel = sequelize.define('User', user_schema);
const PostModel = sequelize.define('Post', post_schema);

UserModel.hasMany(PostModel)
PostModel.belongsTo(UserModel)

UserModel.sync();
PostModel.sync();

module.exports = {
    User: UserModel,
    Post: PostModel
}