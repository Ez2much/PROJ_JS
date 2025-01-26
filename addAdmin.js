const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('./db');  // Upewnij siê, ¿e œcie¿ka jest poprawna
const bcrypt = require('bcrypt');

// Definicja modelu User (u¿ywamy tej samej definicji, co w pliku models/user.js)
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
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
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

(async () => {
    try {
        // Synchronizacja bazy danych
        await sequelize.sync();

        // Sprawdzamy, czy u¿ytkownik admin ju¿ istnieje
        const existingAdmin = await User.findOne({ where: { isAdmin: true } });

        if (!existingAdmin) {
            // Jeœli admina nie ma, to go tworzymy
            const hashedPassword = await bcrypt.hash('admin', 10); // Haszowanie has³a admina

            const admin = await User.create({
                username: 'admin',
                email: 'admin@admin.pl',
                password: hashedPassword,
                isAdmin: true,
            });

            console.log('Admin zosta³ dodany:', admin.username);
        } else {
            console.log('U¿ytkownik admin ju¿ istnieje.');
        }
    } catch (error) {
        console.error('B³¹d po³¹czenia z baz¹ danych:', error);
    }
})();
