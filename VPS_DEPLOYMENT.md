# Panduan Deployment di VPS

Ikuti langkah-langkah ini untuk menjalankan **Nekopoi-Scrape** di VPS Anda (Ubuntu/Debian direkomendasikan).

## 1. Persiapan Environment

Pastikan Node.js (v20+) sudah terinstal. Jika belum, gunakan perintah berikut:

```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs
```

## 2. Instalasi Proyek

Clone repositori dan instal semua dependencies:

```bash
git clone https://github.com/hiuraaaaa/Nekopoi-Scrape.git
cd Nekopoi-Scrape
npm install
```

Instal browser Chromium untuk fitur bypass Cloudflare:

```bash
npx playwright install chromium
# Instal dependencies sistem yang diperlukan oleh playwright
sudo npx playwright install-deps
```

## 3. Menjalankan dengan PM2 (Production)

Agar aplikasi tetap berjalan di background dan otomatis restart jika VPS reboot, gunakan **PM2**:

```bash
# Instal PM2 secara global
sudo npm install -g pm2

# Jalankan aplikasi
pm2 start src/server.js --name nekopoi-api

# Simpan konfigurasi agar otomatis jalan saat reboot
pm2 save
pm2 startup
```

## 4. Cara Pengujian di VPS

### A. Cek Status Log
Untuk melihat apakah scraper berjalan lancar atau terkena blokir:
```bash
pm2 logs nekopoi-api
```

### B. Uji Endpoint dengan `curl`
Jalankan perintah ini di terminal VPS Anda untuk memastikan API merespons:

```bash
# Uji Explore
curl http://localhost:3000/api/explore

# Uji Search
curl "http://localhost:3000/api/search?keyword=overflow"
```

### C. Akses dari Luar VPS
Pastikan port `3000` sudah dibuka di firewall VPS Anda:
```bash
sudo ufw allow 3000
```
Lalu akses melalui browser di PC Anda: `http://IP_VPS_ANDA:3000/api/explore`

## 5. Tips Anti-Error di VPS
- **RAM**: Pastikan VPS memiliki minimal 1GB RAM karena Playwright (Chromium) cukup memakan memori saat mode fallback aktif.
- **Proxy**: Jika IP VPS Anda diblokir oleh Cloudflare Nekopoi, segera tambahkan list proxy di file `.env`.
- **Update**: Lakukan `git pull` secara berkala jika ada perubahan selector di masa mendatang.
