const { DataTypes } = require('sequelize')

const CommentSchema = {
    caption: {
        type: DataTypes.STRING
    }
}

module.exports = CommentSchema