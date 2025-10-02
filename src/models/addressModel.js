// src/models/addressModel.js
const db = require('../config/db');

const Address = {
  // Cria ou atualiza um endereço, já que o usuário só pode ter um
  createOrUpdate: async (addressData) => {
    const { user_id, endereco, numero, cidade, pais, cep } = addressData;
    // ON DUPLICATE KEY UPDATE é um atalho do MySQL para fazer um INSERT ou, se a chave única (user_id) já existir, fazer um UPDATE.
    const sql = `
      INSERT INTO user_addresses (user_id, endereco, numero, cidade, pais, cep)
      VALUES (?, ?, ?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE
        endereco = VALUES(endereco),
        numero = VALUES(numero),
        cidade = VALUES(cidade),
        pais = VALUES(pais),
        cep = VALUES(cep)
    `;
    const [result] = await db.execute(sql, [user_id, endereco, numero, cidade, pais, cep]);
    return result;
  },

  // Busca o endereço pelo ID do usuário
  findByUserId: async (userId) => {
    const sql = `SELECT * FROM user_addresses WHERE user_id = ?`;
    const [rows] = await db.execute(sql, [userId]);
    return rows[0];
  },

  // Remove o endereço pelo ID do usuário
  removeByUserId: async (userId) => {
    const sql = `DELETE FROM user_addresses WHERE user_id = ?`;
    const [result] = await db.execute(sql, [userId]);
    return result.affectedRows > 0;
  }
};

module.exports = Address;
