import React, { useEffect, useState } from 'react';
import { getProducts, deleteProduct, updateProduct } from '../services/api';
import './ProductList.css';

const ProductList = ({ products: initialProducts, refreshProducts }) => {
    const [products, setProducts] = useState(initialProducts);
    const [error, setError] = useState('');
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [currentProduct, setCurrentProduct] = useState(null);
    const [newImage, setNewImage] = useState(null);
    const [loading, setLoading] = useState(false);  // To manage loading state

    const isAdmin = localStorage.getItem('isAdmin') === 'true'; // Single declaration of isAdmin

    useEffect(() => {
        setProducts(initialProducts);  // Sync with initial products passed as prop
    }, [initialProducts]);

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
    }, []);  // Fetch products only on component mount

    const handleDelete = async (productId) => {
        const token = localStorage.getItem('token');
        try {
            await deleteProduct(productId, token);  // Delete product
            setProducts(products.filter((product) => product.id !== productId));  // Update state after deletion
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
        const file = event.target.files[0];
        if (file) {
            setNewImage(file);  // Update the state with the selected image
        }
    };

    const handleEditSave = async () => {
        const token = localStorage.getItem('token');
        try {
            const updatedProduct = await updateProduct(currentProduct, token, newImage);
            const data = await getProducts();  // Re-fetch products after update
            setProducts(data);  // Update state with the latest products
            closeEditModal();  // Close the modal after successful save
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
