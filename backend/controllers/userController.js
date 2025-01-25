const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

// Rejestracja u¿ytkownika
// Rejestracja u¿ytkownika
exports.register = async (req, res) => {
    const { email, password, username } = req.body; // Teraz oczekujemy email, password i username

    try {
        // Sprawdzamy, czy u¿ytkownik ju¿ istnieje
        const existingUser = await User.findOne({
            where: { email }
        });

        if (existingUser) {
            return res.status(400).json({ message: 'Email ju¿ istnieje.' });
        }

        // Hashowanie has³a przed zapisaniem w bazie
        const hashedPassword = await bcrypt.hash(password, 10);

        // Tworzenie nowego u¿ytkownika
        const newUser = await User.create({
            email,
            password: hashedPassword,
            username, // Dodajemy username do nowego u¿ytkownika
        });

        return res.status(201).json({ message: 'Rejestracja zakoñczona sukcesem', user: newUser });
    } catch (err) {
        return res.status(500).json({ message: 'B³¹d serwera', error: err.message });
    }
};


// Logowanie u¿ytkownika
exports.login = async (req, res) => {
    const { email, password } = req.body;

    try {
        // SprawdŸ, czy u¿ytkownik istnieje
        const user = await User.findOne({ where: { email } });

        if (!user) {
            return res.status(404).json({ message: 'U¿ytkownik nie znaleziony.' });
        }

        // Sprawdzenie poprawnoœci has³a
        const validPassword = await bcrypt.compare(password, user.password);

        if (!validPassword) {
            return res.status(400).json({ message: 'Niepoprawne has³o.' });
        }

        // Generowanie tokenu JWT
        const token = jwt.sign(
            { userId: user.id, email: user.email }, // Przechowuj e-mail lub ID w tokenie
            'secretKey', // U¿yj swojego sekretu
            { expiresIn: '1min' } // Czas wygaœniêcia tokenu (1 godzina)
        );

        return res.status(200).json({
            message: 'Logowanie zakoñczone sukcesem.',
            token,
        });
    } catch (err) {
        return res.status(500).json({ message: 'B³¹d serwera', error: err.message });
    }
};
