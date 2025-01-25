const { DataTypes } = require('sequelize');
const sequelize = require('../../db');

const User = sequelize.define('User', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    username: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    email: { // Dodajemy kolumnê email
        type: DataTypes.STRING,
        allowNull: false,
        unique: true, // zapewniamy, ¿e email bêdzie unikalny
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    isAdmin: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
});

module.exports = User;
