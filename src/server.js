require('dotenv').config();
const express = require('express');
const cors = require('cors');

// Importar rotas
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const addressRoutes = require('./routes/addressRoutes');
const roleRoutes = require('./routes/roleRoutes'); // Importar rotas de roles

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Usar rotas
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/addresses', addressRoutes);
app.use('/api/roles', roleRoutes); // Usar rotas de roles

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});