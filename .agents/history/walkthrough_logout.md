# Implemented Logout API

## Summary of Changes
Implemented the `/auth/logout` endpoint in the Node.js Express server to allow users to log out by clearing their authentication cookie.

## Details
- **Controller (`src/controllers/authController.js`)**: 
  - Added a `logout` function.
  - Used `res.clearCookie('jwtToken', { ... })` to invalidate the JWT token cookie with the same properties (`httpOnly`, `secure`, `path`) used during login.
  - Returned a `200 OK` JSON response indicating successful logout.

- **Routes (`src/routes/authRoutes.js`)**:
  - Registered the `/logout` route using `router.post('/logout', authController.logout)`.
  - Added Swagger OpenAPI documentation blocks for the new route to maintain API documentation standards.

## Verification
- Syntax check passed for both `authController.js` and `authRoutes.js`.
- The user has manually tested the changes and confirmed they work as expected.
