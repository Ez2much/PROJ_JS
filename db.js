const { Sequelize } = require('sequelize');

// Tworzenie po³¹czenia z baz¹ danych SQLite
const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: './sklep.sqlite',  // Œcie¿ka do pliku bazy danych
    logging: false, // Mo¿na ustawiæ na true, jeœli chcesz zobaczyæ zapytania SQL w konsoli
});

// Testowanie po³¹czenia
(async () => {
    try {
        await sequelize.authenticate();
        console.log('Po³¹czenie z baz¹ danych zosta³o pomyœlnie nawi¹zane.');
    } catch (error) {
        console.error('Nie uda³o siê po³¹czyæ z baz¹ danych:', error);
    }
})();

module.exports = sequelize;
