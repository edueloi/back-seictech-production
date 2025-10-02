// src/middleware/authMiddleware.js
const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
  // Pega o token do header da requisição
  const token = req.header('x-auth-token');

  // Verifica se não há token
  if (!token) {
    return res.status(401).json({ message: 'Nenhum token, autorização negada.' });
  }

  // Verifica se o token é válido
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded.user; // Adiciona o payload do usuário à requisição
    next(); // Passa para a próxima etapa (o controller)
  } catch (err) {
    res.status(401).json({ message: 'Token inválido.' });
  }
};
