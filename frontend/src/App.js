import React, { useState, useEffect } from 'react';
import Login from './components/login';
import Register from './components/register';
import Header from './components/header';

const App = () => {
    const [isLogin, setIsLogin] = useState(true);  // Stan kontroluj¹cy, czy widzimy login czy rejestracjê
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Sprawdzenie tokenu w localStorage
        const token = localStorage.getItem('token');
        if (token) {
            setIsLoggedIn(true);
        }
        setLoading(false);
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');  // Usuwamy token
        setIsLoggedIn(false);  // Ustawiamy stan na wylogowany
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="spinner"></div>  {/* Spinner podczas ³adowania */}
            </div>
        );
    }

    return (
        <div className="container">
            <Header isLoggedIn={isLoggedIn} setIsLogin={setIsLogin} handleLogout={handleLogout} />

            {isLoggedIn ? (
                <div>
                    <h1>Witaj, u¿ytkowniku!</h1>
                    <button onClick={handleLogout} className="text-blue-600">Wyloguj siê</button>
                </div>
            ) : (
                <div>
                    {isLogin ? (
                        <Login setIsLoggedIn={setIsLoggedIn} setIsLogin={setIsLogin} /> 
                    ) : (
                    <Register setIsLogin={setIsLogin} />  
                    )}
                </div>
            )}
        </div>
    );
};

export default App;
