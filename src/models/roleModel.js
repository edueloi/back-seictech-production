// src/models/roleModel.js
const db = require('../config/db');

const Role = {
    getAll: async () => {
        const [rows] = await db.query('SELECT * FROM roles');
        return rows;
    }
};

module.exports = Role;