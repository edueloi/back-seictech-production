// src/config/db.js
const mysql = require('mysql2/promise');
require('dotenv').config();

// Cria um "pool" de conexões, que é mais eficiente para gerenciar múltiplas conexões
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Testa a conexão para garantir que tudo está funcionando na inicialização
async function testConnection() {
    try {
        const connection = await pool.getConnection();
        console.log('Conexão com o banco de dados bem-sucedida!');
        connection.release(); // Libera a conexão de volta para o pool
    } catch (error) {
        console.error('Erro ao conectar com o banco de dados:', error);
    }
}

testConnection();

module.exports = pool;