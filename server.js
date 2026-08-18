const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
require('dotenv').config();

const setupSwagger = require('./src/config/swagger');
const authRoutes = require('./src/routes/authRoutes');
const productRoutes = require('./src/routes/productRoutes');

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Basic route for health check
app.get('/', (req, res) => {
    res.status(200).json({ message: 'Server is up and running!' });
});

// Setup Swagger
setupSwagger(app);

// Routes
app.use('/auth', authRoutes);
app.use('/products', productRoutes);

// MongoDB Connection and Start Server
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/expiry-date-manager')
    .then(() => {
        console.log('Connected to MongoDB');
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    })
    .catch((error) => {
        console.error('Error connecting to MongoDB:', error);
    });
