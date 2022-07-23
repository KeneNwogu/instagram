const { DataTypes } = require('sequelize')

const User = {
    username: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false
    },
    password_hash: {
        type: DataTypes.STRING,
        allowNull: false,
        set(value){
            // hash password
        }
    },
    birth_date: {
        type: DataTypes.DATE,
        allowNull: false
    }
}

module.exports = User