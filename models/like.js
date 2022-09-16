'use strict';
const {
  Model
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Like extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.Like.belongsTo(models.User, { as: 'user', foreignKey: { name: 'UserId', allowNull: false } })
      models.Like.belongsTo(models.Comment, { as: 'comment', foreignKey: { name: 'CommentId', allowNull: true } })
      models.Like.belongsTo(models.Post, { as: 'post', foreignKey: { name: 'PostId', allowNull: true } })
    }

    static getLike(post_id, user_id){
      return Like.findOne({
        where: {
          PostId: post_id,
          UserId: user_id
        }
      })
    }

    static likePost(post_id, user_id){
      Like.create({
        PostId: post_id,
        UserId: user_id
      })
    }

    static unLikePost(post_id, user_id){
      Like.destroy({
        where: {
          PostId: post_id,
          UserId: user_id
        }
      })
    }
  }

  Like.init({
  }, {
    sequelize,
    modelName: 'Like',
  }); 
  return Like;
};