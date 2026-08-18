const express = require('express');
const { body } = require('express-validator');
const productController = require('../controllers/productController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

const addProductValidators = [
    body('title').notEmpty().withMessage('Title is required'),
    body('amount.value').isNumeric().withMessage('Amount value is required and must be a number'),
    body('amount.currency').notEmpty().withMessage('Currency is required'),
    body('expiryDate').isISO8601().toDate().withMessage('Valid expiry date is required')
];

/**
 * @swagger
 * /products:
 *   get:
 *     summary: Get user's products
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Items per page
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search by title or upcCode
 *       - in: query
 *         name: expiresIn
 *         schema:
 *           type: string
 *         description: Filter by expiry (e.g., 1m, 3m)
 *     responses:
 *       200:
 *         description: List of products
 */
router.get('/', authMiddleware.protect, productController.getProducts);

/**
 * @swagger
 * /products:
 *   post:
 *     summary: Add a new product
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - amount
 *               - expiryDate
 *             properties:
 *               title:
 *                 type: string
 *               upcCode:
 *                 type: string
 *               amount:
 *                 type: object
 *                 properties:
 *                   value:
 *                     type: number
 *                   currency:
 *                     type: string
 *               expiryDate:
 *                 type: string
 *                 format: date-time
 *     responses:
 *       201:
 *         description: Product added successfully
 */
router.post('/', authMiddleware.protect, addProductValidators, productController.addProduct);

/**
 * @swagger
 * /products/{id}:
 *   put:
 *     summary: Update an existing product
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               upcCode:
 *                 type: string
 *               amount:
 *                 type: object
 *                 properties:
 *                   value:
 *                     type: number
 *                   currency:
 *                     type: string
 *               expiryDate:
 *                 type: string
 *                 format: date-time
 *     responses:
 *       200:
 *         description: Product updated successfully
 */
router.put('/:id', authMiddleware.protect, productController.updateProduct);

/**
 * @swagger
 * /products/{id}:
 *   delete:
 *     summary: Delete a product
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Product deleted successfully
 */
router.delete('/:id', authMiddleware.protect, productController.deleteProduct);

module.exports = router;
