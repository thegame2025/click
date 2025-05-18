const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const path = require('path');
const authRoutes = require('./routes/auth');
const gameRoutes = require('./routes/game');

// Initialize app
const app = express();
const PORT = process.env.PORT || 3000;

// Connect to MongoDB
// Use environment variable or fallback to hardcoded string
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://thegame2025:METIN%4094@thegame.zn1lsam.mongodb.net/?retryWrites=true&w=majority&appName=TheGame';
mongoose.connect(MONGODB_URI)
.then(() => console.log('MongoDB connected'))
.catch(err => console.error('MongoDB connection error:', err));

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
  secret: process.env.SESSION_SECRET || 'secret-key-90s-game',
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 3600000 } // 1 hour
}));

// View engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Routes
app.get('/', (req, res) => {
  if (req.session.userId) {
    res.redirect('/game');
  } else {
    res.redirect('/auth');
  }
});

app.use('/', authRoutes);
app.use('/game', gameRoutes);

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 