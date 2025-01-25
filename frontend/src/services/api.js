import axios from 'axios';

const API_URL = 'http://localhost:5000';

// Rejestracja u¿ytkownika
export const registerUser = async (username, email, password) => {
    try {
        const response = await axios.post(`${API_URL}/api/register`, { username, email, password });
        return response.data;
    } catch (error) {
        console.error('Registration failed:', error);  // Log the error in more detail
        // Log the error response if it exists
        if (error.response) {
            console.error('Error response:', error.response);
            console.error('Error response data:', error.response.data);
        }
        throw error.response?.data?.message || 'Registration error';
    }
};



// Logowanie u¿ytkownika
export const loginUser = async (email, password) => {
    try {
        const response = await axios.post(`${API_URL}/api/login`, { email, password });
        return response.data; // Zwracamy dane z odpowiedzi
    } catch (error) {
        console.error('Login failed', error);
        throw error.response?.data?.message || 'Login error';
    }
};


// Pobieranie produktów
export const getProducts = async () => {
    try {
        const response = await axios.get(`${API_URL}/products`);
        return response.data; // Zwracamy dane z odpowiedzi
    } catch (error) {
        console.error('Error fetching products', error);
        throw error.response?.data?.message || 'Error fetching products';
    }
};

// Dodawanie produktu do koszyka
export const addToCart = async (userId, productId, quantity) => {
    try {
        const response = await axios.post(`${API_URL}/cart`, { userId, productId, quantity });
        return response.data; // Zwracamy dane z odpowiedzi
    } catch (error) {
        console.error('Error adding product to cart', error);
        throw error.response?.data?.message || 'Error adding product to cart';
    }
};

// Pobieranie koszyka
export const getCart = async (userId) => {
    try {
        const response = await axios.get(`${API_URL}/cart/${userId}`);
        return response.data; // Zwracamy dane z odpowiedzi
    } catch (error) {
        console.error('Error fetching cart', error);
        throw error.response?.data?.message || 'Error fetching cart';
    }
};
