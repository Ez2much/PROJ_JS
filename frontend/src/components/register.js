import React, { useState } from 'react';
import { registerUser } from '../services/api';  // Import function to handle registration
import './Login.css';

const Register = ({ setIsLogin }) => {  // Odbieramy setIsLogin jako props
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [username, setUsername] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');

    const handleRegister = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        // Check if passwords match
        if (password !== confirmPassword) {
            setError('Has³a nie pasuj¹ do siebie!');
            setLoading(false);
            return;
        }

        try {
            const response = await registerUser(username, email, password);
            setSuccessMessage('Rejestracja zakoñczona sukcesem!');
            setLoading(false);
        } catch (err) {
            setError(err || 'Nie uda³o siê zarejestrowaæ.');
            setLoading(false);
        }
    };

    return (
        <div className="login-container">
            <div className="login-form">
                <h2 className="login-title">Rejestracja</h2>
                <form onSubmit={handleRegister} className="form">
                    <div className="form-group">
                        <label htmlFor="username" className="form-label">Nazwa u¿ytkownika</label>
                        <input
                            id="username"
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="Wpisz swoj¹ nazwê u¿ytkownika"
                            className="form-input"
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="email" className="form-label">E-mail</label>
                        <input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Wpisz swój e-mail"
                            className="form-input"
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="password" className="form-label">Has³o</label>
                        <input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Wpisz swoje has³o"
                            className="form-input"
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="confirmPassword" className="form-label">PotwierdŸ has³o</label>
                        <input
                            id="confirmPassword"
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder="PotwierdŸ has³o"
                            className="form-input"
                            required
                        />
                    </div>
                    {error && <p className="error-message">{error}</p>}
                    {successMessage && (
                        <div className="success-message">
                            {successMessage}
                        </div>
                    )}
                    <button
                        type="submit"
                        className="submit-button"
                        disabled={loading}
                    >
                        {loading ? 'Rejestracja...' : 'Zarejestruj siê'}
                    </button>
                </form>

                {/* Dodajemy przycisk prze³¹czaj¹cy do formularza logowania */}
                <p className="text-center mt-4">
                    Masz ju¿ konto?
                    <button
                        onClick={() => setIsLogin(true)}  // Ustawiamy isLogin na true, ¿eby pokazaæ formularz logowania
                        className="text-blue-600"
                    >
                        Zaloguj siê
                    </button>
                </p>
            </div>
        </div>
    );
};

export default Register;
