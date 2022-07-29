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
const comment_schema = require('./comment.js')
const { DATE } = require('sequelize')

const UserModel = sequelize.define('User', user_schema);
const PostModel = sequelize.define('Post', post_schema);
const LikeModel = sequelize.define('Like', { date_created: { type: DataTypes.DATE, defaultValue: new DATE } });
const CommentModel = sequelize.define('Comment', comment_schema)

UserModel.hasMany(PostModel)
UserModel.hasMany(LikeModel)
UserModel.hasMany(CommentModel)

PostModel.belongsTo(UserModel)
PostModel.hasMany(LikeModel)
PostModel.hasMany(CommentModel)

LikeModel.belongsTo(PostModel)
LikeModel.belongsTo(PostModel)
LikeModel.belongsTo(CommentModel)

CommentModel.belongsTo(PostModel)
CommentModel.belongsTo(UserModel)
CommentModel.hasMany(LikeModel)

await sequelize.sync({ force: true })
// UserModel.sync();
// PostModel.sync();
// CommentModel.sync();
// LikeModel.sync();

module.exports = {
    User: UserModel,
    Post: PostModel,
    Like: LikeModel,
    Comment: CommentModel
}