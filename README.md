# Bespoke Page Bloom - Project Structure & Setup Guide

## Project Overview
This is a full-stack e-commerce application with admin panel built with:
- **Frontend**: React 19 + TanStack Router + TanStack Start
- **Backend**: Express.js + Node.js
- **Database**: MySQL
- **Styling**: Tailwind CSS + shadcn/ui

## Directory Structure

```
bespoke-page-bloom-main/
├── frontend/                          # Frontend application (TanStack Start)
│   ├── src/                           # React source code
│   │   ├── components/                # Reusable React components
│   │   │   ├── admin/                 # Admin panel components
│   │   │   ├── site/                  # Public site components
│   │   │   └── ui/                    # UI component library
│   │   ├── routes/                    # TanStack Router routes
│   │   ├── lib/                       # Utilities, APIs, helpers
│   │   ├── store/                     # Redux state management
│   │   ├── hooks/                     # Custom React hooks
│   │   ├── assets/                    # Static assets (images, fonts)
│   │   ├── styles.css                 # Global styles
│   │   ├── router.tsx                 # Router configuration
│   │   ├── server.ts                  # Server-side rendering
│   │   └── start.ts                   # Application entry point
│   ├── package.json                   # Frontend dependencies
│   └── vite.config.ts                 # Vite bundler configuration
│
├── backend/                           # Express.js backend API
│   ├── routes/                        # API endpoint definitions
│   │   ├── admin.js                   # Admin authentication & dashboard
│   │   ├── users.js                   # User management
│   │   ├── products.js                # Product catalog
│   │   ├── orders.js                  # Order management
│   │   ├── payments.js                # Payment processing
│   │   ├── categories.js              # Product categories
│   │   ├── coupons.js                 # Coupon/discount codes
│   │   ├── reviews.js                 # Product reviews
│   │   ├── shipping.js                # Shipping management
│   │   ├── roles.js                   # Role management
│   │   ├── notifications.js           # User notifications
│   │   ├── analytics.js               # Analytics & reporting
│   │   ├── reports.js                 # Business reports
│   │   ├── settings.js                # System settings
│   │   └── payments.js                # Payment integration
│   ├── middleware/                    # Express middleware
│   │   ├── auth.js                    # JWT authentication
│   │   └── rateLimiter.js             # API rate limiting
│   ├── uploads/                       # Uploaded files storage
│   │   └── products/                  # Product images
│   ├── server.js                      # Express server entry point
│   ├── db.js                          # MySQL connection pool
│   ├── config.js                      # Environment configuration
│   └── schema.sql                     # Database schema (legacy, see database/)
│
├── database/                          # Database files & migrations
│   ├── schema.sql                     # Initial database schema
│   ├── migrations/                    # Schema migrations (future use)
│   └── seeds/                         # Sample data seeds (future use)
│
├── Root Configuration Files
│   ├── package.json                   # Project metadata & root scripts
│   ├── .env                           # Environment variables (DO NOT COMMIT)
│   ├── .env.example                   # Environment variables template
│   ├── .gitignore                     # Git ignore rules
│   ├── vite.config.ts                 # Vite configuration
│   ├── tsconfig.json                  # TypeScript configuration
│   ├── eslint.config.js               # ESLint rules
│   └── bunfig.toml                    # Bun package manager config
```

## Environment Variables

Create a `.env` file in the root directory with:

```
# MySQL Database
MYSQL_HOST=127.0.0.1
MYSQL_PORT=3306
MYSQL_USER=root
MYSQL_PASSWORD=your_password
MYSQL_DATABASE=admin_panel

# JWT Authentication
JWT_SECRET=your_super_secret_key_change_this

# Initial Admin Account
INITIAL_ADMIN_EMAIL=admin@example.com
INITIAL_ADMIN_PASSWORD=Admin123!

# Backend Server
PORT=4000

# Frontend API
VITE_API_BASE_URL=http://localhost:4000/api
```

## Setup Instructions

### Prerequisites
- Node.js 18+
- MySQL 5.7+
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone <repo-url>
   cd bespoke-page-bloom-main
   ```

2. **Install dependencies**
   ```bash
   npm install --legacy-peer-deps
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your database credentials
   ```

4. **Initialize the database**
   ```bash
   Get-Content database/schema.sql | mysql -h 127.0.0.1 -u root -p<password>
   ```
   Or on Linux/Mac:
   ```bash
   mysql -u root -p < database/schema.sql
   ```

### Running the Application

**Terminal 1 - Start Backend Server**
```bash
npm run server
# Backend runs on http://localhost:4000
```

**Terminal 2 - Start Frontend Dev Server**
```bash
npm run dev
# Frontend runs on http://localhost:8080 (or next available port)
```

### Building for Production

```bash
# Build frontend
npm run build

# Start backend in production
npm run server
```

## API Documentation

### Base URL
```
http://localhost:4000/api
```

### Authentication
- Endpoints require JWT token in Authorization header
- Format: `Authorization: Bearer <token>`
- Login endpoint: `POST /api/admin/login`

### Available Routes

| Route | Method | Description |
|-------|--------|-------------|
| `/api/admin/login` | POST | Admin login |
| `/api/admin/dashboard` | GET | Dashboard statistics |
| `/api/users` | GET/POST | User management |
| `/api/products` | GET/POST | Product management |
| `/api/orders` | GET/POST | Order management |
| `/api/categories` | GET/POST | Category management |
| `/api/payments` | GET/POST | Payment processing |
| `/api/reviews` | GET/POST | Product reviews |
| `/api/coupons` | GET/POST | Coupon management |
| `/api/shipping` | GET/POST | Shipping management |
| `/api/reports` | GET | Business reports |
| `/api/analytics` | GET | Analytics data |

## Database Schema

The database includes the following main tables:

- **users** - User accounts and authentication
- **roles** - User role definitions (Admin, Manager, Staff, Delivery Agent, User)
- **products** - Product catalog
- **categories** - Product categories
- **orders** - Customer orders
- **order_items** - Items in orders
- **payments** - Payment records
- **shipping** - Shipping details
- **reviews** - Product reviews
- **coupons** - Discount codes
- **wishlist** - User wishlists
- **cart** - Shopping cart items
- **notifications** - System notifications
- **settings** - Global system settings

## Development

### Available Scripts

```bash
npm run dev           # Start frontend dev server (Vite)
npm run server        # Start backend Express server
npm run build         # Build frontend for production
npm run build:dev     # Build with dev environment
npm run preview       # Preview production build
npm run lint          # Run ESLint
npm run format        # Format code with Prettier
```

### Tech Stack

**Frontend**
- React 19.2.0
- TanStack Router v1
- TanStack Start v1
- Tailwind CSS 4.2.1
- shadcn/ui components
- Redux Toolkit (state management)
- React Hook Form (form handling)
- Axios (HTTP client)
- TypeScript

**Backend**
- Express.js 4.18.2
- MySQL2 (database driver)
- JWT (authentication)
- Bcryptjs (password hashing)
- Multer (file uploads)
- Helmet (security headers)
- CORS (cross-origin requests)
- Rate limiting (express-rate-limit)

**Database**
- MySQL 5.7+ / 8.0+
- Character Set: utf8mb4
- Collation: utf8mb4_unicode_ci

## Troubleshooting

### npm run dev Error: vite not found
```bash
npm install --legacy-peer-deps
```

### Database Connection Error
1. Verify MySQL is running
2. Check credentials in .env
3. Ensure database is initialized: `Get-Content database/schema.sql | mysql -u root -p`
4. Check MySQL port (default: 3306)

### Backend Port Already in Use
```bash
# Change PORT in .env
PORT=4001
```

### CORS Errors
- Verify `VITE_API_BASE_URL` in .env matches backend URL
- Check backend CORS configuration in `backend/server.js`

## Project Cleanup Status

✅ **Completed**
- Database schema organized in `/database` folder
- Environment variables configured
- Dependencies fixed (duplicate @radix-ui/react-alert-dialog removed)
- Backend verified and working
- Frontend build verified and working
- npm dependencies installed

✅ **Working Directories**
- `/src` - Frontend React components and pages
- `/backend` - Express.js API server
- `/backend/routes` - All 14 API route modules
- `/backend/middleware` - Authentication & rate limiting
- `/src/components` - Reusable UI components

## Security Notes

- Never commit `.env` file
- Use strong JWT_SECRET in production
- Update default admin credentials
- Regularly update dependencies
- Use environment-specific configurations
- Validate all user inputs
- Use HTTPS in production

## Performance Optimization

- Vite provides fast Hot Module Replacement (HMR)
- TailwindCSS is optimized for production
- Database queries use connection pooling
- API responses are optimized with SELECT specific columns
- Images should be optimized before upload

## Contributing

1. Create a new branch for features
2. Follow existing code style
3. Run linting: `npm run lint`
4. Format code: `npm run format`
5. Test thoroughly before committing
6. Ensure no console errors in dev tools

## License

[Add your license here]

## Support

For issues or questions:
1. Check this README
2. Review error messages in console/terminal
3. Check backend logs for API errors
4. Verify database connection

---

**Last Updated**: 2026-05-30
**Project Status**: ✅ Functional and Organized
#   S a m  
 