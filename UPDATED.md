# Frontend Integration Guide - Proxy Management System

## Overview

Sistem proxy management mendukung **2 tipe proxy**:
1. **OwlProxy** - Quota dalam MB, region detail (city, state, country)
2. **FusionProxy** - Quota dalam GB, country simple list

API secara otomatis mendeteksi tipe proxy berdasarkan UUID dan mengembalikan response yang sesuai.

---

## 1. Authentication

### Login Admin

**Endpoint:** `POST /auth/login`

**Request:**
```json
{
  "email": "admin@example.com",
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
    "nama": "Admin Name",
    "email": "admin@example.com",
    "role": "admin"
  }
}
```

**Frontend Implementation:**
```javascript
async function loginAdmin(email, password) {
  const response = await fetch('http://localhost:3000/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  
  const data = await response.json();
  
  if (response.ok) {
    localStorage.setItem('access_token', data.access_token);
    localStorage.setItem('refresh_token', data.refresh_token);
    localStorage.setItem('user', JSON.stringify(data.user));
    return data;
  } else {
    throw new Error(data.error);
  }
}
```

---

## 2. Create Proxy

### Create OwlProxy

**Endpoint:** `POST /api/proxy`

**Headers:**
```
Authorization: Bearer <access_token>
Content-Type: application/json
```

**Request:**
```json
{
  "accounts": "email@example.com",
  "proxy_type": "owlproxy"
}
```

**Response:**
```json
{
  "data": {
    "id": "5df0f17f-d478-441b-9bec-5cf529806039",
    "accounts": "email@example.com",
    "proxy_type": "owlproxy",
    "user_id": "12345",
    "token": "owl_token_here",
    "created_at": "2026-04-24T23:13:17.000000+00:00"
  },
  "message": "Proxy created successfully"
}
```

### Create FusionProxy

**Endpoint:** `POST /api/proxy`

**Headers:**
```
Authorization: Bearer <access_token>
Content-Type: application/json
```

**Request:**
```json
{
  "accounts": "email@example.com",
  "password": "password123",
  "proxy_type": "fusionproxy"
}
```

**Response:**
```json
{
  "data": {
    "id": "e8d41a0e-ad80-4541-b00b-fba94fdb15f2",
    "accounts": "email@example.com",
    "proxy_type": "fusionproxy",
    "proxy_username": "52ddr33rsg57",
    "proxy_password": "y1od84394x93",
    "token": "fusion_token_here",
    "created_at": "2026-04-24T23:16:35.000000+00:00"
  },
  "message": "Proxy created successfully"
}
```

**Frontend Implementation:**
```javascript
async function createProxy(accessToken, proxyData) {
  const response = await fetch('http://localhost:3000/api/proxy', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(proxyData)
  });
  
  const data = await response.json();
  
  if (response.ok) {
    return data.data; // Return proxy object dengan UUID
  } else {
    throw new Error(data.error);
  }
}

// Usage
const owlProxy = await createProxy(accessToken, {
  accounts: 'email@example.com',
  proxy_type: 'owlproxy'
});

const fusionProxy = await createProxy(accessToken, {
  accounts: 'email@example.com',
  password: 'password123',
  proxy_type: 'fusionproxy'
});
```

---

## 3. Check Proxy Quota

### Unified Quota Check (Auto Detect Type)

**Endpoint:** `POST /api/checkProxy`

**Request:**
```json
{
  "uuid": "5df0f17f-d478-441b-9bec-5cf529806039"
}
```

**Response (OwlProxy - dalam MB):**
```json
{
  "success": true,
  "data": {
    "remainingTraffic": 200,
    "usedTraffic": 0,
    "unit": "MB",
    "proxyType": "owlproxy"
  }
}
```

**Response (FusionProxy - dalam GB):**
```json
{
  "success": true,
  "data": {
    "remainingTraffic": 50.5,
    "usedTraffic": 10.2,
    "unit": "GB",
    "proxyType": "fusionproxy"
  }
}
```

**Frontend Implementation:**
```javascript
async function checkProxyQuota(uuid) {
  const response = await fetch('http://localhost:3000/api/checkProxy', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ uuid })
  });
  
  const data = await response.json();
  
  if (data.success) {
    const quota = data.data;
    
    // Format display berdasarkan unit
    const displayText = `${quota.remainingTraffic} ${quota.unit} remaining`;
    
    return {
      remaining: quota.remainingTraffic,
      used: quota.usedTraffic,
      unit: quota.unit,
      type: quota.proxyType,
      display: displayText
    };
  } else {
    throw new Error(data.error);
  }
}

// Usage
const quota = await checkProxyQuota(proxyUUID);
console.log(`${quota.type}: ${quota.display}`);
```

---

## 4. Get Proxy Regions/Countries

### Unified Get Regions (Auto Detect Type)

**Endpoint:** `POST /api/getProxyRegion`

**Request:**
```json
{
  "uuid": "5df0f17f-d478-441b-9bec-5cf529806039"
}
```

**Response (OwlProxy - Detail Regions):**
```json
{
  "success": true,
  "data": [
    {
      "city": "Los Angeles",
      "state": "California",
      "countryName": "United States",
      "region": "US"
    },
    {
      "city": "Jakarta",
      "state": "Jakarta",
      "countryName": "Indonesia",
      "region": "ID"
    }
  ],
  "proxyType": "owlproxy"
}
```

**Response (FusionProxy - Simple Countries):**
```json
{
  "success": true,
  "data": [
    { "name": "United States" },
    { "name": "United Kingdom" },
    { "name": "Canada" },
    { "name": "Australia" }
  ],
  "proxyType": "fusionproxy"
}
```

**Frontend Implementation:**
```javascript
async function getProxyRegions(uuid) {
  const response = await fetch('http://localhost:3000/api/getProxyRegion', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ uuid })
  });
  
  const data = await response.json();
  
  if (data.success) {
    const proxyType = data.proxyType;
    
    if (proxyType === 'owlproxy') {
      // OwlProxy: detail regions
      return data.data.map(region => ({
        label: `${region.countryName} - ${region.state} - ${region.city}`,
        value: region.region,
        country: region.countryName,
        state: region.state,
        city: region.city
      }));
    } else {
      // FusionProxy: simple countries
      return data.data.map(country => ({
        label: country.name,
        value: country.name
      }));
    }
  } else {
    throw new Error(data.error);
  }
}

// Usage
const regions = await getProxyRegions(proxyUUID);
// Render dropdown/select dengan regions
```

---

## 5. Create Proxy Instance

### Unified Create Proxy (Auto Detect Type)

**Endpoint:** `POST /api/createProxy`

**Request (OwlProxy - dengan country code):**
```json
{
  "uuid": "5df0f17f-d478-441b-9bec-5cf529806039",
  "country": "US"
}
```

**Response (OwlProxy):**
```json
{
  "success": true,
  "data": {
    "proxy": "change5.owlproxy.com:7778:jjhzJVFpUH70_custom_zone_US_st__city_sid_92566238_time_5:2521584",
    "proxyType": "owlproxy"
  }
}
```

**Request (FusionProxy - dengan country name):**
```json
{
  "uuid": "e8d41a0e-ad80-4541-b00b-fba94fdb15f2",
  "country": "United States"
}
```

**Response (FusionProxy):**
```json
{
  "success": true,
  "data": {
    "proxy": "resi.fusionproxy.net:13456:52ddr33rsg57-country-US:y1od84394x93",
    "proxyType": "fusionproxy"
  }
}
```

**Frontend Implementation:**
```javascript
async function createProxyInstance(uuid, country) {
  const response = await fetch('http://localhost:3000/api/createProxy', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ uuid, country })
  });
  
  const data = await response.json();
  
  if (data.success) {
    return {
      proxy: data.data.proxy,
      type: data.data.proxyType,
      // Parse proxy string
      host: data.data.proxy.split(':')[0],
      port: data.data.proxy.split(':')[1],
      username: data.data.proxy.split(':')[2],
      password: data.data.proxy.split(':')[3]
    };
  } else {
    throw new Error(data.error);
  }
}

// Usage
const proxyInstance = await createProxyInstance(proxyUUID, 'US'); // OwlProxy
const proxyInstance = await createProxyInstance(proxyUUID, 'United States'); // FusionProxy

console.log(proxyInstance.proxy); // Full proxy string
console.log(proxyInstance.host); // Host
console.log(proxyInstance.port); // Port
```

---

## 6. List All Proxies

### List Proxies with Pagination

**Endpoint:** `GET /api/proxy`

**Headers:**
```
Authorization: Bearer <access_token>
```

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)
- `search` (optional): Search by email

**Request:**
```
GET /api/proxy?page=1&limit=10&search=example
```

**Response:**
```json
{
  "data": [
    {
      "id": "5df0f17f-d478-441b-9bec-5cf529806039",
      "accounts": "email@example.com",
      "proxy_type": "owlproxy",
      "user_id": "12345",
      "token": "token_here",
      "created_at": "2026-04-24T23:13:17.000000+00:00"
    },
    {
      "id": "e8d41a0e-ad80-4541-b00b-fba94fdb15f2",
      "accounts": "fusion@example.com",
      "proxy_type": "fusionproxy",
      "proxy_username": "52ddr33rsg57",
      "proxy_password": "y1od84394x93",
      "token": "token_here",
      "created_at": "2026-04-24T23:16:35.000000+00:00"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 25,
    "totalPages": 3
  }
}
```

**Frontend Implementation:**
```javascript
async function listProxies(accessToken, page = 1, limit = 10, search = '') {
  const params = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString()
  });
  
  if (search) {
    params.append('search', search);
  }
  
  const response = await fetch(`http://localhost:3000/api/proxy?${params}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${accessToken}`
    }
  });
  
  const data = await response.json();
  
  if (response.ok) {
    return {
      proxies: data.data,
      pagination: data.pagination
    };
  } else {
    throw new Error(data.error);
  }
}

// Usage
const { proxies, pagination } = await listProxies(accessToken, 1, 10);

proxies.forEach(proxy => {
  console.log(`${proxy.accounts} (${proxy.proxy_type})`);
});

console.log(`Page ${pagination.page} of ${pagination.totalPages}`);
```

---

## 7. Complete Frontend Flow Example

```javascript
// 1. Login
const loginData = await loginAdmin('admin@example.com', 'password123');
const accessToken = loginData.access_token;

// 2. Create OwlProxy
const owlProxy = await createProxy(accessToken, {
  accounts: 'owl@example.com',
  proxy_type: 'owlproxy'
});
console.log('OwlProxy UUID:', owlProxy.id);

// 3. Create FusionProxy
const fusionProxy = await createProxy(accessToken, {
  accounts: 'fusion@example.com',
  password: 'password123',
  proxy_type: 'fusionproxy'
});
console.log('FusionProxy UUID:', fusionProxy.id);

// 4. Check quota untuk OwlProxy
const owlQuota = await checkProxyQuota(owlProxy.id);
console.log(`OwlProxy: ${owlQuota.remaining} ${owlQuota.unit} remaining`);

// 5. Check quota untuk FusionProxy
const fusionQuota = await checkProxyQuota(fusionProxy.id);
console.log(`FusionProxy: ${fusionQuota.remaining} ${fusionQuota.unit} remaining`);

// 6. Get regions untuk OwlProxy
const owlRegions = await getProxyRegions(owlProxy.id);
console.log('OwlProxy regions:', owlRegions);

// 7. Get countries untuk FusionProxy
const fusionCountries = await getProxyRegions(fusionProxy.id);
console.log('FusionProxy countries:', fusionCountries);

// 8. Create proxy instance
const owlInstance = await createProxyInstance(owlProxy.id, 'US');
console.log('OwlProxy string:', owlInstance.proxy);

const fusionInstance = await createProxyInstance(fusionProxy.id, 'United States');
console.log('FusionProxy string:', fusionInstance.proxy);

// 9. List all proxies
const { proxies, pagination } = await listProxies(accessToken);
console.log(`Total proxies: ${pagination.total}`);
```

---

## 8. Error Handling

### Common Errors

**401 Unauthorized**
```json
{
  "error": "Invalid or expired token"
}
```
→ Refresh token atau login ulang

**400 Bad Request**
```json
{
  "error": "Email is required"
}
```
→ Validasi input sebelum send

**404 Not Found**
```json
{
  "success": false,
  "error": "Invalid UUID"
}
```
→ UUID tidak ditemukan

**500 Internal Server Error**
```json
{
  "error": "Failed to create proxy"
}
```
→ Error di server, cek logs

### Frontend Error Handler

```javascript
async function apiCall(url, options = {}) {
  try {
    const response = await fetch(url, options);
    const data = await response.json();
    
    if (!response.ok) {
      if (response.status === 401) {
        // Token expired, refresh atau redirect to login
        localStorage.removeItem('access_token');
        window.location.href = '/login';
      }
      throw new Error(data.error || 'Unknown error');
    }
    
    return data;
  } catch (error) {
    console.error('API Error:', error.message);
    throw error;
  }
}
```

---

## 9. Key Differences: OwlProxy vs FusionProxy

| Feature | OwlProxy | FusionProxy |
|---------|----------|-------------|
| **Quota Unit** | MB | GB |
| **Login** | Email only | Email + Password |
| **Country Format** | Code (US, ID, etc) | Full name (United States, Indonesia) |
| **Regions** | Detail (city, state, country) | Simple (country name only) |
| **Proxy Format** | `change5.owlproxy.com:7778:user:pass` | `resi.fusionproxy.net:PORT:user-country-CODE:pass` |
| **Database Fields** | `user_id`, `token` | `proxy_username`, `proxy_password`, `token` |

---

## 10. Rate Limits

- **Login:** 5 requests / minute
- **Check Proxy:** 10 requests / minute
- **Create Proxy:** 5 requests / minute
- **Get Regions:** 10 requests / minute
- **Global:** 10 requests / 10 seconds

---

## 11. Testing

Gunakan script Python untuk testing:

```bash
python test_proxy_integration.py
```

Script akan test semua endpoints dan menampilkan hasil.

---

## Summary

✅ **Unified API** - Satu endpoint untuk 2 tipe proxy
✅ **Auto Detection** - Sistem otomatis detect tipe proxy dari UUID
✅ **Flexible Response** - Response format sesuai tipe proxy
✅ **Pagination** - Support pagination untuk list proxies
✅ **Error Handling** - Clear error messages untuk debugging

Selamat mengintegrasikan ke frontend! 🚀
