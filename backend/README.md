# Backend Structure Guide

## Directory Overview

```
backend/
├── config/                    # Configuration files
│   ├── database.js           # Database configuration (planned)
│   └── constants.js          # Global constants (planned)
├── middleware/               # Express middleware
│   ├── auth.js              # JWT authentication & authorization
│   └── rateLimiter.js       # API rate limiting
├── routes/                   # API route handlers
│   ├── admin.js             # Admin authentication & dashboard
│   ├── users.js             # User management endpoints
│   ├── products.js          # Product catalog endpoints
│   ├── orders.js            # Order management endpoints
│   ├── payments.js          # Payment processing endpoints
│   ├── categories.js        # Product categories endpoints
│   ├── coupons.js           # Coupon management endpoints
│   ├── reviews.js           # Product review endpoints
│   ├── shipping.js          # Shipping endpoints
│   ├── roles.js             # Role management endpoints
│   ├── notifications.js     # Notification endpoints
│   ├── analytics.js         # Analytics endpoints
│   ├── reports.js           # Report generation endpoints
│   └── settings.js          # System settings endpoints
├── controllers/              # Route controllers (future expansion)
├── services/                # Business logic layer (future expansion)
├── validators/              # Input validation schemas (future expansion)
├── utils/                   # Utility functions (future expansion)
├── uploads/                 # User uploaded files
│   └── products/            # Product images
├── server.js                # Express server entry point
├── db.js                    # MySQL connection pool & query helpers
└── config.js                # Environment variable configuration

```

## Current Files Explanation

### Core Files

**server.js**
- Main Express application entry point
- Sets up middleware (helmet, CORS, rate limiting, etc.)
- Registers all route modules
- Initializes admin user on startup
- Listens on configured PORT

**config.js**
- Loads environment variables from .env
- Exports configuration constants
- Default values for development

**db.js**
- Creates MySQL connection pool
- Exports `query()` and `findOne()` helper functions
- Handles connection reuse and error handling

### Middleware

**auth.js**
- JWT token generation and verification
- Password hashing with bcryptjs
- Admin user initialization
- Authentication/authorization middleware

**rateLimiter.js**
- Express rate limiter configuration
- Prevents API abuse
- Configured per route group

### Routes

Each route file is an Express Router that handles specific resources:

| Route | Methods | Key Endpoints |
|-------|---------|---------------|
| admin.js | POST, GET | /login, /dashboard |
| users.js | GET, POST, PUT, DELETE | CRUD operations for users |
| products.js | GET, POST, PUT, DELETE | Product management |
| orders.js | GET, POST, PUT | Order processing |
| categories.js | GET, POST, PUT, DELETE | Category management |
| payments.js | GET, POST, PUT | Payment operations |
| coupons.js | GET, POST, PUT, DELETE | Coupon codes |
| reviews.js | GET, POST, PUT | Product reviews |
| shipping.js | GET, POST, PUT | Shipping info |
| roles.js | GET, POST, PUT, DELETE | Role definitions |
| notifications.js | GET, POST | User notifications |
| analytics.js | GET | Analytics data |
| reports.js | GET | Business reports |
| settings.js | GET, POST, PUT | System settings |

## API Endpoint Pattern

All endpoints follow this pattern:
```
/api/{resource}/{method}
```

Example:
```
POST   /api/users          # Create user
GET    /api/users          # List users
GET    /api/users/:id      # Get user
PUT    /api/users/:id      # Update user
DELETE /api/users/:id      # Delete user
```

## Database Helpers

**query(sql, params)**
- Execute any SQL query
- Returns array of rows
- Usage: `await query('SELECT * FROM users WHERE id = ?', [id])`

**findOne(sql, params)**
- Execute query and return first result
- Returns single object or null
- Usage: `await findOne('SELECT * FROM users WHERE email = ?', [email])`

## Middleware Chains

Most routes use this middleware chain:
```
apiRateLimiter → authenticate → requireRoles → route handler
```

## Adding New Routes

1. Create new file in `routes/` directory
2. Import Express and database helpers
3. Create Express Router instance
4. Define route handlers
5. Export router as named export (e.g., `export { router as productsRouter }`)
6. Import and register in `server.js`:
   ```javascript
   import { productsRouter } from "./routes/products.js";
   app.use(`${API_PREFIX}/products`, productsRouter);
   ```

## Future Improvements

The structure includes placeholder directories for:

- **controllers/** - Move route logic to controller classes
- **services/** - Extract business logic into service layer
- **validators/** - Use dedicated validation schemas
- **utils/** - Extract common utility functions

This allows for future refactoring without changing the current working structure.

## Error Handling

- Routes return 400-500 status codes for errors
- Database errors bubble up and are caught in middleware (future)
- JWT errors return 401 Unauthorized
- Rate limit exceeded returns 429

## Security Features

✅ **Implemented**
- JWT authentication on protected routes
- Password hashing with bcryptjs
- API rate limiting
- CORS validation
- Helmet security headers
- SQL injection protection via parameterized queries
- XSS protection via helmet

⚠️ **Recommended for Production**
- Input validation layer (validators/)
- Audit logging
- Request/response logging
- Error monitoring (Sentry, etc.)
- Database connection SSL
- API documentation (Swagger/OpenAPI)
