import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Login from './components/login';
import Register from './components/register';
import Header from './components/header';
import AdminPanel from './components/AdminPanel';

const App = () => {
    const [isLogin, setIsLogin] = useState(true);  // Stan kontroluj¹cy, czy widzimy login czy rejestracjê
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [loading, setLoading] = useState(true);
    const [products, setProducts] = useState([]); // Stan do przechowywania produktów
    const [message, setMessage] = useState('');

    useEffect(() => {
        // Sprawdzanie tokenu w localStorage
        const token = localStorage.getItem('token');
        if (token) {
            setIsLoggedIn(true);
        }
        setLoading(false);

        // Pobieranie produktów po za³adowaniu komponentu
        const fetchProducts = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/products');
                setProducts(response.data); // Zapisz produkty w stanie
            } catch (error) {
                setMessage('Error fetching products');
                console.error('Error fetching products:', error);
            }
        };

        fetchProducts();  // Wywo³anie funkcji po za³adowaniu komponentu
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
                    <AdminPanel />
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

            <div>
                <h2>Products</h2>
                {message && <p>{message}</p>}
                <div className="products-list">
                    {products.length === 0 ? (
                        <p>No products available.</p>
                    ) : (
                        products.map((product) => (
                            <div key={product.id} className="product-item">
                                <h3>{product.name}</h3>
                                <p>{product.description}</p>
                                <p>Price: ${product.price}</p>
                                <p>Quantity: {product.quantity}</p>
                                {product.image && <img src={`http://localhost:5000/${product.image}`} alt={product.name} />}
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default App;
