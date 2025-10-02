// src/routes/roleRoutes.js
const express = require('express');
const router = express.Router();
const roleController = require('../controllers/roleController');

// GET /api/roles -> Listar todas as funções (público)
router.get('/', roleController.getAllRoles);

module.exports = router;