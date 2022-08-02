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
      models.User.belongsToMany(models.User, { through: 'Followers', as: 'followers', foreignKey: 'followerId' })
      models.User.belongsToMany(models.User, { through: 'Followers', as: 'following', foreignKey: 'followingId' })
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
    },
    profile_image: {
      type: DataTypes.STRING,
      allowNull: true,
      get(){
        if(this.getDataValue('profile_image') === null) {
          let email = this.getDataValue('email')
          let md5 = require('md5');
          let hash = md5(email);
          return `https://www.gravatar.com/avatar/` + hash + `?d=mp`;
        }
        else {
          return this.getDataValue('profile_image')
        }
      }
    }
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};