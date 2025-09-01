const express = require('express');
const session = require('express-session');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Oturum
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

// Ana sayfa
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'login.html'));
});

// Giriş
app.post('/login', (req, res) => {
  const { username, password } = req.body;
  if (username === 'admin' && password === 'admin123*') {
    req.session.user = username;
    return res.redirect('/dashboard');
  }
  res.send('Hatalı giriş!');
});

// Dashboard
app.get('/dashboard', (req, res) => {
  if (!req.session.user) return res.redirect('/');
  res.sendFile(path.join(__dirname, 'views', 'dashboard.html'));
});

// Öğrenci Listesi
app.get('/ogrenciler', (req, res) => {
  if (!req.session.user) return res.redirect('/');
  const db = require('./models/db');
  db.all("SELECT * FROM ogrenciler", (err, rows) => {
    if (err) return res.send('Veri alınamadı');
    res.render('ogrenciler', { ogrenciler: rows });
  });
});

// Öğrenci Detay / Ekleme
app.get('/ogrenci-detay', (req, res) => {
  if (!req.session.user) return res.redirect('/');
  const id = req.query.id;
  const db = require('./models/db');

  if (id) {
    db.get("SELECT * FROM ogrenciler WHERE id = ?", [id], (err, row) => {
      if (err || !row) return res.send('Öğrenci bulunamadı');
      res.render('ogrenci-detay', { ogrenci: row });
    });
  } else {
    res.render('ogrenci-detay', { ogrenci: {} });
  }
});

// Öğrenci Kaydet
app.post('/ogrenci-kaydet', (req, res) => {
  if (!req.session.user) return res.status(403).send('Erişim reddedildi');

  const {
    tc, ad, soyad, dogumTarihi, dogumYeri, boy, kilo, kanGrubu,
    brans, telefon, okul, babaAd, babaTel, anneAd, anneTel, adres,
    acilAd, acilSoyad, acilYakinlik, acilTel
  } = req.body;

  const db = require('./models/db');
  const stmt = db.prepare(`INSERT INTO ogrenciler (
    tc_no, ad, soyad, dogum_tarihi, dogum_yeri, boy, kilo, kan_grubu,
    spor_bransi, telefon, okul, baba_adi, baba_telefon, anne_adi,
    anne_telefon, ev_adresi, acil_adi, acil_soyadi, acil_yakinlik, acil_telefon, kaydi_yapan
  ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`);

  stmt.run(
    tc, ad, soyad, dogumTarihi, dogumYeri, boy, kilo, kanGrubu,
    brans, telefon, okul, babaAd, babaTel, anneAd, anneTel, adres,
    acilAd, acilSoyad, acilYakinlik, acilTel, req.session.user,
    (err) => {
      if (err) {
        console.error('Kayıt hatası:', err);
        return res.send('Kayıt yapılamadı: ' + err.message);
      }
      res.send(`
        <h3>✅ Öğrenci başarıyla kaydedildi!</h3>
        <a href="/ogrenciler" class="btn btn-primary">Öğrenci Listesine Dön</a>
      `);
    }
  );
  stmt.finalize();
});

// Sunucu başlat
app.listen(PORT, () => {
  console.log(`✅ Atköy Spor Okulu çalışıyor: http://localhost:${PORT}`);
});
