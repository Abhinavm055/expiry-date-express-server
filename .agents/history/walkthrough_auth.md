# Implementing Auth APIs - Login & Register

## Overview
This document summarizes the changes made to implement the authentication APIs (`/auth/login` and `/auth/register`) for the Expiry Date Manager Express server.

## Changes Made
1. **User Model**: 
   - Created `src/models/user.js` using Mongoose to define the schema (`name`, `email`, and `password`).
2. **Database Access Object (DAO)**:
   - Created `src/dao/userDao.js` to handle MongoDB queries for finding and creating users.
3. **Business Logic (Service Layer)**:
   - Created `src/services/authService.js` to handle password hashing with `bcrypt` and JWT generation with `jsonwebtoken`. This adheres to the Controller-Service-Repository pattern.
4. **Controllers**:
   - Created `src/controllers/authController.js` to handle request validation and responses for the login and register endpoints.
5. **Routes & Swagger**:
   - Created `src/routes/authRoutes.js` and registered the `POST /auth/login` and `POST /auth/register` endpoints.
   - Added `swagger-jsdoc` annotations to these routes to document the API.
   - Created `src/config/swagger.js` to set up and configure the Swagger UI.
6. **Server Integration**:
   - Updated `server.js` to connect to MongoDB, mount the `/auth` routes, and serve the Swagger UI at `/api-docs`.

## Status
- The auth APIs are fully functional.
- Passwords are securely hashed before being stored in the database.
- A JWT is returned and set as an HTTP-only cookie upon successful login.
- Swagger documentation is successfully generated and accessible.
