# Deploy Report — Aftech Corporate Website (Local → Production)

> Runbook untuk AI agent maupun manusia. Ikuti berurutan dari atas ke bawah.
> Terakhir diverifikasi: build sukses (`tsc -b && vite build`), `dist/` lengkap.

---

## 1. Ringkasan Arsitektur

| Item | Nilai |
|---|---|
| Stack | React 18 + Vite 5 + TypeScript + Tailwind + React Router (SPA) |
| Output prod | Direktori statis `dist/` — **tanpa Node.js runtime di server** |
| Hosting target | Hostinger Shared Hosting, domain `https://www.aftech.co.id` |
| Docroot | `public_html/` (deploy di ROOT, berdampingan dengan app lain) |
| Vite `base` | `/` (default — jangan diubah kecuali pindah ke subfolder) |
| Form kontak | `POST /api/contact.php` (PHP `mail()`, tanpa backend Node) |
| SPA fallback | `public_html/.htaccess` (RewriteRule ke `/index.html`) |

---

## 2. Prasyarat

- [ ] Node.js LTS + npm terinstal di mesin lokal
- [ ] Akses Hostinger (File Manager atau FTP) ke `public_html/`
- [ ] File `.env` production sudah benar (lihat §3)
- [ ] Alamat email penerima form sudah benar (lihat §7 ⚠️)

---

## 3. Konfigurasi Environment (production)

File `.env` (JANGAN commit isi rahasia — file ini berisi config publik frontend):

```env
VITE_SITE_URL=https://www.aftech.co.id
VITE_SITE_NAME=PT Aftech Daya Solusindo
VITE_GA_ID=
VITE_CONTACT_ENDPOINT=/api/contact.php
```

Catatan:

- `VITE_SITE_URL` dipakai untuk canonical + SEO/OG. Ganti jika domain berubah.
- `VITE_GA_ID` kosong = analytics nonaktif. Isi dengan ID GA4 bila sudah ada.
- Semua `VITE_*` ter-bake ke JS saat build → **setiap ganti `.env` wajib rebuild + re-upload `dist/assets/`.**

---

## 4. Prosedur Deploy (langkah eksekusi)

### 4.1 Verifikasi lokal

```bash
npm install
npm run typecheck   # harus exit 0, tanpa error
npm run lint        # toleransi: 1 warning react-refresh di ImageReveal.tsx (pre-existing)
npm run build       # menghasilkan dist/ (±11 MB)
```

### 4.2 Validasi isi `dist/` (wajib sebelum upload)

Expected:

```text
dist/
├── .htaccess          # SPA fallback — HARUS ADA (file tersembunyi!)
├── index.html
├── favicon.png
├── robots.txt
├── sitemap.xml
├── api/
│   └── contact.php    # endpoint form
└── assets/            # JS/CSS/gambar ter-hash
```

Perintah cek cepat:

```bash
ls -la dist/ | grep htaccess        # harus muncul .htaccess
ls dist/api/                        # harus ada contact.php
du -sh dist/                        # acuan ±11 MB
```

### 4.3 Upload ke Hostinger

1. Buka File Manager (atau FTP) → masuk ke `public_html/`.
2. Upload **ISI** `dist/` — bukan folder `dist/` itu sendiri.
3. Pastikan file tersembunyi ikut: `.htaccess` sering ter-skip oleh FTP client. Aktifkan "show hidden files".
4. Struktur akhir yang benar:

```text
public_html/
├── .htaccess
├── index.html
├── api/contact.php
└── assets/...
```

5. JANGAN hapus folder app lain yang sudah ada (`adminklinik|budget|eptms|erp|klinik|mk|smart`) — `.htaccess` sudah dikonfigurasi untuk tidak mengganggu mereka (lihat §6).

### 4.4 Verifikasi production (checklist)

- [ ] `https://www.aftech.co.id/` terbuka (HTTP 200)
- [ ] Direct access + refresh di route dalam: `/about`, `/services/technology`, `/projects/fews-camera-installation` (jika 404 → `.htaccess` tidak aktif)
- [ ] Aset gambar project/partner tampil (tidak broken)
- [ ] Submit form Contact → respons sukses + email diterima (lihat §7)
- [ ] HTTPS aktif; non-www → www konsisten
- [ ] Canonical di view-source menunjuk `https://www.aftech.co.id/...`

---

## 5. Rollback

Tidak ada migrasi database — rollback = re-upload `dist/` dari build sebelumnya (Git tag/commit yang terakhir stabil).

```bash
git stash list / git log --oneline -5   # temukan commit stabil
npm run build                            # dari commit tersebut
# upload ulang isi dist/ ke public_html/
```

---

## 6. Detail `.htaccess` (jangan diubah tanpa alasan)

```apache
RewriteEngine On
RewriteBase /
RewriteRule ^index\.html$ - [L]
# App lain di public_html dikecualikan dari SPA router:
RewriteCond %{REQUEST_URI} !^/(adminklinik|budget|eptms|erp|klinik|mk|smart)(/|$)
RewriteCond %{REQUEST_URI} !^/api/
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule . /index.html [L]
```

- Menambah app PHP baru di `public_html/<nama>/` → tambahkan `<nama>` ke daftar pengecualian baris 9.
- Jika situs pindah ke subfolder (mis. `/aftech/`), set `base: '/aftech/'` di `vite.config.ts`, ubah `RewriteBase`, rebuild.

---

## 7. Endpoint Kontak (`api/contact.php`) ⚠️

- Validasi server-side + honeypot (`company_website`) + rate-limit 5 req/menit/IP + sanitasi header-injection. Sudah termasuk.
- Pengiriman memakai PHP native `mail()`.
- **PENTING — perlu keputusan owner sebelum deploy:**
  1. `$RECIPIENT_EMAIL` saat ini = `aftech.daya@gmail.com`, sedangkan web menampilkan `support@aftech.co.id`. Samakan dulu.
  2. Email via `mail()` ke Gmail rawan masuk spam (SPF). Setelah deploy: kirim tes → cek inbox + spam. Jika bermasalah, migrasikan ke SMTP terautentikasi (lihat PRD §21).
- Cara tes cepat di prod:

```bash
curl -X POST https://www.aftech.co.id/api/contact.php \
  -H 'Content-Type: application/json' \
  -d '{"fullName":"Deploy Test","email":"test@example.com","projectType":"Technology","message":"Hello, this is a deploy verification test message."}'
# ekspektasi: {"ok":true}
```

---

## 8. Aset Auto-Load (tidak perlu edit kode)

| Folder sumber | Tujuan di web | Cara tambah |
|---|---|---|
| `src/assets/images/partner/*.{png,jpg,svg,webp}` | Slider Clients & Partners (auto-slide) | Taruh file → rebuild → upload |
| `src/assets/images/fews/*.jpg` | Galeri FEWS Adipala | Taruh file + 1 baris di `FEWS_ORDER`/`FEWS_CAPTIONS` (`src/data/projects.ts`) |
| `src/assets/images/meikarta/field/*` | Galeri CCTV Meikarta | Import + entri galeri di `src/data/projects.ts` |

Aturan konten (PRD §39): JANGAN mempublikasikan logo/klien/nama/nilai proyek/penghargaan yang belum terverifikasi atau tanpa izin tertulis. Foto harus dari site project yang benar (Meikarta ≠ Adipala).

---

## 9. Troubleshooting

| Gejala | Penyebab umum | Perbaikan |
|---|---|---|
| Refresh `/about` → 404 | `.htaccess` tidak ter-upload / AllowOverride off | Upload `.htaccess`; pastikan "show hidden files" aktif |
| Halaman putih kosong | `base` salah atau `assets/` tidak ter-upload | Rebuild dengan `base: '/'`, upload ulang `assets/` |
| Form error / email tak masuk | `mail()` diblok / recipient salah / rate-limit | Cek §7; tes via curl; cek spam |
| Gambar project broken | File besar gagal upload via File Manager | Upload ulang file spesifik; cek permission 644 |
| Domain tampil versi lama | Cache browser / CDN | Hard refresh (Ctrl+Shift+R); purge cache Hostinger bila ada |
| Build gagal `tsc` | Type error | Jalankan `npm run typecheck`, perbaiki, JANGAN deploy parsial |

---

## 10. Definisi Selesai (Definition of Done)

Deploy dinyatakan selesai bila SELURUH checklist §4.4 centang + tidak ada error di console browser + tidak ada secret yang terekspos di bundle (`grep -ri "smtp\|password\|secret" dist/assets/*.js` harus kosong).
