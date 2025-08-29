const express = require('express');
const session = require('express-session');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Oturum yönetimi
app.use(session({
  secret: 'atkoysporokulu-guvenlik-anahtari',
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 86400000 }
}));

// Statik dosyalar
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Şablon motoru
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Ana sayfa (Giriş)
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'login.html'));
});

// Giriş işlemi
app.post('/login', (req, res) => {
  const { username, password } = req.body;
  if (username === 'admin' && password === 'admin123*') {
    req.session.user = username;
    return res.redirect('/dashboard');
  }
  res.send('Hatalı kullanıcı adı veya şifre!');
});

// Dashboard
app.get('/dashboard', (req, res) => {
  if (!req.session.user) return res.redirect('/');
  res.sendFile(path.join(__dirname, 'views', 'dashboard.html'));
});

// Sunucu başlat
app.listen(PORT, () => {
  console.log(`✅ Atköy Spor Takip çalışıyor: http://localhost:${PORT}`);
});
