const authorize = (allowedRoles) => {
  return (req, res, next) => {
    // O middleware `auth` já decodificou o token e adicionou o payload do usuário em `req.user`
    const { role } = req.user;

    if (!role) {
        return res.status(403).json({ message: 'Acesso negado. Nível de permissão do usuário não identificado.' });
    }

    // `allowedRoles` será um array de strings, ex: ['Administrador']
    // Verificamos se a role do usuário está na lista de roles permitidas para esta rota
    if (allowedRoles.includes(role)) {
      return next(); // O usuário tem a permissão necessária, pode prosseguir
    } else {
      return res.status(403).json({ message: 'Acesso negado. Você não tem permissão para executar esta ação.' });
    }
  };
};

module.exports = authorize;
