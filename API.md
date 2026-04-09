# API Documentation

Base URL: `http://localhost:3000`

## Authentication Endpoints

### POST /auth/login
Login dengan email dan password.

**Request:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "access_token": "eyJhbGc...",
  "refresh_token": "zun7ajf...",
  "user": {
    "id": "uuid",
    "nama": "John Doe",
    "email": "user@example.com",
    "role": "admin"
  }
}
```

**Rate Limit:** 5 requests / menit

---

### POST /auth/refresh
Refresh access token.

**Request:**
```json
{
  "refresh_token": "zun7ajf..."
}
```

**Response:**
```json
{
  "access_token": "eyJhbGc...",
  "refresh_token": "zun7ajf..."
}
```

**Rate Limit:** 10 requests / menit

---

### POST /auth/logout
Logout dan invalidate token.

**Headers:**
```
Authorization: Bearer <access_token>
```

**Response:**
```json
{
  "message": "Logout successful"
}
```

**Rate Limit:** 10 requests / menit

---

## Protected Endpoints

Semua endpoint di bawah memerlukan header:
```
Authorization: Bearer <access_token>
```

### GET /api/profile
Mendapatkan profile user yang sedang login.

**Response:**
```json
{
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "aud": "authenticated",
    "role": "authenticated"
  }
}
```

---

### GET /api/user
Endpoint untuk user dan admin.

**Response:**
```json
{
  "message": "User area"
}
```

---

### GET /api/admin
Endpoint khusus admin.

**Response:**
```json
{
  "message": "Admin only area"
}
```

---

## Proxy Management (Admin Only)

### GET /api/proxy
List semua proxy.

**Headers:**
```
Authorization: Bearer <admin_access_token>
```

**Response:**
```json
{
  "data": [
    {
      "id": "ffdafc84-863c-460f-a339-534d46d14238",
      "accounts": "user@example.com",
      "user_id": "12345",
      "token": "owl_token_here",
      "created_at": "2026-04-02T11:45:28.808631+00:00",
      "updated_at": "2026-04-02T11:45:28.808631+00:00"
    }
  ]
}
```

---

### GET /api/proxy/:id
Detail proxy by ID.

**Headers:**
```
Authorization: Bearer <admin_access_token>
```

**Response:**
```json
{
  "data": {
    "id": "ffdafc84-863c-460f-a339-534d46d14238",
    "accounts": "user@example.com",
    "user_id": "12345",
    "token": "owl_token_here",
    "created_at": "2026-04-02T11:45:28.808631+00:00",
    "updated_at": "2026-04-02T11:45:28.808631+00:00"
  }
}
```

---

### POST /api/proxy
Tambah proxy baru.

**Headers:**
```
Authorization: Bearer <admin_access_token>
```

**Request:**
```json
{
  "accounts": "user@example.com"
}
```

**Response:**
```json
{
  "data": {
    "id": "ffdafc84-863c-460f-a339-534d46d14238",
    "accounts": "user@example.com",
    "created_at": "2026-04-02T11:45:28.808631+00:00"
  },
  "message": "Proxy created successfully"
}
```

---

### PUT /api/proxy/:id
Edit proxy.

**Headers:**
```
Authorization: Bearer <admin_access_token>
```

**Request:**
```json
{
  "accounts": "newemail@example.com"
}
```

**Response:**
```json
{
  "data": {
    "id": "ffdafc84-863c-460f-a339-534d46d14238",
    "accounts": "newemail@example.com",
    "updated_at": "2026-04-02T12:00:00.000000+00:00"
  },
  "message": "Proxy updated successfully"
}
```

---

### DELETE /api/proxy/:id
Hapus proxy.

**Headers:**
```
Authorization: Bearer <admin_access_token>
```

**Response:**
```json
{
  "message": "Proxy deleted successfully"
}
```

---

## Owl Proxy API (Public - No Auth Required)

### POST /api/checkProxy
Cek kuota proxy berdasarkan UUID.

**Request:**
```json
{
  "uuid": "ffdafc84-863c-460f-a339-534d46d14238"
}
```

**Response (Success):**
```json
{
  "success": true,
  "data": {
    "remainingTraffic": 1000,
    "usedTraffic": 500
  }
}
```

**Response (Error - Invalid UUID):**
```json
{
  "success": false,
  "error": "Invalid UUID"
}
```

**Response (Error - Token Expired):**
```json
{
  "success": false,
  "error": "Token expired or invalid"
}
```

**Rate Limit:** 10 requests / menit

**Flow Internal:**
1. Validasi UUID di database
2. Ambil token dari database (jika ada)
3. Request ke Owl Proxy API untuk cek kuota
4. Jika token expired → auto login ulang → update token di database → cek kuota lagi
5. Return response

---

### POST /api/createProxy
Create proxy dengan country code.

**Request (tanpa country - list countries):**
```json
{
  "uuid": "ffdafc84-863c-460f-a339-534d46d14238"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Please provide country code",
  "countries": [
    {
      "region": "US",
      "countryName": "United States"
    },
    {
      "region": "GB",
      "countryName": "United Kingdom"
    },
    {
      "region": "ID",
      "countryName": "Indonesia"
    }
  ]
}
```

---

**Request (dengan country - create proxy):**
```json
{
  "uuid": "ffdafc84-863c-460f-a339-534d46d14238",
  "country": "US"
}
```

**Response (Success):**
```json
{
  "success": true,
  "data": {
    "proxy": "change5.owlproxy.com:7778:username:password"
  }
}
```

**Format Proxy:** `host:port:username:password`

**Response (Error - Invalid UUID):**
```json
{
  "success": false,
  "error": "Invalid UUID"
}
```

**Response (Error - Failed to Create):**
```json
{
  "success": false,
  "error": "Failed to create proxy"
}
```

**Rate Limit:** 5 requests / menit

**Flow Internal:**
1. Validasi UUID di database
2. Ambil token dari database (jika ada)
3. Request ke Owl Proxy API untuk validasi token
4. Jika token expired → auto login ulang → update token di database
5. Jika country tidak diberikan → return list countries
6. Jika country diberikan → create proxy → return proxy string

---

## Error Responses

### 400 Bad Request
```json
{
  "error": "Email and password are required"
}
```

### 401 Unauthorized
```json
{
  "error": "Invalid or expired token"
}
```

### 403 Forbidden
```json
{
  "error": "Forbidden: insufficient permissions"
}
```

### 404 Not Found
```json
{
  "error": "User not found"
}
```

### 429 Too Many Requests
```json
{
  "error": "Too many requests"
}
```

atau

```json
{
  "error": "IP blocked due to abuse"
}
```

### 500 Internal Server Error
```json
{
  "error": "Failed to create proxy"
}
```

---

## Rate Limiting

- Global: 10 requests / 10 detik
- Login: 5 requests / menit
- Refresh token: 10 requests / menit
- Logout: 10 requests / menit
- Check proxy: 10 requests / menit
- Create proxy: 5 requests / menit

---

## Security Features

### Anti Abuse
- Maksimal 3x login gagal
- IP akan diblokir selama 30 menit setelah 3x gagal login
- IP detection: `cf-connecting-ip` > `x-real-ip` > `x-forwarded-for`

### JWT Auto Refresh
- Access token otomatis di-refresh saat expired
- Session tetap aktif selama refresh token valid

### Role-Based Access Control
- Admin: full access
- User: limited access
- Public: hanya akses Owl Proxy API

---

## Database Schema

### Table: users
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  nama VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  role VARCHAR(20) NOT NULL CHECK (role IN ('admin', 'user')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Table: proxy
```sql
CREATE TABLE proxy (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  accounts TEXT NOT NULL,
  user_id TEXT,
  token TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

---

## Example Usage

### 1. Admin Login
```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"password123"}'
```

### 2. Create Proxy (Admin)
```bash
curl -X POST http://localhost:3000/api/proxy \
  -H "Authorization: Bearer <admin_token>" \
  -H "Content-Type: application/json" \
  -d '{"accounts":"user@example.com"}'
```

### 3. Check Proxy Quota (Public)
```bash
curl -X POST http://localhost:3000/api/checkProxy \
  -H "Content-Type: application/json" \
  -d '{"uuid":"ffdafc84-863c-460f-a339-534d46d14238"}'
```

### 4. Create Owl Proxy (Public)
```bash
curl -X POST http://localhost:3000/api/createProxy \
  -H "Content-Type: application/json" \
  -d '{"uuid":"ffdafc84-863c-460f-a339-534d46d14238","country":"US"}'
```
