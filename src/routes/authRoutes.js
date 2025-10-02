// src/routes/authRoutes.js
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// POST /api/auth/login -> Fazer login
router.post('/login', authController.login);

// POST /api/auth/forgot-password -> Solicitar reset de senha
router.post('/forgot-password', authController.forgotPassword);

// PATCH /api/auth/reset-password/:token -> Realizar o reset
router.patch('/reset-password/:token', authController.resetPassword);

module.exports = router;
