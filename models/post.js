'use strict';
const { user } = require('pg/lib/defaults');
const {
  Model
} = require('sequelize');


module.exports = (sequelize, DataTypes) => {
  class Post extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static models;

    static associate(models) {
      // define association here
      Post.models = models
      models.Post.belongsTo(models.User, { as: 'user', foreignKey: 'UserId' })
      models.Post.hasMany(models.Comment, { as: 'comments' })
      models.Post.hasMany(models.Like, { as: 'likes' })
    }

    static getAllPosts(){
      return Post.findAll({
        include: [{ model: Post.models.User, as: 'user', attributes: { exclude: ['password', 'bio', 'createdAt', 'updatedAt', 'birth_date']}}, 
        { model: Post.models.Like, as: 'likes', attributes: []}, { model: Post.models.Comment, as: 'comments', attributes: []}],
        attributes: ['caption', 'images', [sequelize.fn('COUNT', sequelize.col('likes.id')), 'total_likes'], 
        [sequelize.fn('COUNT', sequelize.col('comments.id')), 'total_comments']],
        group: ["Post.id", "user.id", "likes.id", "comments.id"]
      })
    }

    static getPostById(id){
      return Post.findOne({
        where: { id },
        include: [
            { model: Post.models.User, attributes: { exclude: ['password', 'bio', 'createdAt', 'updatedAt', 'birth_date']}, as: 'user'},
            { 
                model: Post.models.Comment, 
                include: { model: Post.models.User, attributes: { exclude: ['password', 'bio', 'birth_date']}, as: 'user' }, 
                as: 'comments', 
                attributes: ['caption', 'createdAt'], 
            }
        ],
        attributes: {
          exclude: ['UserId',]
        }
      })
    }

    addComment(caption, user_id){
      Post.models.Comment.create({
        PostId: this.id,
        caption: caption,
        UserId: user_id
      })
    }

    // toJSON(){
    //   return {
    //     id: this.id,
    //     caption: this.caption,
    //     images: this.images
    //   }
    // }
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