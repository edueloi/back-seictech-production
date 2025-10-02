// src/models/userModel.js
const db = require('../config/db');

const User = {
  create: async (userData) => {
    const sql = `
      INSERT INTO users (uuid, role_id, nome, sobrenome, email, cpf, senha, profissao, escolaridade, data_nascimento) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    const { uuid, role_id, nome, sobrenome, email, cpf, senha, profissao, escolaridade, data_nascimento } = userData;
    const [result] = await db.execute(sql, [uuid, role_id, nome, sobrenome, email, cpf, senha, profissao, escolaridade, data_nascimento]);
    return { id: result.insertId };
  },

  findById: async (id) => {
    const sql = `
      SELECT u.id, u.uuid, u.nome, u.sobrenome, u.email, u.cpf, u.status, u.data_cadastro, r.name AS role_name 
      FROM users AS u JOIN roles AS r ON u.role_id = r.id WHERE u.id = ?`;
    const [rows] = await db.execute(sql, [id]);
    return rows[0];
  },
  
  getAll: async () => {
    const sql = `
      SELECT u.id, u.uuid, u.nome, u.sobrenome, u.email, u.status, u.data_cadastro, r.name AS role_name 
      FROM users AS u JOIN roles AS r ON u.role_id = r.id ORDER BY u.nome ASC`;
    const [rows] = await db.execute(sql);
    return rows;
  },

  findByUuid: async (uuid) => {
    const sql = `SELECT * FROM users WHERE uuid = ?`;
    const [rows] = await db.execute(sql, [uuid]);
    return rows[0];
  },

  findByEmail: async (email) => {
    const sql = `SELECT u.*, r.name as role_name FROM users u JOIN roles r ON u.role_id = r.id WHERE u.email = ?`;
    const [rows] = await db.execute(sql, [email]);
    return rows[0];
  },

  update: async (uuid, userData) => {
    const { nome, sobrenome, email, cpf, profissao, escolaridade, data_nascimento } = userData;
    const sql = `
      UPDATE users 
      SET nome = ?, sobrenome = ?, email = ?, cpf = ?, profissao = ?, escolaridade = ?, data_nascimento = ? 
      WHERE uuid = ?`;
    const [result] = await db.execute(sql, [nome, sobrenome, email, cpf, profissao, escolaridade, data_nascimento, uuid]);
    return result.affectedRows > 0;
  },

  updateStatus: async (uuid, status) => {
    const sql = `UPDATE users SET status = ? WHERE uuid = ?`;
    const [result] = await db.execute(sql, [status, uuid]);
    return result.affectedRows > 0;
  },
  
  remove: async (uuid) => {
    const sql = `DELETE FROM users WHERE uuid = ?`;
    const [result] = await db.execute(sql, [uuid]);
    return result.affectedRows > 0;
  },

  updatePassword: async (id, newHashedPassword) => {
    const sql = `UPDATE users SET senha = ? WHERE id = ?`;
    const [result] = await db.execute(sql, [newHashedPassword, id]);
    return result.affectedRows > 0;
  },
  
  saveResetToken: async (id, token, expires) => {
    const sql = `UPDATE users SET reset_token = ?, reset_token_expires = ? WHERE id = ?`;
    const [result] = await db.execute(sql, [token, expires, id]);
    return result.affectedRows > 0;
  },

  findByResetToken: async (token) => {
    const sql = `SELECT * FROM users WHERE reset_token = ? AND reset_token_expires > NOW()`;
    const [rows] = await db.execute(sql, [token]);
    return rows[0];
  },

  updatePasswordAndClearToken: async (id, newHashedPassword) => {
    const sql = `UPDATE users SET senha = ?, reset_token = NULL, reset_token_expires = NULL WHERE id = ?`;
    const [result] = await db.execute(sql, [newHashedPassword, id]);
    return result.affectedRows > 0;
  }
};

module.exports = User;
