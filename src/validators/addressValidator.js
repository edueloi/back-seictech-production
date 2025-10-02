// src/validators/addressValidator.js
const Joi = require('joi');

const addressSchema = Joi.object({
    endereco: Joi.string().max(255).required(),
    numero: Joi.string().max(20).required(),
    cidade: Joi.string().max(100).required(),
    pais: Joi.string().max(100).required(),
    cep: Joi.string().pattern(/^\d{5}-\d{3}$/).required().messages({
        'string.pattern.base': 'O CEP deve estar no formato 99999-999'
    })
});

module.exports = {
    addressSchema
};