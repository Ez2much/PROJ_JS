const express = require('express');
const bodyParser = require('body-parser');
const sequelize = require('./db');
const path = require('path');
const cors = require('cors');

// Importujemy kontrolery
const uzytkownikController = require('./backend/controllers/userController');
const produktController = require('./backend/controllers/productController');
const koszykController = require('./backend/controllers/cartController');

// Inicjalizacja aplikacji Express
const app = express();
const port = 5000;



// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors()); // Obs³uga CORS

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Udostêpnienie frontendu
app.use(express.static(path.join(__dirname, 'frontend')));
/*app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'frontend', 'index.js'));
});*/

// Synchronizacja bazy danych
sequelize.sync().then(() => {
    console.log('Baza danych jest zsynchronizowana.');
});

// Trasy aplikacji
app.post('/api/register', uzytkownikController.register);
app.post('/api/login', uzytkownikController.login);
app.get('/api/products', produktController.getProducts);
app.post('/api/cart', koszykController.addProductToCart);
app.delete('/api/cart', koszykController.removeProductFromCart);
app.get('/api/cart/:userId', koszykController.getCart);

app.post('/api/products', produktController.addProduct);
app.delete('/api/products/:productId', produktController.deleteProduct);
app.put('/api/products/:productId', produktController.updateProduct);


// Middleware obs³uguj¹cy b³êdy
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Coœ posz³o nie tak!' });
});

// Eksportowanie aplikacji
module.exports = app;

// Uruchomienie serwera
if (require.main === module) {
    app.listen(port, () => {
        console.log(`Aplikacja dzia³a na porcie ${port}`);
    });
}
