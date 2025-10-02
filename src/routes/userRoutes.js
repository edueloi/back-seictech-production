// src/routes/userRoutes.js
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// Middlewares
const auth = require('../middleware/authMiddleware');
const authorize = require('../middleware/authorize'); // Middleware de permissão
const validate = require('../middleware/validationMiddleware');

// Validators
const { 
    createUserSchema, 
    updateUserSchema, 
    changePasswordSchema, 
    updateUserStatusSchema 
} = require('../validators/userValidator');

// --- Rota Pública ---
// POST /api/users/ -> Criar um novo usuário
router.post('/', validate(createUserSchema), userController.createUser);

// --- Rotas Protegidas (Requerem Login) ---

// GET /api/users/ -> Listar todos os usuários (Apenas Admins)
router.get('/', auth, authorize(['Administrador']), userController.getAllUsers);

// GET /api/users/:uuid -> Buscar um usuário específico
// Qualquer usuário logado pode ver um perfil, mas não a senha (que já é removida no controller)
router.get('/:uuid', auth, userController.getUserByUuid);

// PUT /api/users/:uuid -> Atualizar um usuário
// A lógica de quem pode atualizar quem (admin vs. próprio usuário) deve ser tratada no controller.
router.put('/:uuid', auth, validate(updateUserSchema), userController.updateUser);

// PATCH /api/users/:uuid/status -> Ativar/Inativar um usuário (Apenas Admins)
router.patch('/:uuid/status', auth, authorize(['Administrador']), validate(updateUserStatusSchema), userController.updateUserStatus);

// DELETE /api/users/:uuid -> Deletar um usuário (Apenas Admins)
router.delete('/:uuid', auth, authorize(['Administrador']), userController.deleteUser);

// PATCH /api/users/:uuid/change-password -> Usuário troca a própria senha
router.patch('/:uuid/change-password', auth, validate(changePasswordSchema), userController.changePassword);


// --- Rotas para o usuário logado gerenciar seu perfil ---

// GET /api/users/me -> Buscar o próprio perfil
router.get('/me', auth, userController.getMe);

// PUT /api/users/me -> Atualizar o próprio perfil
router.put('/me', auth, validate(updateUserSchema), userController.updateMe);

// DELETE /api/users/me -> Deletar a própria conta
router.delete('/me', auth, userController.deleteMe);


module.exports = router;