'use strict';
const {
  Model
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Followers extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }

    static followUser(follower_id, following_id){
        Followers.create({
            followerId: follower_id,
            followingId: following_id
        })
    }

    static unfollowUser(follower_id, following_id){
        Followers.destroy({
            where: {
                followerId: follower_id,
                followingId: following_id
            }
        })
    }

    static async getFollowerIDs(user_id){
        let followers = await Followers.findAll({
            where: {
                followingId: user_id
            }
        })
        return followers.map((follower) => follower = follower.followerId)
    }
  }

  Followers.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    followerId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'User',
          key: 'id'
        }
      },
      followingId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'User',
          key: 'id'
        }
      }
  }, {
    sequelize,
    modelName: 'Followers',
  }); 
  return Followers;
};