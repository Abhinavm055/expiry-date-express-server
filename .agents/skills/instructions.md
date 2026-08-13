# Coding Instruction for AI Agents

## Project Overview
This project is a Node.js/Express backend for an Expiry Date Manager application. The server manages product information including expiry dates and helps users track items nearing expiration.
This repository contains REST APIs which support operations like AuthN/AuthZ, CRUD operations, etc.,
related to expiry date management.

## Tech Stack & Environment
- Node.js (v24.16.0)
- Framework: Express.js
- Database: MongoDB

## Project Structure
- `src/` - Source code
- `src/config/` - Configuration files
- `src/controllers/` - Controller functions
- `src/models/` - Mongoose models
- `src/routes/` - Route definitions
- `src/services/` - Business logic
- `src/utils/` - Utility functions
- `src/dao/` - Database interactions
- `server.js` - Entry point

## Architecture Patterns
- Follow a strict Controller-Service-Repository pattern.
- Routes must only map to Controllers.
- Always generate swagger model for every newly added API.

### Coding Style Examples
#### 1. Controller
```
const userDao = require('../dao/userDao');

const authController = {
    login: async (request, response) => {
        const errors = validationResult(request);
        if (!errors.isEmpty()) {
            return response.status(400).json({
                errors: errors.array()
            });
        }

        const { email, password } = request.body;

        const user = await userDao.findByEmail(email);

        const isPasswordMatched = await bcrypt.compare(password, user?.password);
        if (user && isPasswordMatched) {
            user.role = user.role ? user.role : ADMIN_ROLE;
            user.adminId = user.adminId ? user.adminId : user._id;

            const token = jwt.sign({
                name: user.name,
                email: user.email,
                _id: user._id,
                // The logic below ensure backward compatibility.
                role: user.role ? user.role : ADMIN_ROLE,
                adminId: user.adminId ? user.adminId : user._id,
            }, process.env.JWT_SECRET,
                { expiresIn: '1h' }
            );

            response.cookie('jwtToken', token, {
                httpOnly: true,
                secure: true,
                domain: 'localhost',
                path: '/'
            });
            return response.status(200).json({
                message: 'User authenticated',
                user: user
            });
        } else {
            return response.status(400).json({
                message: 'Invalid email or password'
            });
        }
    },
};

module.exports = authController;
```

#### 2. DAO
```
const User = require('../model/users');

const userDao = {
    findByEmail: async (email) => {
        const user = await User.findOne({ email });
        return user;
    },
};

module.exports = userDao;
```

#### 3. Routes
```
const express = require('express');
const authController = require('../controllers/authController');

const router = express.Router();

router.post('/login', loginValidators, authController.login);

module.exports = router;
```

#### 4. Middleware
```
const jwt = require('jsonwebtoken');

const authMiddleware = {
    protect: async (request, response, next) => {
        try {
            const token = request.cookies?.jwtToken;

            if (!token) {
                return response.status(401).json({
                    error: 'Unauthorized access'
                });
            }

            try {
                const user = jwt.verify(token, process.env.JWT_SECRET);
                request.user = user;
                next();
            } catch (error) {
                return response.status(401).json({
                    error: 'Unauthorized access'
                });
            }

        } catch (error) {
            console.log(error);
            response.status(500).json({
                message: 'Internal server error'
            });
        }
    },
};

module.exports = authMiddleware;
```

#### 5. Models
```
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: { type: String, required: true},
    email: { type: String, required: true, unique: true },
    password: { type: String, required: false },
    googleId: { type: String, required: false },
});

module.exports = mongoose.model('User', userSchema);
```

## 3. Coding Instructions
1. Always get approval before making changes.