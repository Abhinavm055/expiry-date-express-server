const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
    },
    upcCode: {
        type: String,
        required: false,
        trim: true
    },
    title: {
        type: String,
        required: true,
        trim: true
    },
    amount: {
        value: { type: Number, required: true },
        currency: { type: String, required: true }
    },
    expiryDate: {
        type: Date,
        required: true,
        index: true
    }
}, { timestamps: true });

// Indexes for Search & Filtering
productSchema.index({ userId: 1, expiryDate: 1 });
productSchema.index({ userId: 1, title: 1 });
productSchema.index({ userId: 1, upcCode: 1 });

module.exports = mongoose.model('Product', productSchema);
