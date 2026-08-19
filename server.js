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

// CORS Configuration
const allowedOrigins = [
    'http://localhost:5173',
    'http://127.0.0.1:5173',
    process.env.FRONTEND_URL
].filter(Boolean);

const corsOptions = {
    origin: function (origin, callback) {
        if (!origin) return callback(null, true);
        if (allowedOrigins.includes(origin) || origin.endsWith('.vercel.app') || (process.env.NODE_ENV !== 'production' && origin.startsWith('http://localhost:'))) {
            return callback(null, true);
        }
        return callback(null, true);
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept']
};

app.use(cors(corsOptions));
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

// Start Server
const server = app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

// MongoDB Connection
const dbUri = process.env.MONGODB_URI || process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/expiry-date-manager';

mongoose.connect(dbUri)
    .then(() => {
        console.log('Connected to MongoDB');
    })
    .catch((error) => {
        console.error('MongoDB connection error:', error.message);
    });

mongoose.connection.on('error', (err) => {
    console.error('Mongoose event error:', err.message);
});
