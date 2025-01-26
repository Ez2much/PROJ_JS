import React, { useState, useEffect } from 'react';
import { getProducts, getCart, addToCart } from './services/api';
import Login from './components/login';
import Register from './components/register';
import Header from './components/header';
import AdminPanel from './components/AdminPanel';
import ProductList from './components/ProductList';
import Cart from './components/Cart';
import './App.css';

const App = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [loading, setLoading] = useState(true);
    const [products, setProducts] = useState([]);
    const [showAuthForm, setShowAuthForm] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);

    const [cartItems, setCartItems] = useState([]);

    useEffect(() => {
        const token = localStorage.getItem('token');
        const adminStatus = localStorage.getItem('isAdmin') === 'true';
        const userId = localStorage.getItem('userId');
        if (token) {
            setIsLoggedIn(true);
            setIsAdmin(adminStatus);
            if (userId) {
                fetchCart(userId);
            }
        }
        fetchProducts();
        setLoading(false);
    }, []);

    const fetchCart = async (userId) => {
        try {
            const cartData = await getCart(userId);
            setCartItems(cartData.Products || []); // Adjust based on your actual cart data structure
        } catch (err) {
            console.error('Error fetching cart:', err);
        }
    };

    const fetchProducts = async () => {
        try {
            const data = await getProducts();
            setProducts(data);
        } catch (err) {
            console.error('Error fetching products:', err);
        }
    };

    const handleAddToCart = async (productId) => {
        const userId = localStorage.getItem('userId');
        if (!userId) {
            alert('Please log in to add items to the cart.');
            return;
        }

        try {
            const response = await addToCart(userId, productId, 1);
            if (response.message === 'Product added to cart successfully') {
                // Immediately update cart state without full page reload
                await fetchCart(userId);
            } else {
                console.error(response.message || 'Failed to add product to cart.');
            }
        } catch (err) {
            console.error('Error adding product to cart:', err);
            alert(err.toString());
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
                            onCartFetched={fetchCart}
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
                            {!isAdmin && (
                                <Cart
                                    cartItems={cartItems}
                                    onRefreshCart={() => fetchCart(localStorage.getItem('userId'))}
                                />
                            )}
                            <div className="flex-grow">
                                <ProductList
                                    products={products}
                                    refreshProducts={fetchProducts}
                                    isAdmin={isAdmin}
                                    onAddToCart={handleAddToCart}
                                />
                            </div>
                            
                        </div>
                ) : (
                    <ProductList products={products} />
                )
            )}
        </div>
    );
};

export default App;