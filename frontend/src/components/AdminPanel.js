import React, { useState } from 'react';
import axios from 'axios';

const AdminPanel = () => {
    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    const [description, setDescription] = useState('');
    const [quantity, setQuantity] = useState(1);
    const [image, setImage] = useState(null);
    const [message, setMessage] = useState('');

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImage(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('name', name);
        formData.append('price', price);
        formData.append('description', description);
        formData.append('quantity', quantity);
        if (image) {
            formData.append('image', image);
        }

        try {
            // Send the product details to the backend
            const response = await axios.post('http://localhost:5000/api/products', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',  // Set the header for multipart form data
                },
            });
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
        <div>
            <h2>Admin Panel - Add New Product</h2>
            {message && <p>{message}</p>}
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
