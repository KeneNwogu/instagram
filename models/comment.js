'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Comment extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.Comment.belongsTo(models.Post)
      models.Comment.belongsTo(models.User, { as: 'user', foreignKey: 'UserId' })
      models.Comment.hasMany(models.Like, { as: 'likes' })
    }
  }
  Comment.init({
    caption: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Comment',
  });
  return Comment;
};