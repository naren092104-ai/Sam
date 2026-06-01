# Project Setup & Deployment Guide

## Quick Start

### First Time Setup

```bash
# 1. Navigate to project directory
cd bespoke-page-bloom-main

# 2. Install dependencies
npm install --legacy-peer-deps

# 3. Create environment file
cp .env.example .env
# Edit .env with your database credentials

# 4. Initialize database
Get-Content database/schema.sql | mysql -h 127.0.0.1 -u root -p<password>
# Or on Linux/Mac:
# mysql -u root -p < database/schema.sql

# 5. Start backend (Terminal 1)
npm run server

# 6. Start frontend (Terminal 2)
npm run dev
```

Access the application:
- Frontend: http://localhost:8080
- Backend API: http://localhost:4000/api
- Admin Login: http://localhost:8080/admin/login

### Default Admin Credentials
- Email: admin@example.com
- Password: Admin123!

⚠️ **Change these credentials immediately in production!**

## Environment Variables

Create `.env` file in project root:

```env
# Database Configuration
MYSQL_HOST=127.0.0.1
MYSQL_PORT=3306
MYSQL_USER=root
MYSQL_PASSWORD=your_password
MYSQL_DATABASE=admin_panel

# JWT Security (CHANGE IN PRODUCTION!)
JWT_SECRET=your_super_secret_jwt_key_change_this

# Admin Account (CHANGE IN PRODUCTION!)
INITIAL_ADMIN_EMAIL=admin@example.com
INITIAL_ADMIN_PASSWORD=Admin123!

# Backend Server
PORT=4000

# Frontend API Configuration
VITE_API_BASE_URL=http://localhost:4000/api
```

## Database Setup

### Prerequisites
- MySQL 5.7 or higher installed and running
- MySQL command-line client available

### Initialize Database

**On Windows (PowerShell):**
```powershell
Get-Content database/schema.sql | mysql -h 127.0.0.1 -u root -pYourPassword
```

**On Windows (CMD):**
```cmd
type database\schema.sql | mysql -h 127.0.0.1 -u root -pYourPassword
```

**On Linux/macOS:**
```bash
mysql -h 127.0.0.1 -u root -p < database/schema.sql
```

When prompted for password, enter your MySQL root password.

### Verify Database

```bash
mysql -u root -p
> use admin_panel;
> show tables;
# Should display all 16 tables
```

## Project Structure

```
project-root/
├── src/                    # React frontend code
├── backend/                # Express.js API server
├── database/               # Database schemas & migrations
├── package.json            # Dependencies & scripts
├── .env                    # Environment variables (DO NOT COMMIT)
├── vite.config.ts          # Vite build configuration
├── tsconfig.json           # TypeScript configuration
└── README.md               # Main documentation
```

See [Frontend Guide](./src/README.md) and [Backend Guide](./backend/README.md) for detailed structure.

## Development Scripts

### Frontend Development
```bash
# Start dev server with hot reload
npm run dev

# Build for production
npm run build

# Build with dev mode
npm run build:dev

# Preview production build
npm run preview
```

### Backend
```bash
# Start Express server
npm run server
```

### Code Quality
```bash
# Run linter
npm run lint

# Format code with Prettier
npm run format
```

## Production Deployment

### Build Frontend

```bash
npm run build
```

This creates optimized production build in `dist/` directory.

### Environment Configuration

For production, create `.env` with:
```env
MYSQL_HOST=your-db-host
MYSQL_PORT=3306
MYSQL_USER=db-user
MYSQL_PASSWORD=strong-password
MYSQL_DATABASE=admin_panel
JWT_SECRET=very-long-random-secret-key
INITIAL_ADMIN_EMAIL=admin@yourdomain.com
INITIAL_ADMIN_PASSWORD=StrongPassword123!
PORT=4000
VITE_API_BASE_URL=https://yourdomain.com/api
```

### Deploy Backend

1. Upload backend files to server
2. Install dependencies: `npm install --legacy-peer-deps`
3. Set environment variables in `.env`
4. Start server with process manager (PM2, systemd, etc.)

```bash
# Using PM2
pm2 start backend/src/server.js --name "api"
```

### Deploy Frontend

1. Build: `npm run build`
2. Upload `dist/` directory to web server
3. Configure web server to serve `index.html` for all routes (SPA routing)

**Nginx example:**
```nginx
server {
    listen 80;
    server_name yourdomain.com;
    root /var/www/app/dist;
    
    location / {
        try_files $uri /index.html;
    }
    
    location /api {
        proxy_pass http://localhost:4000;
    }
}
```

## Docker Deployment (Optional)

### Backend Dockerfile

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install --legacy-peer-deps

COPY backend/ ./backend/
COPY .env .

EXPOSE 4000
CMD ["node", "backend/src/server.js"]
```

### Frontend Dockerfile

```dockerfile
FROM node:18-alpine as builder
WORKDIR /app
COPY package*.json ./
RUN npm install --legacy-peer-deps
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

## Troubleshooting

### npm run dev Error
```bash
# Issue: vite not found
# Solution:
npm install --legacy-peer-deps
```

### Database Connection Error
```bash
# Check MySQL is running
mysql -u root -p

# Check credentials in .env
cat .env | grep MYSQL

# Verify database exists
mysql -u root -p -e "SHOW DATABASES;"
```

### Port Already in Use
```bash
# Frontend (default 8080)
# Find what's using the port
netstat -ano | findstr :8080  # Windows
lsof -i :8080                   # Mac/Linux

# Backend (default 4000)
netstat -ano | findstr :4000  # Windows
lsof -i :4000                   # Mac/Linux

# Change port in .env if needed
PORT=4001
```

### CORS Errors in Console
```
# Check:
1. Backend is running on correct port
2. VITE_API_BASE_URL matches backend URL
3. Backend CORS is configured correctly
```

### Build Errors

**TypeScript errors:**
```bash
npm run lint
```

**Module not found:**
```bash
# Reinstall dependencies
rm -rf node_modules
npm install --legacy-peer-deps
```

## Monitoring & Maintenance

### Logs

**Backend logs:**
```bash
# With PM2
pm2 logs api
```

**Frontend errors:**
- Browser console (F12)
- Browser Network tab

### Performance

- Monitor database query performance
- Check API response times
- Monitor server resources (CPU, Memory, Disk)
- Review error rates in production

### Backups

```bash
# Database backup
mysqldump -u root -p admin_panel > backup-$(date +%Y%m%d).sql

# Code backup (via Git)
git tag -a v1.0.0 -m "Production release"
git push origin v1.0.0
```

## Security Checklist

✅ **Before Production**
- [ ] Change admin email and password
- [ ] Change JWT_SECRET to strong random key
- [ ] Use HTTPS (SSL/TLS certificates)
- [ ] Enable database backups
- [ ] Set up database user with limited privileges
- [ ] Enable Web Application Firewall (WAF)
- [ ] Configure rate limiting
- [ ] Enable CORS for specific domains only
- [ ] Remove debug mode
- [ ] Set up error logging/monitoring
- [ ] Update all dependencies to latest versions
- [ ] Perform security audit

## Performance Optimization

- Use CDN for static assets
- Enable gzip compression
- Implement database indexes on frequently queried columns
- Use caching headers for frontend assets
- Optimize images before upload
- Consider Redis for session storage

## Version Updates

### Updating Dependencies

```bash
# Check for updates
npm outdated

# Update all packages
npm update

# Update to latest (breaking changes possible)
npm install npm@latest -g
npm install
```

⚠️ Always test thoroughly after updates!

## Scaling

### Horizontal Scaling
- Run multiple backend instances behind load balancer
- Use shared MySQL instance or database replication

### Vertical Scaling
- Upgrade server resources (RAM, CPU)
- Optimize database queries
- Implement caching layer (Redis)

## Support & Documentation

- Main README: [README.md](./README.md)
- Frontend Guide: [src/README.md](./src/README.md)
- Backend Guide: [backend/README.md](./backend/README.md)
- Database: [database/](./database/)

## Contact & Support

For issues or questions:
1. Check relevant README file
2. Review error logs
3. Check issue tracker
4. Contact development team

---

**Last Updated**: 2026-05-30  
**Version**: 1.0.0
