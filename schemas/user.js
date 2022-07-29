const { DataTypes } = require('sequelize')
const bcrypt = require('bcrypt')


const UserSchema = {
    username: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false
    },
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
}

module.exports = UserSchema