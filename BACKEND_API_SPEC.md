# Backend API Specification for Admin Panel

## Overview

This document specifies the API endpoints required for the Product Management and User Management admin pages.

## Base URL

```
/api/admin
```

## Authentication

All endpoints require the `Authorization` header:

```
Authorization: Bearer {jwt_token}
```

---

# Product Endpoints

## GET /products

Fetch products with optional filtering, searching, and pagination.

### Query Parameters

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `search` | string | - | Search by product name or code |
| `category` | string | - | Filter by category |
| `status` | string | - | Filter by status: active, inactive, out_of_stock, draft |
| `stockStatus` | string | - | Filter by stock: in_stock, low_stock, out_of_stock |
| `sortBy` | string | - | Sort by: name, price, stock, created |
| `sortOrder` | string | asc | Order: asc or desc |
| `page` | number | 1 | Page number (1-indexed) |
| `limit` | number | 10 | Items per page |

### Request

```bash
GET /api/admin/products?search=apple&category=organic&page=1&limit=10
Authorization: Bearer {token}
```

### Response (200 OK)

```json
{
  "success": true,
  "data": {
    "products": [
      {
        "id": "prod-001",
        "name": "Organic Apple",
        "code": "PROD-001-ABC",
        "category": "organic",
        "description": "Fresh organic apples from farm",
        "price": 5.99,
        "offerPrice": 4.99,
        "stock": 100,
        "weight": 0.2,
        "weightUnit": "kg",
        "status": "active",
        "offerAvailable": true,
        "offerStartDate": "2026-05-31T10:00:00Z",
        "offerEndDate": "2026-06-15T10:00:00Z",
        "image": "https://cdn.example.com/prod-001.jpg",
        "createdAt": "2026-05-30T08:00:00Z",
        "updatedAt": "2026-05-31T09:00:00Z"
      }
    ],
    "total": 150,
    "page": 1,
    "limit": 10
  }
}
```

### Error Response (400 Bad Request)

```json
{
  "success": false,
  "error": "Invalid filter parameters",
  "details": {
    "field": "Invalid value"
  }
}
```

---

## POST /products

Create a new product with image uploads.

### Request

**Content-Type**: `multipart/form-data`

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `name` | string | ✓ | Product name (3-100 chars) |
| `code` | string | ✓ | Product code (3-50 chars) |
| `category` | string | ✓ | Category ID/name |
| `description` | string | ✓ | Product description (10-2000 chars) |
| `price` | number | ✓ | Product price (> 0) |
| `stock` | number | ✓ | Stock quantity (>= 0) |
| `weight` | number | ✓ | Weight value |
| `weightUnit` | string | ✓ | gram, kg, litre, or ml |
| `status` | string | ✓ | active, inactive, out_of_stock, draft |
| `offerAvailable` | boolean | ✓ | Whether offer is active |
| `offerPrice` | number | * | Required if offerAvailable=true |
| `offerStartDate` | string | * | ISO date string, required if offer active |
| `offerEndDate` | string | * | ISO date string, required if offer active |
| `images` | File[] | ✓ | Image files (max 5 files) |
| `thumbnailIndex` | number | - | Index of thumbnail image (0-based) |

### Example Request

```bash
curl -X POST /api/admin/products \
  -H "Authorization: Bearer {token}" \
  -F "name=Organic Apple" \
  -F "code=PROD-001-ABC" \
  -F "category=organic" \
  -F "description=Fresh organic apples" \
  -F "price=5.99" \
  -F "stock=100" \
  -F "weight=0.2" \
  -F "weightUnit=kg" \
  -F "status=active" \
  -F "offerAvailable=true" \
  -F "offerPrice=4.99" \
  -F "offerStartDate=2026-05-31T10:00:00Z" \
  -F "offerEndDate=2026-06-15T10:00:00Z" \
  -F "images=@image1.jpg" \
  -F "images=@image2.jpg" \
  -F "thumbnailIndex=0"
```

### Response (201 Created)

```json
{
  "success": true,
  "data": {
    "id": "prod-001",
    "name": "Organic Apple",
    "code": "PROD-001-ABC",
    "category": "organic",
    "description": "Fresh organic apples",
    "price": 5.99,
    "offerPrice": 4.99,
    "stock": 100,
    "weight": 0.2,
    "weightUnit": "kg",
    "status": "active",
    "offerAvailable": true,
    "offerStartDate": "2026-05-31T10:00:00Z",
    "offerEndDate": "2026-06-15T10:00:00Z",
    "image": "https://cdn.example.com/prod-001.jpg",
    "createdAt": "2026-05-31T10:30:00Z",
    "updatedAt": "2026-05-31T10:30:00Z"
  }
}
```

### Error Response (400/422)

```json
{
  "success": false,
  "error": "Validation failed",
  "details": {
    "price": "Price must be greater than 0",
    "images": "At least one image is required"
  }
}
```

---

## PATCH /products/:id

Update an existing product.

### URL Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `id` | string | Product ID |

### Request

**Content-Type**: `multipart/form-data` (same fields as POST, all optional except id)

### Response (200 OK)

```json
{
  "success": true,
  "data": {
    "id": "prod-001",
    "name": "Updated Product Name",
    "code": "PROD-001-ABC",
    ...
  }
}
```

### Error Response (404 Not Found)

```json
{
  "success": false,
  "error": "Product not found"
}
```

---

## DELETE /products/:id

Delete a product.

### URL Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `id` | string | Product ID |

### Response (200 OK)

```json
{
  "success": true,
  "message": "Product deleted successfully"
}
```

### Error Response (404 Not Found)

```json
{
  "success": false,
  "error": "Product not found"
}
```

---

# User Endpoints

## GET /users

Fetch users with optional filtering and pagination.

### Query Parameters

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `search` | string | - | Search query |
| `searchType` | string | name | Search field: name, email, employee_id |
| `role` | string | - | Filter by role: manager, staff, delivery_agent |
| `status` | string | - | Filter by status: active, inactive, suspended |
| `sortBy` | string | - | Sort by: name, created, email |
| `sortOrder` | string | asc | Order: asc or desc |
| `page` | number | 1 | Page number (1-indexed) |
| `limit` | number | 10 | Items per page |

### Request

```bash
GET /api/admin/users?search=john&role=manager&page=1&limit=10
Authorization: Bearer {token}
```

### Response (200 OK)

```json
{
  "success": true,
  "data": {
    "users": [
      {
        "id": "user-001",
        "fullName": "John Doe",
        "employeeId": "EMP-0001-ABC",
        "phoneNumber": "9876543210",
        "email": "john@example.com",
        "role": "manager",
        "status": "active",
        "profileImage": "https://cdn.example.com/user-001.jpg",
        "createdAt": "2026-05-30T08:00:00Z",
        "updatedAt": "2026-05-31T09:00:00Z"
      }
    ],
    "total": 42,
    "page": 1,
    "limit": 10
  }
}
```

---

## GET /users/stats

Get user statistics by role and status.

### Request

```bash
GET /api/admin/users/stats
Authorization: Bearer {token}
```

### Response (200 OK)

```json
{
  "success": true,
  "data": {
    "totalManagers": 5,
    "totalStaff": 15,
    "totalDeliveryAgents": 25,
    "activeUsers": 42
  }
}
```

---

## POST /users

Create a new user.

### Request

**Content-Type**: `application/json`

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `fullName` | string | ✓ | Full name (2-100 chars) |
| `phoneNumber` | string | ✓ | 10-digit phone number |
| `email` | string | ✓ | Valid email address |
| `password` | string | ✓ | Min 8 chars, uppercase, digit, special char |
| `role` | string | ✓ | manager, staff, or delivery_agent |
| `status` | string | ✓ | active, inactive, or suspended |

### Example Request

```bash
curl -X POST /api/admin/users \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "Jane Smith",
    "phoneNumber": "9876543210",
    "email": "jane@example.com",
    "password": "SecurePass123!",
    "role": "staff",
    "status": "active"
  }'
```

### Response (201 Created)

```json
{
  "success": true,
  "data": {
    "id": "user-002",
    "fullName": "Jane Smith",
    "employeeId": "EMP-0002-XYZ",
    "phoneNumber": "9876543210",
    "email": "jane@example.com",
    "role": "staff",
    "status": "active",
    "profileImage": null,
    "createdAt": "2026-05-31T10:45:00Z",
    "updatedAt": "2026-05-31T10:45:00Z"
  }
}
```

### Error Response (400/422)

```json
{
  "success": false,
  "error": "Validation failed",
  "details": {
    "email": "Email already exists",
    "password": "Password must contain uppercase letter"
  }
}
```

---

## PATCH /users/:id

Update user information.

### URL Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `id` | string | User ID |

### Request

**Content-Type**: `application/json` (all fields optional)

| Field | Type | Description |
|-------|------|-------------|
| `fullName` | string | Updated name |
| `phoneNumber` | string | Updated phone |
| `email` | string | Updated email |
| `password` | string | New password (optional) |
| `role` | string | Updated role |
| `status` | string | Updated status |

### Example Request

```bash
curl -X PATCH /api/admin/users/user-001 \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{
    "status": "inactive"
  }'
```

### Response (200 OK)

```json
{
  "success": true,
  "data": {
    "id": "user-001",
    "fullName": "John Doe",
    "employeeId": "EMP-0001-ABC",
    "phoneNumber": "9876543210",
    "email": "john@example.com",
    "role": "manager",
    "status": "inactive",
    "profileImage": null,
    "createdAt": "2026-05-30T08:00:00Z",
    "updatedAt": "2026-05-31T11:00:00Z"
  }
}
```

---

## DELETE /users/:id

Delete a user.

### URL Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `id` | string | User ID |

### Response (200 OK)

```json
{
  "success": true,
  "message": "User deleted successfully"
}
```

### Error Response (404 Not Found)

```json
{
  "success": false,
  "error": "User not found"
}
```

---

# Error Codes

## Standard HTTP Status Codes

| Status | Meaning | Example |
|--------|---------|---------|
| 200 | OK | Successful GET, PATCH, DELETE |
| 201 | Created | Successful POST |
| 400 | Bad Request | Invalid parameters |
| 401 | Unauthorized | Missing/invalid token |
| 403 | Forbidden | Insufficient permissions |
| 404 | Not Found | Resource doesn't exist |
| 422 | Unprocessable Entity | Validation error |
| 500 | Internal Server Error | Server error |

## Error Response Format

```json
{
  "success": false,
  "error": "Error message",
  "code": "ERROR_CODE",
  "details": {
    "field": "specific error for field"
  }
}
```

---

# Database Schema Requirements

## Products Table

```sql
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL,
  code VARCHAR(50) NOT NULL UNIQUE,
  category VARCHAR(100) NOT NULL,
  description TEXT NOT NULL,
  price DECIMAL(10, 2) NOT NULL CHECK (price > 0),
  offer_price DECIMAL(10, 2),
  stock INTEGER NOT NULL DEFAULT 0 CHECK (stock >= 0),
  weight DECIMAL(8, 2) NOT NULL CHECK (weight > 0),
  weight_unit VARCHAR(10) NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'draft',
  offer_available BOOLEAN DEFAULT false,
  offer_start_date TIMESTAMP,
  offer_end_date TIMESTAMP,
  image_url VARCHAR(500),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  created_by UUID,
  FOREIGN KEY (created_by) REFERENCES users(id)
);

CREATE TABLE product_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  image_url VARCHAR(500) NOT NULL,
  is_thumbnail BOOLEAN DEFAULT false,
  display_order INTEGER,
  created_at TIMESTAMP DEFAULT NOW()
);
```

## Users Table

```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name VARCHAR(100) NOT NULL,
  employee_id VARCHAR(50) NOT NULL UNIQUE,
  phone_number VARCHAR(20) NOT NULL,
  email VARCHAR(100) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  role VARCHAR(20) NOT NULL DEFAULT 'staff',
  status VARCHAR(20) NOT NULL DEFAULT 'active',
  profile_image_url VARCHAR(500),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  created_by UUID,
  FOREIGN KEY (created_by) REFERENCES users(id)
);
```

---

# Implementation Checklist

- [ ] Create database tables (products, product_images, users)
- [ ] Implement GET /products endpoint
- [ ] Implement POST /products endpoint (with image upload)
- [ ] Implement PATCH /products/:id endpoint
- [ ] Implement DELETE /products/:id endpoint
- [ ] Implement GET /users endpoint
- [ ] Implement GET /users/stats endpoint
- [ ] Implement POST /users endpoint
- [ ] Implement PATCH /users/:id endpoint
- [ ] Implement DELETE /users/:id endpoint
- [ ] Add request validation
- [ ] Add authentication middleware
- [ ] Add authorization checks
- [ ] Add error handling
- [ ] Add logging
- [ ] Test all endpoints with Postman/Thunder Client
- [ ] Document API in Swagger/OpenAPI
- [ ] Add rate limiting
- [ ] Add audit logging

---

**Last Updated**: May 31, 2026  
**Version**: 1.0
