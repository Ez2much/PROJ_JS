import React from 'react';
import './Header.css';

const Header = ({ isLoggedIn, handleLogout, onLoginClick, onRegisterClick }) => {
    return (
        <header className="header">
            <div className="header-content">
                <div className="logo-container">
                    <img
                        src="logo.png"
                        alt="Logo"
                        className="logo"
                    />
                </div>
                <div className="auth-buttons">
                    {isLoggedIn ? (
                        <button className="logout-button" onClick={handleLogout}>
                            Wyloguj si�
                        </button>
                    ) : (
                        <>
                            <button className="login-button" onClick={onLoginClick}>
                                Zaloguj si�
                            </button>
                            <button className="register-button" onClick={onRegisterClick}>
                                Zarejestruj si�
                            </button>
                        </>
                    )}
                </div>
            </div>
        </header>
    );
};

export default Header;