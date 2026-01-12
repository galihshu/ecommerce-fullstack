# Setup E-Commerce Backend dengan Laragon

## 🚀 Langkah 1: Install & Start Laragon

1. **Download Laragon**: https://laragon.org/download/
2. **Install Laragon** (Full version dengan PostgreSQL & Redis)
3. **Start Laragon**:
   - Buka Laragon
   - Klik "Start All"
   - Pastikan PostgreSQL dan Redis status hijau

## 🗄️ Langkah 2: Setup Database

1. **Buka pgAdmin**:
   - Klik "Admin" → "pgAdmin" di Laragon
   - Browser akan otomatis buka ke pgAdmin

2. **Create Database**:
   - Login dengan: `laragon` (password kosong)
   - Klik "Create Database"
   - Database name: `db_ecommerce`
   - Klik "Save"

## 🔧 Langkah 3: Update Environment

Environment sudah di-update di `.env`:
- Database user: `laragon`
- Database password: (kosong)
- Database name: `db_ecommerce`

## 🚀 Langkah 4: Start Backend

```bash
cd d:\web-apps\ecommerce-fullstack\backend
start-laragon.bat
```

## 🔍 Langkah 5: Test Connection

### Test Database Connection:
```sql
-- Buka pgAdmin dan test query
SELECT version();
```

### Test API:
```bash
# Test health
curl http://localhost:8080/health

# Test products
curl http://localhost:8080/api/v1/products
```

## 🌐 Langkah 6: Start Frontend

```bash
cd d:\web-apps\ecommerce-fullstack\frontend
npm run dev
```

## 📱 Access Application

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:8080
- **Database Admin**: http://localhost:8080/pgadmin/
- **Laragon Admin**: http://localhost/admin

## 🔧 Laragon Configuration

### PostgreSQL Settings di Laragon:
- **Host**: localhost
- **Port**: 5432
- **User**: laragon
- **Password**: (kosong)
- **Database**: db_ecommerce

### Redis Settings di Laragon:
- **Host**: localhost
- **Port**: 6379
- **Password**: (kosong)

## 🎯 Default Login Credentials

### Admin User:
- **Email**: admin@ecommerce.com
- **Password**: admin123

### Database:
- **Username**: laragon
- **Password**: (kosong)

## 🚨 Troubleshooting

### Jika database connection error:
1. Pastikan Laragon running
2. Check PostgreSQL service di Laragon
3. Verify database `db_ecommerce` exists
4. Test connection di pgAdmin

### Jika port conflict:
1. Stop other services di port 8080
2. Atau ubah port di .env: `PORT=8081`

### Jika CORS error:
1. Pastikan frontend URL ada di CORS_ORIGINS
2. Restart backend server

## ✅ Success Indicators

Backend berhasil jika:
- [x] Laragon running (PostgreSQL + Redis)
- [x] Database `db_ecommerce` created
- [x] Server output: "Database connected successfully"
- [x] Server output: "Database migration completed"
- [x] Server running di port 8080
- [x] Health endpoint accessible: http://localhost:8080/health
