# Lunarpedia PaaS Platform - Laravel Version

Platform-as-a-Service (PaaS) yang powerful untuk mengelola container Docker dengan sistem billing terintegrasi dan manajemen pengguna.

## 🚀 Fitur Utama

- **Deploy Docker One-Click** - Deploy layanan populer seperti n8n, Chatwoot, PostgreSQL
- **Sistem Kredit Fleksibel** - Model pricing pay-as-you-use yang fleksibel
- **Autentikasi Aman** - Sistem login/register dengan Laravel Auth
- **Domain Kustom** - Add-on premium untuk dukungan domain kustom
- **Dashboard Real-time** - Monitor layanan dan penggunaan
- **Panel Admin** - Interface manajemen yang komprehensif
- **Refund Otomatis** - Refund pro-rata untuk layanan yang dibatalkan

## 🛠️ Tech Stack

- **Backend**: Laravel 10 + PHP 8.1+
- **Database**: MySQL 8.0+
- **Frontend**: Blade Templates + Tailwind CSS + Alpine.js
- **Icons**: Heroicons (SVG)
- **Build Tool**: Vite

## 📋 Persyaratan Sistem

- PHP 8.1 atau lebih tinggi
- Composer
- MySQL 8.0 atau lebih tinggi
- Node.js 18+ (untuk build assets)
- Git

## 🚀 Instalasi & Setup

### 1. Clone Repository
```bash
git clone <repository-url>
cd lunarpedia-paas-platform
```

### 2. Install Dependencies
```bash
# Install PHP dependencies
composer install

# Install Node.js dependencies
npm install
```

### 3. Environment Configuration
```bash
# Copy environment file
cp .env.example .env

# Generate application key
php artisan key:generate
```

### 4. Database Setup
Edit file `.env` dengan konfigurasi database MySQL Anda:
```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=lunarpedia_paas
DB_USERNAME=root
DB_PASSWORD=your_password

# Admin Configuration
ADMIN_EMAIL=novian@digilunar.com
ADMIN_PASSWORD=novian@digilunar.com
ADMIN_NAME="Novian Admin"
```

### 5. Jalankan Migrasi & Seeder
```bash
# Buat database (jika belum ada)
mysql -u root -p -e "CREATE DATABASE lunarpedia_paas"

# Jalankan migrasi
php artisan migrate

# Jalankan seeder (akan membuat admin user dan service types default)
php artisan db:seed
```

### 6. Build Assets
```bash
# Development
npm run dev

# Production
npm run build
```

### 7. Jalankan Server
```bash
# Development server
php artisan serve

# Akses aplikasi di: http://localhost:8000
```

## 👤 Akun Admin Default

Setelah menjalankan seeder, Anda dapat login sebagai admin dengan:

- **Email**: novian@digilunar.com
- **Password**: novian@digilunar.com

## 📊 Struktur Database

### Tables:
- **users** - Sistem pengguna dengan 250 kredit gratis
- **service_types** - Template layanan Docker yang tersedia
- **services** - Layanan yang di-deploy oleh user
- **credit_transactions** - Tracking penggunaan dan pembelian kredit
- **user_addons** - Premium add-ons untuk layanan

### Default Service Types:
- **n8n** (50 kredit/bulan) - Platform otomasi workflow
- **Chatwoot** (40 kredit/bulan) - Platform customer support
- **PostgreSQL** (30 kredit/bulan) - Database PostgreSQL

## 🎯 Fitur Utama

### Sistem Kredit
- User baru mendapat 250 kredit gratis
- Layanan membutuhkan kredit per bulan
- Refund otomatis pro-rata saat layanan dibatalkan
- Sistem pembelian kredit dengan bonus

### Manajemen Layanan
- Deploy one-click container Docker
- Generate URL otomatis dengan subdomain
- Manajemen environment variables dengan auto-generate secrets
- Monitoring status layanan (running, stopped, pending, error)

### Premium Add-ons
- Dukungan domain kustom (+25 kredit/bulan)
- Sertifikat SSL
- Priority support
- Advanced analytics

### Keamanan
- Laravel Authentication & Authorization
- Policy-based access control
- User isolation - user hanya bisa akses data sendiri
- Admin-only access untuk manajemen service types

## 🔧 Konfigurasi Lanjutan

### Docker Integration
Aplikasi siap untuk integrasi dengan orchestrator Docker. Key integration points:

- **Service Creation**: `DashboardController@createService()` - Siap trigger deployment container
- **Service Management**: Start/stop/restart functionality
- **Environment Variables**: Penyimpanan aman dan injeksi ke container
- **URL Routing**: Generate subdomain otomatis dan dukungan domain kustom

### Payment Integration
Siap untuk integrasi dengan payment gateway:

```env
# Stripe Configuration
STRIPE_KEY=your_stripe_publishable_key
STRIPE_SECRET=your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=your_webhook_secret
```

## 📁 Struktur Project

```
app/
├── Http/Controllers/
│   ├── AuthController.php      # Autentikasi
│   ├── DashboardController.php # Dashboard user
│   ├── AdminController.php     # Panel admin
│   └── HomeController.php      # Landing page
├── Models/
│   ├── User.php               # Model user
│   ├── Service.php            # Model layanan
│   ├── ServiceType.php        # Model template layanan
│   ├── CreditTransaction.php  # Model transaksi kredit
│   └── UserAddon.php          # Model add-ons
└── Policies/
    └── ServicePolicy.php      # Authorization policies

resources/views/
├── layouts/
│   └── app.blade.php          # Layout utama
├── auth/
│   ├── login.blade.php        # Halaman login
│   └── register.blade.php     # Halaman register
├── dashboard/
│   └── index.blade.php        # Dashboard user
└── welcome.blade.php          # Landing page

database/
├── migrations/                # Database migrations
└── seeders/
    └── DatabaseSeeder.php     # Default data seeder
```

## 🚀 Deployment

### Production Setup

1. **Server Requirements**
   - PHP 8.1+ dengan extensions: BCMath, Ctype, Fileinfo, JSON, Mbstring, OpenSSL, PDO, Tokenizer, XML
   - MySQL 8.0+
   - Nginx/Apache
   - Composer
   - Node.js (untuk build assets)

2. **Environment Configuration**
   ```env
   APP_ENV=production
   APP_DEBUG=false
   APP_URL=https://yourdomain.com
   
   # Database production
   DB_HOST=your_production_host
   DB_DATABASE=your_production_db
   DB_USERNAME=your_production_user
   DB_PASSWORD=your_secure_password
   ```

3. **Build & Deploy**
   ```bash
   # Install dependencies
   composer install --optimize-autoloader --no-dev
   
   # Build assets
   npm run build
   
   # Cache configuration
   php artisan config:cache
   php artisan route:cache
   php artisan view:cache
   
   # Run migrations
   php artisan migrate --force
   
   # Seed default data
   php artisan db:seed --force
   ```

## 🤝 Contributing

1. Fork repository
2. Buat feature branch: `git checkout -b feature-name`
3. Commit changes: `git commit -am 'Add feature'`
4. Push ke branch: `git push origin feature-name`
5. Submit pull request

## 📄 License

Project ini dilisensikan di bawah MIT License.

## 📞 Support

Untuk support dan pertanyaan:
- Buat issue di GitHub repository
- Contact: support@lunarpedia.com

---

Dibuat dengan ❤️ menggunakan Laravel, MySQL, dan teknologi web modern.