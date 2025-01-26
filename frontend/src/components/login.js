import React, { useState } from 'react';
import { loginUser } from '../services/api'; // Zak�adam, �e masz odpowiedni plik API helper
import './Login.css';

const Login = ({ setIsLoggedIn, setIsLogin }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const response = await loginUser(email, password);
            setSuccessMessage('Zalogowano pomy�lnie!');
            localStorage.setItem('token', response.token);  // Zapisujemy token
            localStorage.setItem('isAdmin', response.isAdmin); // Zapisujemy informacj� o adminie
            setIsLoggedIn(true);
            setLoading(false);
        } catch (err) {
            setError(err || 'Nie uda�o si� zalogowa�.');
            setLoading(false);
        }
    };

    return (
        <div className="login-container">
            <div className="login-form">
                <h2 className="login-title">Logowanie</h2>
                <form onSubmit={handleLogin} className="form">
                    <div className="form-group">
                        <label htmlFor="email" className="form-label">E-mail</label>
                        <input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Wpisz sw�j e-mail"
                            className="form-input"
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="password" className="form-label">Has�o</label>
                        <input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Wpisz swoje has�o"
                            className="form-input"
                            required
                        />
                    </div>
                    {error && <p className="error-message">{error}</p>}
                    <button
                        type="submit"
                        className="submit-button"
                        disabled={loading}
                    >
                        {loading ? 'Logowanie...' : 'Zaloguj si�'}
                    </button>
                </form>

                {/* Poka� komunikat o sukcesie, je�li logowanie si� powiod�o */}
                {successMessage && (
                    <div className="success-message">
                        {successMessage}
                    </div>
                )}

                {/* Przycisk, kt�ry pozwala przej�� do rejestracji */}
                <p className="text-center mt-4">
                    Nie masz konta?
                    <button
                        onClick={() => setIsLogin(false)}
                        className="text-blue-600"
                    >
                        Zarejestruj si�
                    </button>
                </p>
            </div>
        </div>
    );
};

export default Login;
