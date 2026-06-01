# Quick Reference Guide

## 🚀 Start Development (Most Common)

```bash
# Terminal 1
npm run server

# Terminal 2 
npm run dev
```

Visit: http://localhost:8080

---

## 🔑 Admin Login

```
Email: admin@example.com
Password: Admin123!
```

---

## 🛠️ Development Tasks

| Task | Command |
|------|---------|
| Start frontend dev server | `npm run dev` |
| Start backend server | `npm run server` |
| Build for production | `npm run build` |
| Build dev mode | `npm run build:dev` |
| Preview production build | `npm run preview` |
| Check code quality | `npm run lint` |
| Format code | `npm run format` |

---

## 📂 Key File Locations

| Purpose | Location |
|---------|----------|
| Frontend config | `vite.config.ts` |
| Backend config | `backend/config.js` |
| Database config | `backend/db.js` |
| Environment vars | `.env` |
| Database schema | `database/schema.sql` |
| React components | `src/components/` |
| API routes | `backend/routes/` |
| Frontend routes | `src/routes/` |

---

## 🔌 API Endpoints (Key Examples)

| Method | Endpoint | Purpose |
|--------|----------|---------|
| POST | `/api/admin/login` | Admin login |
| GET | `/api/admin/dashboard` | Dashboard stats |
| GET | `/api/products` | List products |
| POST | `/api/products` | Create product |
| GET | `/api/orders` | List orders |
| POST | `/api/orders` | Create order |
| GET | `/api/users` | List users |
| POST | `/api/users` | Create user |

See `backend/README.md` for complete list.

---

## 🗄️ Database Credentials

```
Host: 127.0.0.1
Port: 3306
Database: admin_panel
User: root
Password: [check .env file]
```

---

## 📖 Documentation

| Document | Purpose |
|----------|---------|
| `README.md` | Project overview & tech stack |
| `SETUP_GUIDE.md` | Setup, config, deployment |
| `START_HERE.md` | Quick start guide |
| `CLEANUP_REPORT.md` | Detailed project status |
| `backend/README.md` | Backend API guide |
| `src/README.md` | Frontend structure guide |

---

## 🐛 Troubleshooting

### npm run dev fails
```bash
npm install --legacy-peer-deps
npm run dev
```

### Cannot connect to database
```bash
# Check MySQL is running
mysql -u root -p

# Check .env has correct password
cat .env | grep MYSQL
```

### Port already in use
```bash
# Change PORT in .env
PORT=4001

npm run server
```

### Build errors
```bash
rm -rf node_modules
npm install --legacy-peer-deps
npm run build
```

---

## 📊 Project Stats

- **Frontend Components**: 50+
- **Backend Routes**: 14
- **Database Tables**: 16
- **UI Components**: 70+ (shadcn/ui)
- **Dependencies**: 623 packages
- **Lines of Code**: ~20,000

---

## 🔐 Security Checklist

Before production:
- [ ] Change admin email
- [ ] Change admin password  
- [ ] Generate strong JWT_SECRET
- [ ] Enable HTTPS/SSL
- [ ] Set up database backups
- [ ] Review environment variables

---

## 📱 Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

---

## 🚢 Deployment

```bash
# Build
npm run build

# Output in dist/
# Upload dist/ to web server
# Run backend on application server
```

See `SETUP_GUIDE.md` for detailed deployment instructions.

---

## 💾 Database Backup

```bash
# Backup
mysqldump -u root -p admin_panel > backup.sql

# Restore
mysql -u root -p admin_panel < backup.sql
```

---

## 📈 Performance Tips

- Keep database indexes updated
- Monitor slow queries
- Use proper caching headers
- Optimize uploaded images
- Monitor API response times

---

## 🆘 Getting Help

1. Check relevant `README.md` file
2. Review `SETUP_GUIDE.md` 
3. Check browser console (F12)
4. Check backend logs
5. Review error messages carefully

---

## 🎯 Most Important Commands

```bash
npm install --legacy-peer-deps   # First time setup
npm run dev                       # Start development
npm run build                     # Build production
npm run server                    # Start backend API
npm run lint                      # Check code quality
```

---

**Last Updated**: 2026-05-30  
**Status**: ✅ Ready to Use  
**Type**: Quick Reference
