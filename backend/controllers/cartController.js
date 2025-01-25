const { Cart, ProductCart } = require('../models/cart');
const Product = require('../models/product');

// Adding product to cart
exports.addProductToCart = async (req, res) => {
    const { userId, productId, quantity } = req.body;

    try {
        // Check if cart exists for this user
        let cart = await Cart.findOne({ where: { userId } });
        if (!cart) {
            cart = await Cart.create({ userId });
        }

        // Adding product to cart
        const existingProduct = await ProductCart.findOne({
            where: {
                cartId: cart.id,
                productId: productId,
            },
        });

        if (existingProduct) {
            await existingProduct.update({ quantity: existingProduct.quantity + quantity });
        } else {
            await ProductCart.create({ cartId: cart.id, productId, quantity });
        }

        return res.status(200).json({ message: 'Product added to cart.' });
    } catch (err) {
        return res.status(500).json({ message: 'Server error', error: err.message });
    }
};

// Removing product from cart
exports.removeProductFromCart = async (req, res) => {
    const { userId, productId } = req.body;

    try {
        const cart = await Cart.findOne({ where: { userId } });
        if (!cart) {
            return res.status(404).json({ message: 'Cart not found.' });
        }

        // Remove product from cart
        await ProductCart.destroy({
            where: {
                cartId: cart.id,
                productId: productId,
            },
        });

        return res.status(200).json({ message: 'Product removed from cart.' });
    } catch (err) {
        return res.status(500).json({ message: 'Server error', error: err.message });
    }
};

// Getting user's cart
exports.getCart = async (req, res) => {
    const { userId } = req.params;

    try {
        const cart = await Cart.findOne({
            where: { userId },
            include: {
                model: Product,
                through: { attributes: ['quantity'] },
            },
        });

        if (!cart) {
            return res.status(404).json({ message: 'Cart not found.' });
        }

        return res.status(200).json(cart);
    } catch (err) {
        return res.status(500).json({ message: 'Server error', error: err.message });
    }
};
