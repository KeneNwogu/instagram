const { DataTypes } = require('sequelize')

const PostSchema = {
    caption: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    images: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        allowNull: false
    }
}

module.exports = PostSchema