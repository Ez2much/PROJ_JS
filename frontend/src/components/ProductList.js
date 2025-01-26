import React, { useEffect, useState } from 'react';
import { getProducts, deleteProduct, addProduct, updateProduct } from '../services/api';
import './ProductList.css';
import AdminPanel from './AdminPanel';

const ProductList = () => {
    const [products, setProducts] = useState([]);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [currentProduct, setCurrentProduct] = useState(null);
    const [newImage, setNewImage] = useState(null);

    const isAdmin = localStorage.getItem('isAdmin') === 'true'; // SprawdŸ, czy u¿ytkownik jest administratorem

    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            try {
                const data = await getProducts();
                setProducts(data);
            } catch (err) {
                setError('Error fetching products');
                console.error('Error fetching products:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    const handleDelete = async (productId) => {
        const token = localStorage.getItem('token');
        try {
            await deleteProduct(productId, token); // Usuwanie produktu
            setProducts(products.filter((product) => product.id !== productId)); // Aktualizacja stanu po usuniêciu
        } catch (err) {
            console.error('Error deleting product:', err);
            setError('Error deleting product');
        }
    };

    const openEditModal = (product) => {
        setCurrentProduct(product);
        setIsEditModalOpen(true);
    };

    const closeEditModal = () => {
        setIsEditModalOpen(false);
        setCurrentProduct(null);
    };

    const handleImageChange = (event) => {
        const file = event.target.files[0]; // Get the selected file
        if (file) {
            setNewImage(file); // Update the state with the new image
        }
    };

    const handleEditSave = async () => {
        const token = localStorage.getItem('token');
        try {
            // Update the product using the updated product and image
            const updatedProduct = await updateProduct(currentProduct, token, newImage);

            // Fetch updated products to ensure data consistency
            const data = await getProducts();  // Re-fetch products after the update
            setProducts(data);  // Update state with the latest product data

            closeEditModal(); // Close modal after success
        } catch (err) {
            console.error('Error updating product:', err);
            setError('Error updating product');
        }
    };




    if (loading) {
        return <p>Loading products...</p>;
    }

    if (error) {
        return <p>{error}</p>;
    }

    return (
        <div>
            <h2>Products</h2>
            {products.length === 0 ? (
                <p>No products available.</p>
            ) : (
                <div className="products-list">
                    {products.map((product) => (
                        <div key={product.id} className="product-item">
                            <img src={`http://localhost:5000/${product.image}`} alt={product.name} />
                            <h3>{product.name}</h3>
                            <p>{product.description}</p>
                            <p>Price: ${product.price}</p>
                            <p>Quantity: {product.quantity}</p>
                            {isAdmin && (
                                <div className="action-buttons">
                                    <button onClick={() => openEditModal(product)} className="edit-button">
                                        Edit
                                    </button>
                                    <button onClick={() => handleDelete(product.id)} className="delete-button">
                                        Delete
                                    </button>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}

            {isEditModalOpen && (
                <div className="modal-overlay">
                    <div className="modal">
                        <h3>Edit Product</h3>
                        <label>
                            Name:
                            <input
                                type="text"
                                value={currentProduct.name}
                                onChange={(e) =>
                                    setCurrentProduct({ ...currentProduct, name: e.target.value })
                                }
                            />
                        </label>
                        <label>
                            Price:
                            <input
                                type="number"
                                value={currentProduct.price}
                                onChange={(e) =>
                                    setCurrentProduct({ ...currentProduct, price: e.target.value })
                                }
                            />
                        </label>
                        <label>
                            Description:
                            <textarea
                                value={currentProduct.description}
                                onChange={(e) =>
                                    setCurrentProduct({ ...currentProduct, description: e.target.value })
                                }
                            />
                        </label>
                        <label>
                            Quantity:
                            <input
                                type="number"
                                value={currentProduct.quantity}
                                onChange={(e) =>
                                    setCurrentProduct({ ...currentProduct, quantity: e.target.value })
                                }
                            />
                        </label>
                        <label>
                            Image:
                            <input type="file" accept="image/*" onChange={handleImageChange} />
                        </label>
                        <div className="modal-buttons">
                            <button onClick={handleEditSave} className="save-button">
                                Save
                            </button>
                            <button onClick={closeEditModal} className="cancel-button">
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProductList;
