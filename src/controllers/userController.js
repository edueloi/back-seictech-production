// src/controllers/userController.js
const User = require('../models/userModel');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');

// POST /api/users -> Criar um novo usuário
exports.createUser = async (req, res) => {
  try {
    const userData = req.body;

    // A validação agora é feita pelo Joi, então o IF foi removido.

    const userUUID = uuidv4();
    userData.uuid = userUUID; 

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(userData.senha, salt);
    userData.senha = hashedPassword;

    const newUserInternal = await User.create(userData);
    const createdUser = await User.findById(newUserInternal.id);

    res.status(201).json({ message: 'Usuário criado com sucesso!', user: createdUser });

  } catch (error) {
    console.error('Erro ao criar usuário:', error);
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ message: 'E-mail ou CPF já cadastrado.' });
    }
    res.status(500).json({ message: 'Erro interno no servidor.' });
  }
};

// GET /api/users -> Listar todos os usuários
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.getAll();
    res.status(200).json(users);
  } catch (error) {
    console.error('Erro ao buscar usuários:', error);
    res.status(500).json({ message: 'Erro interno no servidor.' });
  }
};

// GET /api/users/:uuid -> Buscar um usuário pelo UUID
exports.getUserByUuid = async (req, res) => {
  try {
    const { uuid } = req.params;
    const user = await User.findByUuid(uuid);
    if (!user) {
      return res.status(404).json({ message: 'Usuário não encontrado.' });
    }
    delete user.senha;
    res.status(200).json(user);
  } catch (error) {
    console.error('Erro ao buscar usuário:', error);
    res.status(500).json({ message: 'Erro interno no servidor.' });
  }
};

// PUT /api/users/:uuid -> Atualizar um usuário
exports.updateUser = async (req, res) => {
  try {
    const { uuid } = req.params;

    // Apenas o próprio usuário ou um admin pode alterar os dados
    if (req.user.uuid !== uuid && req.user.role !== 'Administrador') {
        return res.status(403).json({ message: 'Acesso negado. Você não tem permissão para atualizar este usuário.' });
    }
    
    const updated = await User.update(uuid, req.body);
    if (updated) {
      const updatedUser = await User.findByUuid(uuid);
      delete updatedUser.senha;
      res.status(200).json({ message: 'Usuário atualizado com sucesso!', user: updatedUser });
    } else {
        res.status(404).json({ message: 'Usuário não encontrado ou nenhum dado foi alterado.' });
    }
  } catch (error) {
    console.error('Erro ao atualizar usuário:', error);
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ message: 'E-mail ou CPF já cadastrado em outro usuário.' });
    }
    res.status(500).json({ message: 'Erro interno no servidor.' });
  }
};

// PATCH /api/users/:uuid/status -> Ativar/Inativar um usuário
exports.updateUserStatus = async (req, res) => {
    try {
        const { uuid } = req.params;
        const { status } = req.body;

        const updated = await User.updateStatus(uuid, status);
        if (!updated) {
            return res.status(404).json({ message: 'Usuário não encontrado.' });
        }

        res.status(200).json({ message: `Status do usuário alterado para ${status ? 'ativo' : 'inativo'}.` });

    } catch (error) {
        console.error('Erro ao atualizar status do usuário:', error);
        res.status(500).json({ message: 'Erro interno no servidor.' });
    }
};

// DELETE /api/users/:uuid -> Deletar um usuário
exports.deleteUser = async (req, res) => {
  try {
    const { uuid } = req.params;
    const deleted = await User.remove(uuid);
    if (!deleted) {
      return res.status(404).json({ message: 'Usuário não encontrado.' });
    }
    res.status(200).json({ message: 'Usuário deletado com sucesso.' });
  } catch (error) {
    console.error('Erro ao deletar usuário:', error);
    res.status(500).json({ message: 'Erro interno no servidor.' });
  }
};


// PATCH /api/users/:uuid/change-password -> Trocar a senha
exports.changePassword = async (req, res) => {
  try {
    const { uuid } = req.params; 
    const { currentPassword, newPassword } = req.body;

    // Apenas o próprio usuário ou um admin pode alterar a senha
    if (req.user.uuid !== uuid && req.user.role !== 'Administrador') {
        return res.status(403).json({ message: 'Acesso negado. Você não tem permissão para alterar esta senha.' });
    }

    const user = await User.findByUuid(uuid);
    if (!user) {
      return res.status(404).json({ message: 'Usuário não encontrado.' });
    }

    const isMatch = await bcrypt.compare(currentPassword, user.senha);
    if (!isMatch) {
      return res.status(401).json({ message: 'Senha atual incorreta.' });
    }

    const salt = await bcrypt.genSalt(10);
    const newHashedPassword = await bcrypt.hash(newPassword, salt);

    await User.updatePassword(user.id, newHashedPassword);

    res.status(200).json({ message: 'Senha alterada com sucesso!' });

  } catch (error) {
    console.error('Erro ao alterar senha:', error);
    res.status(500).json({ message: 'Erro interno no servidor.' });
  }
};

// --- Rotas para o usuário gerenciar o próprio perfil ---

// GET /api/users/me -> Buscar dados do usuário logado
exports.getMe = async (req, res) => {
    try {
        // O ID do usuário vem do token (authMiddleware)
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ message: 'Usuário não encontrado.' });
        }
        res.status(200).json(user);
    } catch (error) {
        console.error('Erro ao buscar dados do usuário:', error);
        res.status(500).json({ message: 'Erro interno no servidor.' });
    }
};

// PUT /api/users/me -> Usuário atualiza o próprio perfil
exports.updateMe = async (req, res) => {
    try {
        // O UUID do usuário vem do token
        const userUUID = req.user.uuid;
        
        const updated = await User.update(userUUID, req.body);
        if (updated) {
            const updatedUser = await User.findByUuid(userUUID);
            delete updatedUser.senha;
            res.status(200).json({ message: 'Perfil atualizado com sucesso!', user: updatedUser });
        } else {
            res.status(404).json({ message: 'Usuário não encontrado ou nenhum dado foi alterado.' });
        }
    } catch (error) {
        console.error('Erro ao atualizar perfil:', error);
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(400).json({ message: 'E-mail ou CPF já cadastrado em outro usuário.' });
        }
        res.status(500).json({ message: 'Erro interno no servidor.' });
    }
};

// DELETE /api/users/me -> Usuário deleta a própria conta
exports.deleteMe = async (req, res) => {
    try {
        // O UUID do usuário vem do token
        const userUUID = req.user.uuid;
        const deleted = await User.remove(userUUID);
        if (!deleted) {
            return res.status(404).json({ message: 'Usuário não encontrado.' });
        }
        // Idealmente, aqui você também invalidaria o token (ex: blocklist)
        res.status(200).json({ message: 'Sua conta foi deletada com sucesso.' });
    } catch (error) {
        console.error('Erro ao deletar conta:', error);
        res.status(500).json({ message: 'Erro interno no servidor.' });
    }
};