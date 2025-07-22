// backend/server.js

require('dotenv').config();
const express = require('express');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const cors = require('cors');
const User = require('./models/User');

const app = express();
const PORT = 4000;

const authenticateToken = require('./middleware/auth');

// Middleware
app.use(cors());
app.use(express.json()); // para ler JSON do body

// Conexão MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ MongoDB conectado'))
.catch(err => console.error('❌ Erro MongoDB:', err));

// Rota de login
app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const secret = process.env.JWT_SECRET;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: 'Usuário não encontrado' });

    const valid = await user.validatePassword(password);
    if (!valid) return res.status(401).json({ message: 'Senha inválida' });

    console.log('Criando token com expiresIn 30m');
    const token = jwt.sign({ id: user._id, email: user.email }, secret, { expiresIn: '30m' });
    
    res.json({ token, name: user.name });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erro no servidor' });
  }
});

const worldRoutes = require('./routes/worldRoutes');
const calendarRoutes = require('./routes/calendarRoutes');
const monthRoutes = require('./routes/monthRoutes');
const sessionRoutes = require('./routes/sessionRoutes');
const campaignRoutes = require('./routes/campaignRoutes');
const characterRoutes = require('./routes/characterRoutes');
const arcRoutes = require('./routes/arcRoutes');


app.use('/api/campaigns', campaignRoutes);
app.use('/api/characters', characterRoutes);
app.use('/api/sessions', sessionRoutes);
app.use('/api/worlds', worldRoutes);
app.use('/api/calendars', calendarRoutes);
app.use('/api/months', monthRoutes);
app.use('/api/arcs', arcRoutes)

// Rota de rotas (menu)
app.get('/routes', authenticateToken, (req, res) => {
  res.json([
    { path: '/worlds', label: 'Worlds', component: 'WorldList' },
    { path: '/campaigns', label: 'Campaigns', component: 'CampaignList' },
    { path: '/arcs', label: 'Arcs', component: 'ArcList' },
    { path: '/sessions', label: 'Sessions', component: 'SessionList' },
    { path: '/characters', label: 'Characters', component: 'CharacterList' },
    { path: '/calendars', label: 'Calendars', component: 'CalendarList' },
  ]);
});

// Inicializa o servidor
app.listen(PORT, () => {
  console.log(`🚀 Backend rodando em http://localhost:${PORT}`);
});
