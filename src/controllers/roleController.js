// src/controllers/roleController.js
const Role = require('../models/roleModel');

exports.getAllRoles = async (req, res) => {
    try {
        const roles = await Role.getAll();
        res.status(200).json(roles);
    } catch (error) {
        console.error('Erro ao buscar funções:', error);
        res.status(500).json({ message: 'Erro interno no servidor.' });
    }
};