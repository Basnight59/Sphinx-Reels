# Backend Setup & Installation Guide

## Complete Setup Instructions

### Step 1: Navigate to Server Directory
```powershell
cd server
```

### Step 2: Install Dependencies
```powershell
npm install
```

This will install all required packages:
- **express** - Web framework
- **@prisma/client** - ORM for database
- **bcryptjs** - Password hashing
- **jsonwebtoken** - JWT authentication
- **cors** - Cross-Origin Resource Sharing
- **express-rate-limit** - Rate limiting
- **dotenv** - Environment variables

### Step 3: Set Up Environment Variables

Copy the example file:
```powershell
Copy-Item .env.example -Destination .env
```

Edit `.env` with your settings:

**For Development (PostgreSQL locally):**
```env
DATABASE_URL="postgresql://postgres:password@localhost:5432/sphinx_reels_dev"
PORT=5000
NODE_ENV=development
JWT_SECRET="dev-secret-key-change-in-production"
JWT_REFRESH_SECRET="dev-refresh-secret-key-change-in-production"
GEMINI_API_KEY="your-actual-gemini-key-or-leave-blank-for-mock"
FRONTEND_URL="http://localhost:5173"
```

### Step 4: Set Up PostgreSQL Database

**Option A: Using Docker (Recommended)**
```powershell
docker run --name postgres-sphinx -e POSTGRES_PASSWORD=password -p 5432:5432 -d postgres:15
```

**Option B: Local PostgreSQL Installation**
- Install PostgreSQL 14+
- Create database: `createdb sphinx_reels_dev`

### Step 5: Initialize Database Schema

Push Prisma schema to database:
```powershell
npm run db:push
```

This creates all tables automatically.

### Step 6: Seed Demo Data (Optional)

Populate database with sample data:
```powershell
npm run db:seed
```

This creates:
- Demo user (email: demo@example.com)
- 5 sample templates
- 1 sample project with 3 scenes

### Step 7: Start Development Server

```powershell
npm run dev
```

You should see:
```
🚀 Server running on http://localhost:5000
Environment: development
```

### Step 8: Test the API

Open another terminal and test a basic endpoint:

```powershell
# Check server health
curl http://localhost:5000/health

# Expected response:
# {"status":"OK","timestamp":"2025-12-09T..."}
```

## API Testing

### Register New User
```powershell
$body = @{
    email = "user@example.com"
    name = "Test User"
    password = "SecurePass123"
} | ConvertTo-Json

Invoke-WebRequest -Uri "http://localhost:5000/api/auth/register" `
  -Method POST `
  -Headers @{"Content-Type"="application/json"} `
  -Body $body
```

### Login
```powershell
$body = @{
    email = "user@example.com"
    password = "SecurePass123"
} | ConvertTo-Json

$response = Invoke-WebRequest -Uri "http://localhost:5000/api/auth/login" `
  -Method POST `
  -Headers @{"Content-Type"="application/json"} `
  -Body $body

# Save the accessToken for next requests
$token = ($response.Content | ConvertFrom-Json).tokens.accessToken
```

### List Templates
```powershell
Invoke-WebRequest -Uri "http://localhost:5000/api/templates" `
  -Method GET `
  -Headers @{"Content-Type"="application/json"}
```

### Create Project (Requires Authentication)
```powershell
$headers = @{
    "Content-Type" = "application/json"
    "Authorization" = "Bearer $token"
}

$body = @{
    name = "My First Video"
    description = "A test project"
    templateId = "template-id-here"
} | ConvertTo-Json

Invoke-WebRequest -Uri "http://localhost:5000/api/projects" `
  -Method POST `
  -Headers $headers `
  -Body $body
```

## Database Management

### View Data in Prisma Studio
```powershell
npm run db:studio
```
Opens a GUI at http://localhost:5555

### Create Migration
```powershell
npm run db:migrate
```

### Reset Database (⚠️ Deletes all data)
```powershell
npx prisma migrate reset
```

## Common Issues & Solutions

### Issue: "Cannot connect to database"
**Solution:**
- Check DATABASE_URL in .env
- Ensure PostgreSQL is running
- Verify credentials are correct
```powershell
# Test connection
psql postgresql://user:password@localhost:5432/sphinx_reels_dev
```

### Issue: "Module not found: express"
**Solution:**
```powershell
npm install
npm install @types/express @types/node --save-dev
```

### Issue: "Port 5000 already in use"
**Solution:**
```powershell
# Kill process on port 5000 (Windows)
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Or change PORT in .env
```

### Issue: JWT_SECRET not set
**Solution:**
```powershell
# Generate a strong secret
$secret = [System.Convert]::ToBase64String((1..32 | ForEach-Object {[byte](Get-Random -Maximum 256)}))
Write-Host $secret
# Add to .env as JWT_SECRET
```

## Frontend Integration

### Update Frontend API URL

In your frontend `.env`:
```
VITE_API_URL=http://localhost:5000/api
```

Or update the API client:
```typescript
// In frontend service files
const API_URL = process.env.VITE_API_URL || 'http://localhost:5000/api';
```

### Add Authorization Header

```typescript
const headers = {
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${accessToken}`
};

// In fetch calls
fetch(`${API_URL}/projects`, {
  method: 'GET',
  headers
});
```

## Production Deployment

### 1. Build
```powershell
npm run build
```

### 2. Set Production Environment
```env
NODE_ENV=production
JWT_SECRET=your-production-secret-key-here
JWT_REFRESH_SECRET=your-production-refresh-secret-key-here
GEMINI_API_KEY=your-actual-gemini-api-key
DATABASE_URL=your-production-database-url
FRONTEND_URL=https://yourdomain.com
```

### 3. Deploy

**Using Heroku:**
```powershell
heroku login
heroku create sphinx-reels-api
heroku config:set DATABASE_URL=postgresql://...
git push heroku main
```

**Using Railway/Render/Vercel:**
- Connect GitHub repository
- Set environment variables
- Deploy

### 4. Run Migrations
```powershell
npm run db:push
```

## Next Steps

1. ✅ Backend server is running
2. Update frontend to use real API endpoints
3. Set up Gemini API key for AI features
4. Configure AWS S3 for file uploads
5. Set up video rendering pipeline
6. Add automated tests
7. Deploy to production

## Scripts Reference

| Script | Purpose |
|--------|---------|
| `npm run dev` | Start dev server with hot reload |
| `npm run build` | Build for production |
| `npm start` | Run production build |
| `npm run db:push` | Sync schema to database |
| `npm run db:migrate` | Create migrations |
| `npm run db:studio` | Open Prisma Studio GUI |
| `npm run db:seed` | Populate database with demo data |
| `npm run type-check` | Check TypeScript types |
| `npm run lint` | Run linter |

## Documentation Links

- [Express Documentation](https://expressjs.com/)
- [Prisma Documentation](https://www.prisma.io/docs/)
- [JWT.io](https://jwt.io/)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [CORS Documentation](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS)

## Support

If you encounter issues:
1. Check the error logs in terminal
2. Verify environment variables in .env
3. Ensure PostgreSQL is running
4. Review API endpoint documentation in README.md
5. Check Prisma schema for database structure
