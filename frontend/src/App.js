import React, { useState, useEffect } from 'react';
import { getProducts } from './services/api';
import Login from './components/login';
import Register from './components/register';
import Header from './components/header';
import AdminPanel from './components/AdminPanel';
import ProductList from './components/ProductList';
import './App.css';

const App = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [loading, setLoading] = useState(true);
    const [products, setProducts] = useState([]);
    const [showAuthForm, setShowAuthForm] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('token');
        const adminStatus = localStorage.getItem('isAdmin') === 'true';
        if (token) {
            setIsLoggedIn(true);
            setIsAdmin(adminStatus);
        }
        fetchProducts();
        setLoading(false);
    }, []);

    const fetchProducts = async () => {
        try {
            const data = await getProducts();
            setProducts(data);
        } catch (err) {
            console.error('Error fetching products:', err);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('isAdmin');
        setIsLoggedIn(false);
        setIsAdmin(false);
    };

    const toggleLoginForm = () => {
        setIsLogin(true);
        setShowAuthForm(true);
    };

    const toggleRegisterForm = () => {
        setIsLogin(false);
        setShowAuthForm(true);
    };

    const closeAuthForm = () => {
        setShowAuthForm(false);
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="spinner"></div>
            </div>
        );
    }

    return (
        <div className="container">
            <Header
                isLoggedIn={isLoggedIn}
                handleLogout={handleLogout}
                onLoginClick={toggleLoginForm}
                onRegisterClick={toggleRegisterForm}
            />
            {showAuthForm && !isLoggedIn ? (
                <div>
                    {isLogin ? (
                        <Login
                            setIsLoggedIn={setIsLoggedIn}
                            setIsLogin={setIsLogin}
                            setIsAdmin={setIsAdmin}
                            onClose={closeAuthForm}
                        />
                    ) : (
                        <Register
                            setIsLogin={setIsLogin}
                            onClose={closeAuthForm}
                        />
                    )}
                </div>
            ) : (
                isLoggedIn ? (
                        <div className="admi-prod">
                            {isAdmin && (
                                <AdminPanel onProductAdded={fetchProducts} />
                            )}
                            <ProductList
                                products={products}
                                refreshProducts={fetchProducts}
                                isAdmin={isAdmin}
                            />
                        </div>
                ) : (
                    <ProductList products={products} />
                )
            )}
        </div>
    );
};

export default App;