// backend/scripts/createUser.js
require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');

const MONGO_URI = process.env.MONGO_URI;

async function createUser() {
  await mongoose.connect(MONGO_URI);
  console.log('🔗 Conectado ao MongoDB');

  const user = new User({
    email: 'bantunes426@gmail.com',
    name: 'Bruno Antunes',
  });

  await user.setPassword('brunov43');
  await user.save();

  console.log('✅ Usuário criado com sucesso!');
  await mongoose.disconnect();
}

createUser().catch(err => {
  console.error('❌ Erro ao criar usuário:', err);
});