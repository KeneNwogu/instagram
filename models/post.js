'use strict';
const {
  Model
} = require('sequelize');
const bcrypt = require('bcrypt')

module.exports = (sequelize, DataTypes) => {
  class Post extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.Post.belongsTo(models.User)
      models.Post.hasMany(models.Comment, { as: 'comments' })
    }
  }

  Post.init({
    caption: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    images: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        allowNull: false
    }
  }, {
    sequelize,
    modelName: 'Post',
  });
  return Post;
};