const Product = require('../models/product');

// Pobieranie wszystkich produktów
exports.getProducts = async (req, res) => {
    try {
        const products = await Product.findAll();
        return res.status(200).json(products);
    } catch (err) {
        return res.status(500).json({ message: 'Server error', error: err.message });
    }
};

// Dodawanie nowego produktu
exports.addProduct = async (req, res) => {
    const { name, price, description, quantity } = req.body;

    try {
        const newProduct = await Product.create({
            name,
            price,
            description,
            quantity,
        });

        return res.status(201).json({ message: 'Product added successfully', product: newProduct });
    } catch (err) {
        return res.status(500).json({ message: 'Server error', error: err.message });
    }
};

// Aktualizowanie produktu
exports.updateProduct = async (req, res) => {
    const { productId } = req.params;
    const { name, price, description, quantity } = req.body;

    try {
        const product = await Product.findByPk(productId);

        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        await product.update({
            name: name || product.name,
            price: price || product.price,
            description: description || product.description,
            quantity: quantity || product.quantity,
        });

        return res.status(200).json({ message: 'Product updated successfully', product });
    } catch (err) {
        return res.status(500).json({ message: 'Server error', error: err.message });
    }
};

// Usuwanie produktu
exports.deleteProduct = async (req, res) => {
    const { productId } = req.params;

    try {
        const product = await Product.findByPk(productId);

        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        await product.destroy();

        return res.status(200).json({ message: 'Product deleted successfully' });
    } catch (err) {
        return res.status(500).json({ message: 'Server error', error: err.message });
    }
};
