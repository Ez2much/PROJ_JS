import React, { useEffect, useState } from 'react';
import './Header.css';

const Header = ({ isLoggedIn, setIsLogin, handleLogout }) => {
    const [currentStatus, setCurrentStatus] = useState(isLoggedIn);

    // Sprawdzamy stan zalogowania przy ka¿dym renderze
    useEffect(() => {
        setCurrentStatus(isLoggedIn);
    }, [isLoggedIn]);

    return (
        <header className="header">
            <div className="header-content">
                <h1 className="header-title">Moja aplikacja</h1>
                <div className="auth-buttons">
                    {currentStatus ? (
                        <button className="logout-button" onClick={handleLogout}>
                            Wyloguj siê
                        </button>
                    ) : (
                        <>
                            <button className="login-button" onClick={() => setIsLogin(true)}>
                                Zaloguj siê
                            </button>
                            <button className="register-button" onClick={() => setIsLogin(false)}>
                                Zarejestruj siê
                            </button>
                        </>
                    )}
                </div>
            </div>
        </header>
    );
};

export default Header;
