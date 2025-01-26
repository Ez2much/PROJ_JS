import React, { useState } from 'react';
import { addProduct } from '../services/api'; // Zak³adaj¹c, ¿e masz odpowiedni¹ funkcjê do wysy³ania zapytañ API
import axios from 'axios';
import './AdminPanel.css';

const AdminPanel = () => {
    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    const [description, setDescription] = useState('');
    const [quantity, setQuantity] = useState(1);
    const [image, setImage] = useState(null);
    const [message, setMessage] = useState('');
    const [token, setToken] = useState(''); // Zak³adaj¹c, ¿e masz token autoryzacyjny

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImage(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const newProduct = { name, price, description, quantity, image };

        try {
            // Wywo³anie funkcji z API do dodania produktu
            const response = await addProduct(newProduct, token);
            setMessage('Product added successfully');
            // Clear form fields
            setName('');
            setPrice('');
            setDescription('');
            setQuantity(1);
            setImage(null);
        } catch (error) {
            setMessage('Error adding product');
            console.error('Error adding product:', error);
        }
    };

    return (
        <div className="admin-panel">
            <h2>Admin Panel - Add New Product</h2>
            {message && <p className={message.includes('Error') ? 'error' : ''}>{message}</p>}
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Product Name</label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Price</label>
                    <input
                        type="number"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Description</label>
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />
                </div>
                <div>
                    <label>Quantity</label>
                    <input
                        type="number"
                        value={quantity}
                        onChange={(e) => setQuantity(e.target.value)}
                        min="1"
                        required
                    />
                </div>
                <div>
                    <label>Image</label>
                    <input
                        type="file"
                        onChange={handleImageChange}
                    />
                </div>
                <button type="submit">Add Product</button>
            </form>
        </div>
    );
};
export default AdminPanel;