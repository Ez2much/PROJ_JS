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

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            setIsLoggedIn(true);
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
        setIsLoggedIn(false);
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
            <Header isLoggedIn={isLoggedIn} setIsLogin={setIsLogin} handleLogout={handleLogout} />
            {isLoggedIn ? (
                <div className="admi-prod">
                    <AdminPanel onProductAdded={fetchProducts} />
                    <ProductList products={products} refreshProducts={fetchProducts} />
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