'use strict';
const {
  Model
} = require('sequelize');
const bcrypt = require('bcrypt')

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.User.hasMany(models.Post, { as: 'posts' })
      models.User.hasMany(models.Comment, { as: 'comments' })
      models.User.hasMany(models.Like, { as: 'likes' })
    }
  }
  User.init({
    username: DataTypes.STRING,
    email: DataTypes.STRING,
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      set(value){
          let salt = bcrypt.genSaltSync(10)
          let hash = bcrypt.hashSync(value, salt)
          this.setDataValue('password', hash)
      }
    },
    birth_date: {
      type: DataTypes.DATE,
      allowNull: false,
      set(value){
          // convert to date
          let date = new Date(value)
          this.setDataValue('birth_date', date)
      }
    }
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};