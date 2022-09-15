'use strict';
const {
  Model, 
  Op
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

    static getUserById(id){
      return User.findOne({ where: { id } })
    }

    static getUserByEmail(email){
      return User.findOne({ where: { email } })
    }

    static isEmailOrUsernameExists(email, username){
        let users = User.findAll({
          where: {
                [Op.or]: [
                    { email: email },
                    { username: username }
                ]   
            }
        })
        if (users.length > 0) return true
        return false
    }

    toJSON(){
      return {
        username: this.username,
        email: this.email,
        birth_date: this.birth_date,
        profile_image: this.profile_image,
        bio: this.bio
      }
    }

    checkPasswordHash(password){
        return bcrypt.compareSync(password, this.password)
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
    },

    bio: {
      type: DataTypes.STRING,
      allowNull: true
    }
  }, {
    sequelize,
    modelName: 'User',
    defaultScope: {
      attributes: { exclude: ['password'] }
    }
  });
  return User;
};