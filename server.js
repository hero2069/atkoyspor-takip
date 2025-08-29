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
// Ogrenciler
app.get('/ogrenciler', (req, res) => {
  if (!req.session.user) return res.redirect('/');
  res.sendFile(path.join(__dirname, 'views', 'ogrenciler.html'));
});
// OgrenciDetay
app.get('/ogrenci-detay', (req, res) => {
  if (!req.session.user) return res.redirect('/');
  res.sendFile(path.join(__dirname, 'views', 'ogrenci-detay.html'));
});
// Öğrenci Kaydet
app.post('/ogrenci-kaydet', (req, res) => {
  if (!req.session.user) return res.status(403).send('Erişim reddedildi');

  const {
    tc, ad, soyad, dogumTarihi, dogumYeri, boy, kilo, kanGrubu,
    brans, telefon, okul, babaAd, babaSoyad, babaTel, babaMeslek,
    anneAd, anneSoyad, anneTel, anneMeslek, adres, acilAd, acilSoyad,
    acilYakinlik, acilTel
  } = req.body;

  const db = require('./models/db');

  const stmt = db.prepare(`INSERT INTO ogrenciler (
    tc_no, ad, soyad, dogum_tarihi, dogum_yeri, boy, kilo, kan_grubu,
    spor_bransi, telefon, okul, baba_adi, baba_soyadi, baba_telefon,
    baba_meslek, anne_adi, anne_soyadi, anne_telefon, anne_meslek,
    ev_adresi, acil_adi, acil_soyadi, acil_yakinlik, acil_telefon,
    kaydi_yapan
  ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`);

  stmt.run(
    tc, ad, soyad, dogumTarihi, dogumYeri, boy, kilo, kanGrubu,
    brans, telefon, okul, babaAd, babaSoyad, babaTel, babaMeslek,
    anneAd, anneSoyad, anneTel, anneMeslek, adres, acilAd, acilSoyad,
    acilYakinlik, acilTel, req.session.user
  );

  stmt.finalize(() => {
    res.send('Öğrenci başarıyla kaydedildi!');
  });
});
// Sunucu başlat
app.listen(PORT, () => {
  console.log(`✅ Atköy Spor Takip çalışıyor: http://localhost:${PORT}`);
});
