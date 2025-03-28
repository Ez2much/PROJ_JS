const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

// Rejestracja u�ytkownika
// Rejestracja u�ytkownika
exports.register = async (req, res) => {
    const { email, password, username } = req.body; // Teraz oczekujemy email, password i username

    try {
        // Sprawdzamy, czy u�ytkownik ju� istnieje
        const existingUser = await User.findOne({
            where: { email }
        });

        if (existingUser) {
            return res.status(400).json({ message: 'Email juz istnieje.' });
        }

        // Hashowanie has�a przed zapisaniem w bazie
        const hashedPassword = await bcrypt.hash(password, 10);

        // Tworzenie nowego u�ytkownika
        const newUser = await User.create({
            email,
            password: hashedPassword,
            username, // Dodajemy username do nowego u�ytkownika
        });

        return res.status(201).json({ message: 'Rejestracja zakonczona sukcesem', user: newUser });
    } catch (err) {
        return res.status(500).json({ message: 'Bladd serwera', error: err.message });
    }
};


// Logowanie u�ytkownika
exports.login = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Sprawd�, czy u�ytkownik istnieje
        const user = await User.findOne({ where: { email } });

        if (!user) {
            return res.status(404).json({ message: 'Uzytkownik nie znaleziony.' });
        }

        // Sprawdzenie poprawno�ci has�a
        const validPassword = await bcrypt.compare(password, user.password);

        if (!validPassword) {
            return res.status(400).json({ message: 'Niepoprawne haslo.' });
        }

        // Generowanie tokenu JWT
        const token = jwt.sign(
            { userId: user.id, email: user.email, isAdmin: user.isAdmin }, // Dodajemy isAdmin do payload
            'secretKey', // U�yj swojego sekretu
            { expiresIn: '1h' } // Czas wyga�ni�cia tokenu (1 godzina)
        );

        return res.status(200).json({
            message: 'Logowanie zako�czone sukcesem.',
            token,
            isAdmin: user.isAdmin,
            userId: user.id
        });
    } catch (err) {
        return res.status(500).json({ message: 'Blad serwera', error: err.message });
    }
};

