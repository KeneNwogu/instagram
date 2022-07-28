const dotenv = require('dotenv')
dotenv.config()

const database_config = {
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    dialect: "postgres"
}

const { Sequelize, DataTypes } = require('sequelize')
const sequelize = new Sequelize(database_config)
const user_schema = require('./user.js')
const post_schema = require('./post.js')
const { DATE } = require('sequelize')

const UserModel = sequelize.define('User', user_schema);
const PostModel = sequelize.define('Post', post_schema);
const LikeModel = sequelize.define('Like', { date_created: { type: DataTypes.DATE, defaultValue: new DATE } });

UserModel.hasMany(PostModel)
PostModel.belongsTo(UserModel)

UserModel.hasMany(LikeModel)
PostModel.hasMany(LikeModel)
LikeModel.belongsTo(PostModel)
LikeModel.belongsTo(PostModel)

UserModel.sync();
PostModel.sync();
LikeModel.sync();

module.exports = {
    User: UserModel,
    Post: PostModel,
    Like: LikeModel
}