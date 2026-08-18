const Product = require('../models/Product');

const productDao = {
    createProduct: async (productData) => {
        const product = new Product(productData);
        return await product.save();
    },

    updateProduct: async (id, userId, updateData) => {
        return await Product.findOneAndUpdate(
            { _id: id, userId },
            updateData,
            { new: true, runValidators: true }
        );
    },

    deleteProduct: async (id, userId) => {
        return await Product.findOneAndDelete({ _id: id, userId });
    },

    getProducts: async ({ userId, page = 1, limit = 20, search, expiresIn }) => {
        const query = { userId };

        // Search logic
        if (search) {
            query.$or = [
                { title: { $regex: search, $options: 'i' } },
                { upcCode: { $regex: search, $options: 'i' } }
            ];
        }

        // Expiry filter logic
        if (expiresIn) {
            const now = new Date();
            let futureDate = new Date();

            if (expiresIn === '1m') {
                futureDate.setMonth(now.getMonth() + 1);
            } else if (expiresIn === '3m') {
                futureDate.setMonth(now.getMonth() + 3);
            } else if (expiresIn === '6m') {
                futureDate.setMonth(now.getMonth() + 6);
            } else {
                // Default fallback if a different format is sent, or we could handle it dynamically
                // Let's just handle 1m and 3m as requested, maybe 6m.
            }
            
            // Items expiring between now and the future date
            query.expiryDate = { $gte: now, $lte: futureDate };
        }

        const skip = (page - 1) * limit;

        const products = await Product.find(query)
            .sort({ expiryDate: 1 })
            .skip(skip)
            .limit(limit);

        const total = await Product.countDocuments(query);

        return {
            products,
            total,
            page,
            totalPages: Math.ceil(total / limit)
        };
    }
};

module.exports = productDao;
