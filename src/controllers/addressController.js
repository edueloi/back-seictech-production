// src/controllers/addressController.js
const Address = require('../models/addressModel');
const User = require('../models/userModel'); // Para buscar o ID numérico do usuário

// GET /api/addresses -> Pega o endereço do usuário logado
exports.getAddress = async (req, res) => {
    try {
        // O UUID do usuário vem do token JWT
        const user_uuid = req.user.id;
        const user = await User.findByUuid(user_uuid);
        if (!user) {
            return res.status(404).json({ message: 'Usuário não encontrado.' });
        }

        const address = await Address.findByUserId(user.id);
        if (!address) {
            return res.status(404).json({ message: 'Endereço não encontrado para este usuário.' });
        }

        res.status(200).json(address);
    } catch (error) {
        console.error('Erro ao buscar endereço:', error);
        res.status(500).json({ message: 'Erro interno no servidor.' });
    }
};

// POST ou PUT /api/addresses -> Cria ou atualiza o endereço do usuário logado
exports.createOrUpdateAddress = async (req, res) => {
    try {
        const user_uuid = req.user.id;
        const user = await User.findByUuid(user_uuid);
        if (!user) {
            return res.status(404).json({ message: 'Usuário não encontrado.' });
        }

        const addressData = { ...req.body, user_id: user.id };

        await Address.createOrUpdate(addressData);
        const newAddress = await Address.findByUserId(user.id);

        res.status(200).json({ message: 'Endereço salvo com sucesso!', address: newAddress });
    } catch (error) {
        console.error('Erro ao salvar endereço:', error);
        res.status(500).json({ message: 'Erro interno no servidor.' });
    }
};

// DELETE /api/addresses -> Deleta o endereço do usuário logado
exports.deleteAddress = async (req, res) => {
    try {
        const user_uuid = req.user.id;
        const user = await User.findByUuid(user_uuid);
        if (!user) {
            return res.status(404).json({ message: 'Usuário não encontrado.' });
        }

        const deleted = await Address.removeByUserId(user.id);
        if (!deleted) {
            return res.status(404).json({ message: 'Endereço não encontrado para deletar.' });
        }

        res.status(200).json({ message: 'Endereço deletado com sucesso.' });
    } catch (error) {
        console.error('Erro ao deletar endereço:', error);
        res.status(500).json({ message: 'Erro interno no servidor.' });
    }
};
