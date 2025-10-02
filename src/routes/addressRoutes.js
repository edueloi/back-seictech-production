// src/routes/addressRoutes.js
const express = require('express');
const router = express.Router();
const addressController = require('../controllers/addressController');

// Middlewares
const auth = require('../middleware/authMiddleware');
const validate = require('../middleware/validationMiddleware');

// Validators
const { addressSchema } = require('../validators/addressValidator');

// Todas as rotas aqui são para o usuário logado gerenciar SEU PRÓPRIO endereço.

// GET /api/addresses -> Pega o endereço do usuário logado
router.get('/', auth, addressController.getAddress);

// POST /api/addresses -> Cria/Atualiza o endereço do usuário logado
router.post('/', auth, validate(addressSchema), addressController.createOrUpdateAddress);

// DELETE /api/addresses -> Deleta o endereço do usuário logado
router.delete('/', auth, addressController.deleteAddress);

module.exports = router;
