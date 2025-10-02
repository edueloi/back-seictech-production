const validate = (schema) => (req, res, next) => {
  const { error, value } = schema.validate(req.body, {
    abortEarly: false, // Mostra todos os erros de uma vez
    stripUnknown: true, // Remove campos que não estão no schema
    allowUnknown: false // Não permite campos desconhecidos
  });

  if (error) {
    const errors = error.details.map((detail) => ({
      message: detail.message.replace(/"/g, "'"), // Formata a mensagem de erro
      field: detail.context.key,
    }));
    return res.status(400).json({ message: "Dados inválidos", errors });
  }

  req.body = value; // Sobrescreve o body com os dados validados e limpos
  return next();
};

module.exports = validate;
