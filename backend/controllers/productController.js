const Product = require('../models/product');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');  // Save images to the "uploads" folder
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));  // Use the current timestamp as filename to avoid duplicates
    }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 },  // Limit to 5MB
    fileFilter: (req, file, cb) => {
        const allowedTypes = /jpeg|jpg|png/;
        const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = allowedTypes.test(file.mimetype);

        if (extname && mimetype) {
            return cb(null, true);
        } else {
            return cb(new Error('Only images (jpeg, jpg, png) are allowed'));
        }
    }
}).single('image');

// Pobieranie wszystkich produkt�w
exports.getProducts = async (req, res) => {
    try {
        const products = await Product.findAll();
        return res.status(200).json(products);
    } catch (err) {
        return res.status(500).json({ message: 'Server error', error: err.message });
    }
};

// Dodawanie nowego produktu
exports.addProduct = (req, res) => {
    upload(req, res, async (err) => {
        if (err) {
            return res.status(400).json({ message: 'Error uploading image', error: err.message });
        }

        const { name, price, description, quantity } = req.body;
        const image = req.file ? req.file.path : null;  // Save image path if image is uploaded

        try {
            const newProduct = await Product.create({
                name,
                price,
                description,
                quantity,
                image,  // Save image path in the database
            });

            return res.status(201).json({
                message: 'Product added successfully',
                product: newProduct,
            });
        } catch (err) {
            return res.status(500).json({ message: 'Server error', error: err.message });
        }
    });
};

// Aktualizowanie produktu
exports.updateProduct = (req, res) => {
    upload(req, res, async (err) => {
        if (err) {
            return res.status(400).json({ message: 'Error uploading image', error: err.message });
        }

        const { productId } = req.params;
        const { name, price, description, quantity } = req.body;

        try {
            const product = await Product.findByPk(productId);

            if (!product) {
                return res.status(404).json({ message: 'Product not found' });
            }

            // Usu� poprzedni obraz, je�li nowy obraz zosta� przes�any
            if (req.file && product.image) {
                fs.unlink(product.image, (err) => {
                    if (err) {
                        console.error('Error deleting old file:', err);
                    }
                });
            }

            await product.update({
                name: name || product.name,
                price: price || product.price,
                description: description || product.description,
                quantity: quantity || product.quantity,
                image: req.file ? req.file.path : product.image,
            });

            return res.status(200).json({ message: 'Product updated successfully', product });
        } catch (err) {
            return res.status(500).json({ message: 'Server error', error: err.message });
        }
    });
};


exports.deleteProduct = async (req, res) => {
    const { productId } = req.params;

    try {
        const product = await Product.findByPk(productId);

        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        // Usu� obraz z folderu "uploads", je�li istnieje
        if (product.image) {
            fs.unlink(product.image, (err) => {
                if (err) {
                    console.error('Error deleting file:', err);
                }
            });
        }

        await product.destroy();

        return res.status(200).json({ message: 'Product deleted successfully' });
    } catch (err) {
        return res.status(500).json({ message: 'Server error', error: err.message });
    }
};
