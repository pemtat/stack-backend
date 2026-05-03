# API Documentation

Base URL: `http://localhost:3000`

ทุก response จะถูก wrap ด้วย format นี้เสมอ:
```json
{
  "status": "success",
  "data": { ... }
}
```

---

## Authentication

API ส่วนใหญ่ต้องแนบ JWT token ใน header:
```
Authorization: Bearer <access_token>
```

---

## Auth

### POST `/auth/register` — สมัครสมาชิก

**ไม่ต้องใช้ token**

**Request Body:**
```json
{
  "username": "john_doe",
  "password": "secret123",
  "fullName": "John Doe"
}
```

| Field | Type | Required | หมายเหตุ |
|-------|------|----------|----------|
| username | string | ✅ | ต้องไม่ซ้ำ |
| password | string | ✅ | ขั้นต่ำ 6 ตัวอักษร |
| fullName | string | ✅ | |

**Response (201):**
```json
{
  "status": "success",
  "data": {
    "id": "uuid-string",
    "username": "john_doe",
    "fullName": "John Doe",
    "phoneNumber": null,
    "profileImage": null,
    "role": "ADMIN",
    "isActive": true,
    "createdAt": "2026-04-29T10:00:00.000Z",
    "updatedAt": "2026-04-29T10:00:00.000Z"
  }
}
```

**Error (400):** ถ้า username ซ้ำ

---

### POST `/auth/login` — เข้าสู่ระบบ

**ไม่ต้องใช้ token**

**Request Body:**
```json
{
  "username": "john_doe",
  "password": "secret123"
}
```

**Response (200):**
```json
{
  "status": "success",
  "data": {
    "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "uuid-string",
      "username": "john_doe",
      "fullName": "John Doe",
      "phoneNumber": null,
      "profileImage": null,
      "role": "ADMIN",
      "isActive": true,
      "createdAt": "2026-04-29T10:00:00.000Z",
      "updatedAt": "2026-04-29T10:00:00.000Z"
    }
  }
}
```

> `access_token` หมดอายุใน **15 นาที**  
> `refresh_token` หมดอายุใน **7 วัน**

**Error (401):** username หรือ password ผิด

---

### POST `/auth/refresh` — ขอ access token ใหม่

**ไม่ต้องใช้ token**

**Request Body:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response (200):**
```json
{
  "status": "success",
  "data": {
    "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Error (401):** refresh token หมดอายุหรือไม่ถูกต้อง

---

### GET `/auth/me` — ดูข้อมูลตัวเอง

**ต้องใช้ token**

**Response (200):**
```json
{
  "status": "success",
  "data": {
    "id": "uuid-string",
    "username": "john_doe",
    "fullName": "John Doe",
    "phoneNumber": null,
    "profileImage": null,
    "role": "ADMIN",
    "isActive": true,
    "createdAt": "2026-04-29T10:00:00.000Z",
    "updatedAt": "2026-04-29T10:00:00.000Z"
  }
}
```

---

## Users

**ทุก endpoint ใน `/users` ต้องใช้ token**

---

### PATCH `/users/profile` — แก้ไขโปรไฟล์

**Request Body:** (ส่งเฉพาะ field ที่ต้องการแก้ไข)
```json
{
  "fullName": "New Name",
  "phoneNumber": "0812345678",
  "profileImage": "https://example.com/avatar.jpg"
}
```

| Field | Type | Required | หมายเหตุ |
|-------|------|----------|----------|
| fullName | string | ❌ | ชื่อ-นามสกุล |
| phoneNumber | string | ❌ | เบอร์โทรศัพท์ |
| profileImage | string (URL) | ❌ | URL รูปโปรไฟล์ (ต้องเป็น URL ที่ถูกต้อง) |

**Response (200):**
```json
{
  "status": "success",
  "data": {
    "id": "uuid-string",
    "username": "john_doe",
    "fullName": "New Name",
    "phoneNumber": "0812345678",
    "profileImage": "https://example.com/avatar.jpg",
    "role": "ADMIN",
    "isActive": true,
    "createdAt": "2026-04-29T10:00:00.000Z",
    "updatedAt": "2026-05-03T10:00:00.000Z"
  }
}
```

---

### PATCH `/users/change-password` — เปลี่ยนรหัสผ่าน

**Request Body:**
```json
{
  "oldPassword": "secret123",
  "newPassword": "newSecret456"
}
```

| Field | Type | Required | หมายเหตุ |
|-------|------|----------|----------|
| oldPassword | string | ✅ | รหัสผ่านปัจจุบัน |
| newPassword | string | ✅ | รหัสผ่านใหม่ (ขั้นต่ำ 6 ตัวอักษร) |

**Response (200):**
```json
{
  "status": "success",
  "data": {
    "message": "Password updated successfully"
  }
}
```

**Error (400):** รหัสผ่านเดิมไม่ถูกต้อง

---

### POST `/users/device` — ลงทะเบียน/อัปเดตอุปกรณ์

เรียกตอนแอปเปิดหรือหลัง login เพื่อบันทึกข้อมูลอุปกรณ์ ถ้า user+platform เคยมีแล้วจะอัปเดตข้อมูลเดิม (upsert)

**Request Body:**
```json
{
  "platform": "android",
  "appVersion": "2.1.0",
  "buildNumber": 15,
  "deviceModel": "Samsung Galaxy S24",
  "pushToken": "fcm-token-string"
}
```

| Field | Type | Required | หมายเหตุ |
|-------|------|----------|----------|
| platform | string | ✅ | `ios` หรือ `android` |
| appVersion | string | ❌ | เลขเวอร์ชั่นแอป |
| buildNumber | number | ❌ | หมายเลข build |
| deviceModel | string | ❌ | รุ่นอุปกรณ์ |
| pushToken | string | ❌ | FCM/APNs token สำหรับ push notification |

**Response (200):**
```json
{
  "status": "success",
  "data": {
    "id": 1,
    "userId": "uuid-string",
    "platform": "android",
    "appVersion": "2.1.0",
    "buildNumber": 15,
    "deviceModel": "Samsung Galaxy S24",
    "pushToken": "fcm-token-string",
    "lastActiveAt": "2026-05-03T10:00:00.000Z",
    "createdAt": "2026-05-03T10:00:00.000Z",
    "updatedAt": "2026-05-03T10:00:00.000Z"
  }
}
```

---

### GET `/users/devices` — ดูอุปกรณ์ทั้งหมดของตัวเอง

**Response (200):**
```json
{
  "status": "success",
  "data": [
    {
      "id": 1,
      "userId": "uuid-string",
      "platform": "android",
      "appVersion": "2.1.0",
      "buildNumber": 15,
      "deviceModel": "Samsung Galaxy S24",
      "pushToken": "fcm-token-string",
      "lastActiveAt": "2026-05-03T10:00:00.000Z",
      "createdAt": "2026-05-03T10:00:00.000Z",
      "updatedAt": "2026-05-03T10:00:00.000Z"
    }
  ]
}
```

---

## Products

**ทุก endpoint ใน `/products` ต้องใช้ token**

---

### GET `/products` — ดูรายการสินค้าทั้งหมด

**Query Parameters:**

| Param | Type | Default | หมายเหตุ |
|-------|------|---------|----------|
| page | number | 1 | หน้าที่ต้องการ |
| limit | number | 20 | จำนวนต่อหน้า (สูงสุด 100) |
| search | string | "" | ค้นหาจากชื่อหรือรหัสสินค้า |

**ตัวอย่าง URL:**
```
GET /products
GET /products?page=2&limit=10
GET /products?search=laptop
GET /products?page=1&limit=20&search=โทรศัพท์
```

**Response (200):**
```json
{
  "status": "success",
  "data": {
    "products": [
      {
        "id": 1,
        "productCode": "PRD-001",
        "name": "iPhone 15",
        "price": 35000,
        "stock": 50,
        "unit": "เครื่อง",
        "imageUrl": "https://example.com/image.jpg",
        "categoryId": 2,
        "createdAt": "2026-04-29T10:00:00.000Z"
      }
    ],
    "meta": {
      "totalItems": 100,
      "itemCount": 20,
      "itemsPerPage": 20,
      "currentPage": 1,
      "lastPage": 5,
      "hasNextPage": true,
      "hasPreviousPage": false
    }
  }
}
```

---

### GET `/products/:id` — ดูสินค้าชิ้นเดียว

**Path Parameter:** `id` — รหัสสินค้า (integer)

**ตัวอย่าง URL:**
```
GET /products/5
```

**Response (200):**
```json
{
  "status": "success",
  "data": {
    "id": 5,
    "productCode": "PRD-005",
    "name": "iPhone 15",
    "price": 35000,
    "stock": 50,
    "unit": "เครื่อง",
    "imageUrl": "https://example.com/image.jpg",
    "categoryId": 2,
    "createdAt": "2026-04-29T10:00:00.000Z"
  }
}
```

**Error (404):** ไม่พบสินค้า

---

### POST `/products` — เพิ่มสินค้าใหม่

**Request Body:**
```json
{
  "productCode": "PRD-999",
  "name": "MacBook Pro",
  "price": 75000,
  "stock": 10,
  "unit": "เครื่อง",
  "imageUrl": "https://example.com/image.jpg",
  "categoryId": 1
}
```

| Field | Type | Required | หมายเหตุ |
|-------|------|----------|----------|
| productCode | string | ✅ | รหัสสินค้า |
| name | string | ✅ | ชื่อสินค้า |
| price | number | ✅ | ราคา (ต้องมากกว่า 0) |
| stock | number | ✅ | จำนวนสต็อก (ขั้นต่ำ 0, ต้องเป็น integer) |
| unit | string | ✅ | หน่วย เช่น "ชิ้น", "เครื่อง" |
| imageUrl | string | ❌ | URL รูปภาพ |
| categoryId | number | ❌ | ID ของหมวดหมู่ |

**Response (201):**
```json
{
  "status": "success",
  "data": {
    "id": 10,
    "productCode": "PRD-999",
    "name": "MacBook Pro",
    "price": 75000,
    "stock": 10,
    "unit": "เครื่อง",
    "imageUrl": "https://example.com/image.jpg",
    "categoryId": 1,
    "createdAt": "2026-04-29T10:00:00.000Z"
  }
}
```

---

### PUT `/products/:id` — แก้ไขสินค้า

**Path Parameter:** `id` — รหัสสินค้า (integer)

**Request Body:** (ส่งเฉพาะ field ที่ต้องการแก้ไข)
```json
{
  "name": "MacBook Pro M3",
  "price": 80000,
  "stock": 5
}
```

| Field | Type | Required | หมายเหตุ |
|-------|------|----------|----------|
| productCode | string | ❌ | |
| name | string | ❌ | |
| price | number | ❌ | ต้องมากกว่า 0 |
| stock | number | ❌ | ขั้นต่ำ 0, ต้องเป็น integer |
| unit | string | ❌ | |
| imageUrl | string | ❌ | |
| categoryId | number | ❌ | |

**Response (200):**
```json
{
  "status": "success",
  "data": {
    "id": 10,
    "productCode": "PRD-999",
    "name": "MacBook Pro M3",
    "price": 80000,
    "stock": 5,
    "unit": "เครื่อง",
    "imageUrl": "https://example.com/image.jpg",
    "categoryId": 1,
    "createdAt": "2026-04-29T10:00:00.000Z"
  }
}
```

**Error (404):** ไม่พบสินค้า

---

### DELETE `/products/:id` — ลบสินค้า

**Path Parameter:** `id` — รหัสสินค้า (integer)

**ตัวอย่าง URL:**
```
DELETE /products/10
```

**Response (200):** คืน object ของสินค้าที่ถูกลบ
```json
{
  "status": "success",
  "data": {
    "id": 10,
    "productCode": "PRD-999",
    "name": "MacBook Pro M3",
    "price": 80000,
    "stock": 5,
    "unit": "เครื่อง",
    "imageUrl": null,
    "categoryId": null,
    "createdAt": "2026-04-29T10:00:00.000Z"
  }
}
```

**Error (404):** ไม่พบสินค้า

---

## App Version

---

### GET `/app-version/check` — ตรวจสอบเวอร์ชั่นแอป

**ไม่ต้องใช้ token**

**Query Parameters:**

| Param | Type | Required | หมายเหตุ |
|-------|------|----------|----------|
| platform | string | ✅ | `ios` หรือ `android` |
| buildNumber | number | ✅ | build number ของแอปที่ใช้อยู่ |

**ตัวอย่าง URL:**
```
GET /app-version/check?platform=android&buildNumber=10
```

**Response (200):**
```json
{
  "status": "success",
  "data": {
    "updateAvailable": true,
    "forceUpdate": false,
    "latestVersion": "2.1.0",
    "latestBuildNumber": 15,
    "releaseNotes": "Bug fixes and performance improvements",
    "storeUrl": "https://play.google.com/store/apps/details?id=your.package.name"
  }
}
```

**Error (404):** ไม่พบ platform ที่ระบุ

---

### GET `/app-version/latest` — ดูเวอร์ชั่นล่าสุด

**ไม่ต้องใช้ token**

**Query Parameters:**

| Param | Type | Required | หมายเหตุ |
|-------|------|----------|----------|
| platform | string | ✅ | `ios` หรือ `android` |

**ตัวอย่าง URL:**
```
GET /app-version/latest?platform=ios
```

**Response (200):**
```json
{
  "status": "success",
  "data": {
    "id": 1,
    "platform": "ios",
    "version": "2.1.0",
    "buildNumber": 15,
    "forceUpdate": false,
    "releaseNotes": "Bug fixes and performance improvements",
    "storeUrl": "https://apps.apple.com/app/your-app-id",
    "createdAt": "2026-05-03T10:00:00.000Z",
    "updatedAt": "2026-05-03T10:00:00.000Z"
  }
}
```

**Error (404):** ไม่พบ platform ที่ระบุ

---

### POST `/app-version` — ตั้งค่าเวอร์ชั่นแอป (Admin)

**ต้องใช้ token**

**Request Body:**
```json
{
  "platform": "android",
  "version": "2.1.0",
  "buildNumber": 15,
  "forceUpdate": false,
  "releaseNotes": "Bug fixes and performance improvements"
}
```

| Field | Type | Required | หมายเหตุ |
|-------|------|----------|----------|
| platform | string | ✅ | `ios` หรือ `android` |
| version | string | ✅ | เลขเวอร์ชั่น เช่น `2.1.0` |
| buildNumber | number | ✅ | หมายเลข build |
| forceUpdate | boolean | ❌ | บังคับอัปเดตหรือไม่ (default: false) |
| releaseNotes | string | ❌ | รายละเอียดการอัปเดต |

**Response (200):** คืน object ของเวอร์ชั่นที่ถูกสร้าง/อัปเดต

> ⚠️ ถ้า `platform` มีอยู่แล้วจะอัปเดตข้อมูลเดิม (upsert)

> 💡 `storeUrl` ไม่ได้เก็บใน DB แต่อ่านจาก Environment Variables (`APP_STORE_URL`, `PLAY_STORE_URL`)

---

## Error Responses

รูปแบบ error ทั่วไป:
```json
{
  "message": "อธิบายสาเหตุ",
  "error": "Bad Request",
  "statusCode": 400
}
```

| Status Code | ความหมาย |
|-------------|----------|
| 400 | ข้อมูลไม่ถูกต้อง (validation fail) |
| 401 | ไม่ได้ login หรือ token หมดอายุ |
| 404 | ไม่พบข้อมูลที่ค้นหา |
| 500 | Server error |

---

## Quick Reference

| Method | Path | Auth | คำอธิบาย |
|--------|------|:----:|----------|
| POST | `/auth/register` | ❌ | สมัครสมาชิก |
| POST | `/auth/login` | ❌ | เข้าสู่ระบบ |
| POST | `/auth/refresh` | ❌ | ขอ token ใหม่ |
| GET | `/auth/me` | ✅ | ดูข้อมูลตัวเอง |
| PATCH | `/users/profile` | ✅ | แก้ไขโปรไฟล์ |
| PATCH | `/users/change-password` | ✅ | เปลี่ยนรหัสผ่าน |
| POST | `/users/device` | ✅ | ลงทะเบียนอุปกรณ์ |
| GET | `/users/devices` | ✅ | ดูอุปกรณ์ทั้งหมด |
| GET | `/products` | ✅ | รายการสินค้า (+ pagination + search) |
| GET | `/products/:id` | ✅ | ดูสินค้าชิ้นเดียว |
| POST | `/products` | ✅ | เพิ่มสินค้า |
| PUT | `/products/:id` | ✅ | แก้ไขสินค้า |
| DELETE | `/products/:id` | ✅ | ลบสินค้า |
| GET | `/app-version/check` | ❌ | ตรวจสอบเวอร์ชั่นแอป |
| GET | `/app-version/latest` | ❌ | ดูเวอร์ชั่นล่าสุด |
| POST | `/app-version` | ✅ | ตั้งค่าเวอร์ชั่นแอป |
