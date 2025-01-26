import React from 'react';
import { removeFromCart, updateProductQuantity } from '../services/api';
import './Cart.css'; // Assuming you have this CSS file

const Cart = ({ cartItems, onRefreshCart }) => {
    const handleDecreaseQuantity = async (productId) => {
        const userId = localStorage.getItem('userId');
        if (!userId) {
            console.error('User ID is not found in localStorage.');
            return;
        }

        const item = cartItems.find((item) => item.id === productId);
        if (!item || !item.ProductCart) {
            console.error('Item or ProductCart not found', item);
            return;
        }

        const newQuantity = item.ProductCart.quantity - 1;
        if (newQuantity > 0) {
            try {
                await updateProductQuantity(userId, productId, newQuantity);
                onRefreshCart();
            } catch (err) {
                console.error('Error updating product quantity:', err);
            }
        } else {
            await handleDeleteItem(productId);
        }
    };

    const handleIncreaseQuantity = async (productId) => {
        // Znajdź przedmiot w koszyku po ID
        const item = cartItems.find((item) => item.id === productId);

        // Upewnij się, że item oraz jego właściwości są dostępne
        if (!item || !item.ProductCart) {
            console.error('Item or ProductCart not found', item);
            return;
        }

        // Sprawdzanie dostępności userId oraz quantity
        const userId = localStorage.getItem('userId');
        if (!userId) {
            console.error('User ID is not found in localStorage.');
            return;
        }

        const newQuantity = item.ProductCart.quantity + 1; // Zwiększenie ilości o 1

        try {
            // Wywołanie API do aktualizacji ilości
            await updateProductQuantity(userId, productId, newQuantity); // Zwiększ ilość
            onRefreshCart(); // Odśwież koszyk po aktualizacji
        } catch (err) {
            console.error('Error updating product quantity in cart:', err);
            alert('Error updating product quantity');
        }
    };


    const handleDeleteItem = async (productId) => {
        const userId = localStorage.getItem('userId');
        if (!userId) {
            alert('Please log in to remove items from the cart.');
            return;
        }

        try {
            const response = await removeFromCart(userId, productId);
            if (response.message === 'Product removed from cart.') {
                onRefreshCart(); // Refresh cart after deletion
            } else {
                alert(response.message || 'Failed to remove item.');
            }
        } catch (err) {
            console.error('Error deleting product from cart:', err);
            alert(err.toString());
        }
    };

    return (
        <div className="cart-container">
            <h2 className="cart-title">Your Cart</h2>
            {cartItems.length === 0 ? (
                <p className="empty-message">Your cart is empty</p>
            ) : (
                <div>
                    {cartItems.map((item) => (
                        <div key={item.id} className="cart-item">
                            <div className="item-header">
                                <img
                                    src={`http://localhost:5000/${item.image}`}  // Assuming image URL structure
                                    alt={item.name}
                                    className="item-image"
                                />
                                <div className="item-details">
                                    <span className="item-name">{item.name}</span>
                                    <span className="item-price">${item.price}</span>
                                </div>
                            </div>
                            <div className="quantity-container">
                                {item.ProductCart.quantity === 1 ? (
                                    <button
                                        className="delete-button"
                                        onClick={() => handleDeleteItem(item.id)} // Remove from cart
                                    >
                                        🗑️
                                    </button>
                                ) : (
                                    <button
                                        className="quantity-button"
                                        onClick={() => handleDecreaseQuantity(item.id)} // Decrease quantity
                                    >
                                        -
                                    </button>
                                )}

                                <span className="item-quantity">
                                    {item.ProductCart.quantity}
                                </span>

                                <button
                                    className="quantity-button"
                                    onClick={() => handleIncreaseQuantity(item.id)} // Increase quantity
                                >
                                    +
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Cart;
