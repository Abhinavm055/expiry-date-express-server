const { validationResult } = require('express-validator');
const productDao = require('../dao/productDao');

const productController = {
    getProducts: async (req, res) => {
        try {
            const userId = req.user._id;
            const { page, limit, search, expiresIn } = req.query;

            const result = await productDao.getProducts({
                userId,
                page: page ? parseInt(page) : 1,
                limit: limit ? parseInt(limit) : 20,
                search,
                expiresIn
            });

            res.status(200).json(result);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    addProduct: async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        try {
            const userId = req.user._id;
            const { title, upcCode, amount, expiryDate } = req.body;

            const newProduct = await productDao.createProduct({
                userId,
                title,
                upcCode,
                amount,
                expiryDate
            });

            res.status(201).json(newProduct);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    },

    updateProduct: async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        try {
            const userId = req.user._id;
            const productId = req.params.id;
            const updateData = req.body;

            const updatedProduct = await productDao.updateProduct(productId, userId, updateData);

            if (!updatedProduct) {
                return res.status(404).json({ message: 'Product not found' });
            }

            res.status(200).json(updatedProduct);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    },

    deleteProduct: async (req, res) => {
        try {
            const userId = req.user._id;
            const productId = req.params.id;

            const deletedProduct = await productDao.deleteProduct(productId, userId);

            if (!deletedProduct) {
                return res.status(404).json({ message: 'Product not found' });
            }

            res.status(200).json({ message: 'Product deleted successfully' });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
};

module.exports = productController;
