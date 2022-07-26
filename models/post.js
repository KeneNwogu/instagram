const { DataTypes } = require('sequelize')

const PostSchema = {
    caption: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    image: {
        type: DataTypes.STRING,
        allowNull: false
    }
}

module.exports = PostSchema