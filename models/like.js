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
      models.Like.belongsTo(models.User, { as: 'user', foreignKey: 'UserId' })
      models.Like.belongsTo(models.Comment, { as: 'comment', foreignKey: 'CommentId' })
      models.Like.belongsTo(models.Post, { as: 'post', foreignKey: 'PostId' })
    }
  }

  Like.init({
  }, {
    sequelize,
    modelName: 'Like',
  }); 
  return Like;
};