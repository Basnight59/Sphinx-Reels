# Sphinx Reels Backend Server

A Node.js/Express backend for the Sphinx-Reels (Faceless Reels AI) video generation platform.

## Quick Start

### Prerequisites
- Node.js 18+ 
- PostgreSQL 14+
- npm or yarn

### Installation

1. **Install dependencies**
```bash
npm install
```

2. **Configure environment**
```bash
cp .env.example .env
```

Edit `.env` with your configuration:
```env
DATABASE_URL="postgresql://user:password@localhost:5432/sphinx_reels_dev"
JWT_SECRET="your-super-secret-jwt-key"
GEMINI_API_KEY="your-gemini-api-key"
FRONTEND_URL="http://localhost:5173"
```

3. **Set up database**
```bash
# Push schema to database
npm run db:push

# Run seed data (optional)
npm run db:seed
```

4. **Start development server**
```bash
npm run dev
```

Server runs on `http://localhost:5000`

## Available Scripts

```bash
npm run dev              # Start development server with hot reload
npm run build           # Build for production
npm start              # Run production build
npm run db:push        # Push Prisma schema to database
npm run db:migrate     # Run database migrations
npm run db:studio      # Open Prisma Studio (GUI)
npm run db:seed        # Seed database with demo data
npm run type-check     # Check TypeScript types
npm run lint           # Run ESLint
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/refresh-token` - Refresh access token
- `POST /api/auth/logout` - Logout user
- `GET /api/auth/me` - Get current user info

### Templates
- `GET /api/templates` - List all published templates
- `GET /api/templates?category=Educational` - Filter by category
- `GET /api/templates/:id` - Get template details
- `POST /api/templates` - Create new template (auth required)

### Projects
- `GET /api/projects` - List user's projects
- `POST /api/projects` - Create new project
- `GET /api/projects/:id` - Get project details
- `PUT /api/projects/:id` - Update project
- `DELETE /api/projects/:id` - Delete project (soft delete)
- `POST /api/projects/:id/duplicate` - Duplicate project

### Scenes
- `GET /api/scenes/:projectId/scenes` - List scenes in project
- `POST /api/scenes/:projectId/scenes` - Add scene to project
- `PUT /api/scenes/:sceneId` - Update scene
- `DELETE /api/scenes/:sceneId` - Delete scene
- `PUT /api/scenes/:projectId/scenes/reorder` - Reorder scenes

### AI Generation
- `POST /api/ai/generate-scenes` - Generate scenes from topic
  ```json
  {
    "topic": "5 benefits of drinking water",
    "type": "educational",
    "count": 3
  }
  ```

## Project Structure

```
server/
├── src/
│   ├── controllers/       # Request handlers
│   ├── middleware/        # Express middleware
│   ├── routes/           # API route definitions
│   ├── services/         # Business logic
│   ├── utils/            # Helper functions
│   ├── lib/              # Library configurations
│   ├── config.ts         # Environment configuration
│   └── index.ts          # Entry point
├── prisma/
│   └── schema.prisma     # Database schema
├── .env.example          # Environment template
├── package.json          # Dependencies
└── tsconfig.json         # TypeScript config
```

## Database Schema

### Users
- id, email, name, passwordHash, avatar, subscriptionTier, isActive, createdAt, updatedAt

### Templates
- id, name, category, description, thumbnailUrl, layoutConfig, defaultDuration, isPublished, createdBy, createdAt, updatedAt

### Projects
- id, userId, name, description, thumbnailUrl, status, templateId, renderingProgress, createdAt, updatedAt, deletedAt

### Scenes
- id, projectId, sceneOrder, text, imageUrl, videoUrl, duration, voiceoverUrl, voiceoverText, aiGenerated, createdAt, updatedAt

### Sessions
- id, userId, token, expiresAt, createdAt

## Authentication

The API uses JWT (JSON Web Tokens) for authentication:

1. Register or login to get `accessToken` and `refreshToken`
2. Include `Authorization: Bearer <accessToken>` header in requests
3. Use `refreshToken` to get a new `accessToken` when expired

## Error Handling

All errors return consistent JSON format:
```json
{
  "error": "Error message",
  "status": 400
}
```

## Security Features

- Password hashing with bcrypt (10 rounds)
- JWT token-based authentication
- Refresh token rotation
- Request validation
- Rate limiting (100 requests per 15 minutes)
- CORS configuration
- SQL injection prevention (Prisma ORM)

## Demo Credentials

After running `npm run db:seed`:
- Email: `demo@example.com`
- Password: `password123` (if you seed it)

## Environment Variables

See `.env.example` for all available options:
- `DATABASE_URL` - PostgreSQL connection string
- `JWT_SECRET` - Secret key for access tokens
- `JWT_REFRESH_SECRET` - Secret key for refresh tokens
- `GEMINI_API_KEY` - Google Gemini API key for AI features
- `FRONTEND_URL` - Frontend application URL (for CORS)
- `PORT` - Server port (default: 5000)
- `NODE_ENV` - Environment (development/production)

## Development

### Adding a new endpoint

1. Create controller in `src/controllers/`
2. Create route in `src/routes/`
3. Add route to `src/index.ts`
4. Test with curl or Postman

### Updating database schema

1. Edit `prisma/schema.prisma`
2. Run `npm run db:push` or `npm run db:migrate`
3. Prisma Client automatically updates

## Deployment

1. Build the project: `npm run build`
2. Set production environment variables
3. Run migrations: `npm run db:push`
4. Start server: `npm start`

## Support

For issues or questions, check:
- API documentation in routes/
- Database schema in prisma/schema.prisma
- Error messages for debugging clues
