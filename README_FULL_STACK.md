# Sphinx-Reels: Faceless Reels AI

A complete full-stack application for creating AI-powered faceless video reels, shorts, and TikToks.

## 📁 Project Structure

```
Sphinx-Reels/
├── /                          ← Frontend (React + Vite)
│   ├── App.tsx
│   ├── index.tsx
│   ├── types.ts
│   ├── components/            (Layout)
│   ├── pages/                 (Dashboard, Editor, Templates, Login)
│   ├── services/              (geminiService)
│   └── [config files]
│
└── /server                    ← Backend (Node.js + Express)
    ├── src/                   (Controllers, Routes, Middleware)
    ├── prisma/                (Database Schema)
    └── [config files]
```

## 🚀 Quick Start

### Backend Setup (5 minutes)

```powershell
# 1. Navigate to server
cd server

# 2. Install dependencies
npm install

# 3. Configure environment
cp .env.example .env
# Edit .env with your DATABASE_URL

# 4. Initialize database
npm run db:push

# 5. Seed demo data (optional)
npm run db:seed

# 6. Start development server
npm run dev
```

**Backend runs on**: `http://localhost:5000`

### Frontend Setup (5 minutes)

```powershell
# 1. Install dependencies
npm install

# 2. Configure API URL (in src or .env)
# Update API_URL to match backend

# 3. Start development server
npm run dev
```

**Frontend runs on**: `http://localhost:5173`

## 📚 Documentation

### Getting Started
- **BACKEND_SETUP_GUIDE.md** - Complete backend installation (PostgreSQL, Docker, etc.)
- **BACKEND_SUMMARY.md** - Backend overview and status
- **PROJECT_STRUCTURE.md** - Detailed file structure and organization

### Technical Reference
- **API_DOCUMENTATION.md** - Complete API endpoint reference (20+ endpoints)
- **DATABASE_AND_GAPS_ANALYSIS.md** - Database requirements and schema analysis
- **BACKEND_COMPLETE.md** - Backend construction details

### Deployment
- `server/README.md` - Server documentation
- `server/package.json` - Backend dependencies
- Root `package.json` - Frontend dependencies

## 🏗️ Architecture

### Frontend
- **React 19** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **React Router** - Navigation
- **Lucide Icons** - UI icons

### Backend
- **Node.js** - Runtime
- **Express.js** - Web framework
- **TypeScript** - Type safety
- **PostgreSQL** - Database
- **Prisma** - ORM
- **JWT** - Authentication
- **bcryptjs** - Password hashing

## 🔑 Key Features

### User Management
✅ User registration and login
✅ JWT authentication with refresh tokens
✅ Password hashing and strength validation
✅ User profiles and settings

### Video Projects
✅ Create, edit, and delete projects
✅ Project templates
✅ Project duplication
✅ Soft delete (trash)

### Scene Editing
✅ Add, edit, and delete scenes
✅ Reorder scenes via drag-and-drop
✅ Image and video support
✅ Duration control
✅ Text overlays

### Templates
✅ Pre-built templates (5 included)
✅ Template library with search
✅ Category filtering
✅ Custom templates

### AI Features
✅ Scene generation from topics
✅ Multiple content types (educational, motivational, etc.)
✅ AI-powered script generation
✅ Ready for Gemini API integration

### Security
✅ CORS enabled
✅ Rate limiting
✅ Request validation
✅ Error handling
✅ SQL injection prevention

## 🗄️ Database Schema

### 7 Tables
1. **users** - User accounts
2. **sessions** - JWT sessions
3. **templates** - Video templates
4. **template_components** - Template elements
5. **projects** - Video projects
6. **scenes** - Individual slides
7. **relationships** - Structured data

See `DATABASE_AND_GAPS_ANALYSIS.md` for complete schema.

## 🔌 API Endpoints

### Authentication (5 endpoints)
```
POST   /api/auth/register
POST   /api/auth/login
POST   /api/auth/refresh-token
POST   /api/auth/logout
GET    /api/auth/me
```

### Templates (3 endpoints)
```
GET    /api/templates
GET    /api/templates/:id
POST   /api/templates
```

### Projects (6 endpoints)
```
GET    /api/projects
POST   /api/projects
GET    /api/projects/:id
PUT    /api/projects/:id
DELETE /api/projects/:id
POST   /api/projects/:id/duplicate
```

### Scenes (5 endpoints)
```
GET    /api/scenes/:projectId/scenes
POST   /api/scenes/:projectId/scenes
PUT    /api/scenes/:sceneId
DELETE /api/scenes/:sceneId
PUT    /api/scenes/:projectId/scenes/reorder
```

### AI (1 endpoint)
```
POST   /api/ai/generate-scenes
```

See `API_DOCUMENTATION.md` for complete reference.

## 📊 Development Status

### ✅ Completed
- Frontend UI (React + Vite)
- Backend structure (Express.js)
- Database schema (PostgreSQL + Prisma)
- Authentication system (JWT)
- All 20+ API endpoints
- Request validation
- Error handling
- Security features (CORS, rate limiting)

### 🔄 In Progress
- Frontend-backend integration
- Gemini API integration for AI
- File upload system

### 📋 TODO
- Video rendering pipeline
- Email notifications
- Project sharing
- Admin dashboard
- Automated tests
- CI/CD pipeline
- Production deployment

## 🛠️ Available Scripts

### Backend
```powershell
npm run dev              # Start dev server with hot-reload
npm run build           # Build for production
npm start              # Run production build
npm run db:push        # Sync database schema
npm run db:migrate     # Create migrations
npm run db:studio      # Open Prisma Studio GUI
npm run db:seed        # Populate demo data
npm run type-check     # Check TypeScript types
npm run lint           # Run linter
```

### Frontend
```powershell
npm run dev            # Start dev server
npm run build          # Build for production
npm run preview        # Preview production build
npm run lint           # Run linter
```

## 🔐 Environment Variables

### Backend (.env)
```env
DATABASE_URL=postgresql://user:password@localhost:5432/sphinx_reels_dev
JWT_SECRET=your-secret-key
JWT_REFRESH_SECRET=your-refresh-secret
GEMINI_API_KEY=your-gemini-key
FRONTEND_URL=http://localhost:5173
PORT=5000
NODE_ENV=development
```

### Frontend (.env)
```env
VITE_API_URL=http://localhost:5000/api
```

## 🧪 Testing

### Test Backend
```powershell
# Check server health
curl http://localhost:5000/health

# Register user
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"user@test.com","name":"Test","password":"Pass123"}'
```

### Test Frontend
```powershell
# With backend running, frontend should load at
http://localhost:5173
```

## 📖 Learning Resources

### Backend
- [Express.js Docs](https://expressjs.com/)
- [Prisma Docs](https://www.prisma.io/docs/)
- [TypeScript Docs](https://www.typescriptlang.org/)
- [PostgreSQL Docs](https://www.postgresql.org/docs/)

### Frontend
- [React Docs](https://react.dev/)
- [Vite Docs](https://vitejs.dev/)
- [TypeScript Docs](https://www.typescriptlang.org/)
- [React Router Docs](https://reactrouter.com/)

## 🐛 Troubleshooting

### Backend Won't Start
1. Check PostgreSQL is running
2. Verify DATABASE_URL in .env
3. Run `npm install`
4. Check for port conflicts

### Database Connection Error
```powershell
# Test connection
psql $DATABASE_URL

# Reset database
npx prisma migrate reset
```

### Frontend Can't Connect to Backend
1. Verify backend is running on :5000
2. Check CORS configuration
3. Update API_URL in frontend

See documentation files for more detailed troubleshooting.

## 📝 File Reference

| File | Purpose |
|------|---------|
| BACKEND_SETUP_GUIDE.md | Complete backend setup (PostgreSQL, Docker, etc.) |
| BACKEND_SUMMARY.md | Backend overview and checklist |
| API_DOCUMENTATION.md | Complete API reference |
| DATABASE_AND_GAPS_ANALYSIS.md | Database requirements |
| PROJECT_STRUCTURE.md | Detailed file organization |
| BACKEND_COMPLETE.md | Backend construction details |
| server/README.md | Server documentation |
| server/package.json | Backend dependencies |
| package.json | Frontend dependencies |

## 🚀 Deployment

### Development
```powershell
# Terminal 1 - Backend
cd server && npm run dev

# Terminal 2 - Frontend
npm run dev
```

### Production
```powershell
# Build backend
cd server && npm run build

# Build frontend
npm run build

# Set production env vars
# Deploy to hosting provider
```

## 🤝 Contributing

1. Create feature branch
2. Implement changes
3. Test thoroughly
4. Submit pull request

## 📄 License

MIT License - See LICENSE file

## 👥 Support

For issues or questions:
1. Check the relevant documentation file
2. Review API documentation
3. Check error messages in logs
4. Create an issue on GitHub

## 🎯 Next Steps

1. ✅ **Backend constructed** - Ready to use
2. **Install dependencies** - `npm install` in server/
3. **Set up database** - Configure PostgreSQL
4. **Configure .env** - Add environment variables
5. **Start servers** - `npm run dev` in both directories
6. **Test endpoints** - Verify API works
7. **Connect frontend** - Update API URLs
8. **Deploy** - Push to production

---

**Status**: Backend complete ✅ | Frontend ready ⚠️ | Database ready ✅

**Ready for**: Development → Testing → Production

See **BACKEND_SETUP_GUIDE.md** to get started! 🚀
