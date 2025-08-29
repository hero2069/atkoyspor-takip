const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

// Veritabanı dosyasının yolu
const dbPath = path.resolve(__dirname, 'database.db');

// Klasör yoksa oluştur
if (!fs.existsSync(path.dirname(dbPath))) {
  fs.mkdirSync(path.dirname(dbPath), { recursive: true });
}

// Veritabanı bağlantısı
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Veritabanı hatası:', err.message);
  } else {
    console.log('✅ SQLite veritabanı bağlandı: database.db');
  }
});

// Öğrenci tablosu
db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS ogrenciler (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    tc_no TEXT UNIQUE NOT NULL,
    ad TEXT NOT NULL,
    soyad TEXT NOT NULL,
    dogum_tarihi TEXT,
    dogum_yeri TEXT,
    boy REAL,
    kilo INTEGER,
    kan_grubu TEXT,
    spor_bransi TEXT,
    telefon TEXT,
    okul TEXT,
    baba_adi TEXT,
    baba_soyadi TEXT,
    baba_telefon TEXT,
    baba_meslek TEXT,
    anne_adi TEXT,
    anne_soyadi TEXT,
    anne_telefon TEXT,
    anne_meslek TEXT,
    ev_adresi TEXT,
    acil_adi TEXT,
    acil_soyadi TEXT,
    acil_yakinlik TEXT,
    acil_telefon TEXT,
    foto_url TEXT,
    kayit_tarihi TEXT DEFAULT (datetime('now','localtime')),
    kaydi_yapan TEXT,
    aidat_durumu TEXT DEFAULT 'ödenmedi'
  )`);
});

module.exports = db;
