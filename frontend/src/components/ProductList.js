import React, { useEffect, useState } from 'react';
import { getProducts, deleteProduct, updateProduct, addToCart, getCart } from '../services/api';
import './ProductList.css';

const ProductList = ({ products: initialProducts, refreshProducts, onAddToCart }) => {
    const [products, setProducts] = useState(initialProducts);
    const [error, setError] = useState('');
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [currentProduct, setCurrentProduct] = useState(null);
    const [newImage, setNewImage] = useState(null);
    const [loading, setLoading] = useState(false);  // To manage loading state

    const isAdmin = localStorage.getItem('isAdmin') === 'true'; // Single declaration of isAdmin
    const userId = localStorage.getItem('userId');

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

    const fetchCart = async (userId) => {
        try {
            const response = await getCart(userId);  // Replace with actual API call to fetch the user's cart
            // Assume getCart is a function that fetches the cart for the given user
            // Update the cart state or trigger a re-render
            console.log('Cart fetched:', response);
        } catch (err) {
            setError('Error fetching cart');
            console.error('Error fetching cart:', err);
        }
    };


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

    const handleAddToCart = async (productId) => {
        try {
            const userId = localStorage.getItem('userId');
            if (!userId) {
                setError('Please log in to add items to the cart.');
                return;
            }

            const response = await addToCart(userId, productId, 1); // Default to 1 quantity
            if (response.message === 'Product added to cart') {
                alert('Product added to cart successfully!');
                fetchCart(userId); // Refresh the cart after adding the product
            } else {
                setError(response.message || 'Failed to add product to cart.');
            }
        } catch (err) {
            console.error('Error adding product to cart:', err);
            setError('Failed to add product to cart.');
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

                            {!isAdmin && (
                                <button
                                    onClick={() => onAddToCart(product.id)}
                                    className="add-to-cart-button"
                                    disabled={product.quantity === 0}
                                >
                                    {product.quantity === 0 ? 'Out of Stock' : 'Add to Cart'}
                                </button>
                            )}


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
