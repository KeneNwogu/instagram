const { DataTypes } = require('sequelize')
const bcrypt = require('bcrypt')

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
            let salt = await bcrypt.genSalt(10)
            let hash = await bcrypt.hash(value, salt)
            this.setDataValue('password_hash', hash)
        }
    },
    birth_date: {
        type: DataTypes.DATE,
        allowNull: false,
        set(value){
            // convert to date
        }
    }
}

module.exports = User