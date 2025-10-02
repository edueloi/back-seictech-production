// src/controllers/authController.js
const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

// POST /api/auth/login -> Fazer login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Email e senha são obrigatórios.' });
    }

    const user = await User.findByEmail(email);
    if (!user) {
      return res.status(401).json({ message: 'Credenciais inválidas.' }); // 401 Unauthorized
    }
    
    // Verifica se o usuário está ativo
    if (!user.status) {
        return res.status(403).json({ message: 'Este usuário está inativo.' }); // 403 Forbidden
    }

    const isMatch = await bcrypt.compare(password, user.senha);
    if (!isMatch) {
      return res.status(401).json({ message: 'Credenciais inválidas.' });
    }

    // Usuário autenticado, criar o Token JWT
    const payload = {
      user: {
        id: user.uuid,
        email: user.email,
        role: user.role_name
      }
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '8h' }, // Token expira em 8 horas
      (err, token) => {
        if (err) throw err;
        res.json({ token });
      }
    );

  } catch (error) {
    console.error('Erro no login:', error);
    res.status(500).json({ message: 'Erro interno no servidor.' });
  }
};

// POST /api/auth/forgot-password -> Solicitar reset de senha
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findByEmail(email);

    if (!user) {
      return res.status(200).json({ message: 'Se um usuário com este e-mail existir, um link de redefinição de senha será enviado.' });
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');

    const expirationDate = new Date(Date.now() + 10 * 60 * 1000);

    await User.saveResetToken(user.id, hashedToken, expirationDate);

    console.log('----------------------------------------------------');
    console.log('TOKEN DE RESET (copie para testar):', resetToken);
    console.log('----------------------------------------------------');

    res.status(200).json({ message: 'Link de redefinição enviado (verifique o console).' });

  } catch (error) {
    console.error('Erro ao solicitar reset de senha:', error);
    res.status(500).json({ message: 'Erro interno no servidor' });
  }
};

// PATCH /api/auth/reset-password/:token -> Realizar o reset
exports.resetPassword = async (req, res) => {
    try {
        const { token } = req.params;
        const { newPassword } = req.body;
        
        const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
        
        const user = await User.findByResetToken(hashedToken);

        if (!user) {
            return res.status(400).json({ message: 'Token inválido ou expirado.' });
        }
        
        const salt = await bcrypt.genSalt(10);
        const newHashedPassword = await bcrypt.hash(newPassword, salt);
        
        await User.updatePasswordAndClearToken(user.id, newHashedPassword);

        res.status(200).json({ message: 'Senha redefinida com sucesso!' });

    } catch (error) {
        console.error('Erro ao redefinir senha:', error);
        res.status(500).json({ message: 'Erro interno no servidor' });
    }
};
