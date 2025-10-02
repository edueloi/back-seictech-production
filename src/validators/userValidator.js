const Joi = require('joi');

const createUserSchema = Joi.object({
    nome: Joi.string().min(3).max(100).required(),
    sobrenome: Joi.string().min(3).max(100).required(),
    email: Joi.string().email().required(),
    cpf: Joi.string().pattern(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/).required().messages({
        'string.pattern.base': 'O CPF deve estar no formato 999.999.999-99'
    }),
    senha: Joi.string().min(6).required(),
    role_id: Joi.number().integer().default(2), // Default para 'Usuario'
    // Adiciona .default(null) para garantir que o valor seja NULL se não for fornecido
    profissao: Joi.string().max(100).allow(null, '').default(null),
    escolaridade: Joi.string().max(100).allow(null, '').default(null),
    data_nascimento: Joi.date().iso().allow(null).default(null)
});

const updateUserSchema = Joi.object({
    nome: Joi.string().min(3).max(100),
    sobrenome: Joi.string().min(3).max(100),
    email: Joi.string().email(),
    cpf: Joi.string().pattern(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/).messages({
        'string.pattern.base': 'O CPF deve estar no formato 999.999.999-99'
    }),
    profissao: Joi.string().max(100).allow(null, ''),
    escolaridade: Joi.string().max(100).allow(null, ''),
    data_nascimento: Joi.date().iso().allow(null)
}).min(1); // Exige que pelo menos um campo seja enviado para atualização

const changePasswordSchema = Joi.object({
    currentPassword: Joi.string().required(),
    newPassword: Joi.string().min(6).required()
});

const updateUserStatusSchema = Joi.object({
    status: Joi.boolean().required()
});

module.exports = {
    createUserSchema,
    updateUserSchema,
    changePasswordSchema,
    updateUserStatusSchema
};