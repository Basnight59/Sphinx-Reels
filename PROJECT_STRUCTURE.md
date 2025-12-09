# Backend Project Structure

## Complete File Tree

```
Sphinx-Reels/
├── server/                          ← Backend directory
│
├── src/                             ← Source code
│   ├── controllers/                 ← Business logic handlers
│   │   ├── authController.ts        (Auth: register, login, tokens)
│   │   ├── projectController.ts     (Projects: CRUD, duplicate)
│   │   ├── sceneController.ts       (Scenes: CRUD, reorder)
│   │   └── templateController.ts    (Templates: CRUD)
│   │
│   ├── routes/                      ← API endpoint definitions
│   │   ├── ai.ts                    (POST /api/ai/generate-scenes)
│   │   ├── auth.ts                  (Auth endpoints)
│   │   ├── projects.ts              (Project endpoints)
│   │   ├── scenes.ts                (Scene endpoints)
│   │   └── templates.ts             (Template endpoints)
│   │
│   ├── middleware/                  ← Express middleware
│   │   ├── auth.ts                  (JWT verification)
│   │   ├── errorHandler.ts          (Global error handling)
│   │   └── validation.ts            (Request validation)
│   │
│   ├── services/                    ← External integrations
│   │   └── aiService.ts             (Gemini AI, mock data)
│   │
│   ├── utils/                       ← Helper functions
│   │   ├── errors.ts                (Error classes, messages)
│   │   ├── jwt.ts                   (Token generation/verify)
│   │   └── password.ts              (Hashing, validation)
│   │
│   ├── lib/                         ← Library configs
│   │   └── prisma.ts                (Prisma client singleton)
│   │
│   ├── config.ts                    ← Environment configuration
│   ├── index.ts                     ← Server entry point
│   └── seed.ts                      ← Database seeding
│
├── prisma/                          ← Database
│   └── schema.prisma                (7 tables, full schema)
│
├── package.json                     ← Dependencies (13 total)
├── tsconfig.json                    ← TypeScript configuration
├── .env.example                     ← Environment template
├── .gitignore                       ← Git ignore rules
└── README.md                        ← Server documentation
```

## Directory Descriptions

### `/src` - Source Code (5 directories)

**controllers/** (4 files)
- Core business logic for each feature
- Handles request/response cycles
- Interacts with database via Prisma
- Error handling per endpoint

**routes/** (5 files)
- Express Router definitions
- Maps HTTP methods to handlers
- Middleware attachment
- Request validation

**middleware/** (3 files)
- Authentication middleware (JWT verify)
- Error handler (catch all errors)
- Request validation

**services/** (1 file)
- AI generation logic
- External API integrations
- Mock data generators

**utils/** (3 files)
- JWT token operations
- Password hashing/validation
- Error classes and constants

**lib/** (1 file)
- Prisma client (singleton pattern)
- Reused across app

### `/prisma` - Database

**schema.prisma**
- Complete database schema
- 7 tables with relationships
- Migration definitions
- Seed data configuration

### Root Config Files

- **package.json** - Project metadata, scripts, dependencies
- **tsconfig.json** - TypeScript compiler options
- **.env.example** - Environment variables template
- **.gitignore** - Git exclusion rules
- **README.md** - Server documentation

---

## File Statistics

### By Type
| Type | Count |
|------|-------|
| TypeScript (.ts) | 16 |
| Configuration | 4 |
| Documentation | 1 |
| **Total** | **21** |

### By Directory
| Directory | Files |
|-----------|-------|
| src/ | 16 |
| prisma/ | 1 |
| Root | 4 |

### By Purpose
| Category | Files |
|----------|-------|
| Controllers | 4 |
| Routes | 5 |
| Middleware | 3 |
| Utils | 3 |
| Services | 1 |
| Config | 5 |

---

## Key Files Overview

### Server Entry Point
```
src/index.ts
├── Imports all routes
├── Initializes Express app
├── Configures middleware (CORS, rate limiting)
└── Starts HTTP server on PORT
```

### Database Configuration
```
prisma/schema.prisma
├── 7 Tables
├── Relationships
├── Indexes
└── Constraints
```

### Authentication Flow
```
src/controllers/authController.ts
├── register()           - Create account
├── login()              - Authenticate user
├── refreshTokens()      - Renew access token
├── logout()             - Invalidate token
└── getCurrentUser()     - Get user profile
```

### Project Management
```
src/controllers/projectController.ts
├── listProjects()       - Get user's projects
├── getProject()         - Get single project
├── createProject()      - Create new project
├── updateProject()      - Update project
├── deleteProject()      - Soft delete
└── duplicateProject()   - Clone project
```

### Scene Management
```
src/controllers/sceneController.ts
├── listScenes()         - Get all scenes
├── addScene()           - Add new scene
├── updateScene()        - Edit scene
├── deleteScene()        - Remove scene
└── reorderScenes()      - Change scene order
```

### Template Management
```
src/controllers/templateController.ts
├── listTemplates()      - List all templates
├── getTemplate()        - Get template details
└── createTemplate()     - Create new template
```

### AI Generation
```
src/services/aiService.ts
├── generateScenesFromTopic()  - AI generation
└── generateMockScenes()       - Fallback mock data
```

---

## Import Relationships

```
index.ts (main)
├── Imports all routes
│   ├── auth.ts
│   │   └── authController.ts
│   │       ├── jwt.ts
│   │       ├── password.ts
│   │       ├── prisma.ts
│   │       └── errors.ts
│   │
│   ├── templates.ts
│   │   └── templateController.ts
│   │       ├── prisma.ts
│   │       └── errors.ts
│   │
│   ├── projects.ts
│   │   └── projectController.ts
│   │       ├── prisma.ts
│   │       └── errors.ts
│   │
│   ├── scenes.ts
│   │   └── sceneController.ts
│   │       ├── prisma.ts
│   │       └── errors.ts
│   │
│   └── ai.ts
│       └── aiService.ts
│
├── Middleware
│   ├── auth.ts
│   │   └── jwt.ts
│   └── errorHandler.ts
│
└── config.ts
```

---

## Database Schema Files

**prisma/schema.prisma** contains:

```prisma
// Data Models
- model User { }
- model Session { }
- model Template { }
- model TemplateComponent { }
- model Project { }
- model Scene { }

// Database Provider
- datasource db (PostgreSQL)

// Client Generator
- generator client (Prisma Client)
```

---

## Dependencies Used

### Express & Middleware
- express, cors, express-rate-limit

### Database
- @prisma/client, prisma

### Security
- bcryptjs, jsonwebtoken

### Utilities
- dotenv, uuid

### Development
- typescript, tsx, @types/* packages

---

## Configuration Files

### tsconfig.json
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ES2020",
    "lib": ["ES2020", "DOM"],
    "outDir": "./dist",
    "strict": true,
    "esModuleInterop": true
  }
}
```

### package.json
```json
{
  "name": "sphinx-reels-server",
  "type": "module",
  "scripts": {
    "dev": "tsx watch src/index.ts",
    "build": "tsc",
    "start": "node dist/index.js",
    "db:push": "prisma db push",
    "db:migrate": "prisma migrate dev",
    "db:studio": "prisma studio",
    "db:seed": "tsx src/seed.ts"
  }
}
```

### .env.example
```env
DATABASE_URL=postgresql://...
JWT_SECRET=...
PORT=5000
NODE_ENV=development
```

---

## Code Organization Principles

### Separation of Concerns
- **Controllers**: Handle HTTP requests/responses
- **Routes**: Map URLs to controllers
- **Services**: Business logic and external APIs
- **Middleware**: Cross-cutting concerns
- **Utils**: Reusable helper functions

### Scalability
- Each feature in its own controller
- Routes organized by resource
- Middleware for shared logic
- Services for integrations

### Maintainability
- Clear file naming conventions
- Logical directory structure
- Type safety with TypeScript
- Consistent error handling

### Testing Ready
- Controllers are testable
- Services are isolated
- Database mocked with Prisma
- Error handling standardized

---

## Adding New Features

### To Add a New Endpoint:

1. **Create Controller** → `src/controllers/newFeatureController.ts`
2. **Create Routes** → `src/routes/newFeature.ts`
3. **Import Routes** → `src/index.ts`

### To Modify Database:

1. **Edit Schema** → `prisma/schema.prisma`
2. **Run Migration** → `npm run db:push` or `npm run db:migrate`

### To Add Middleware:

1. **Create File** → `src/middleware/newMiddleware.ts`
2. **Use in Routes** → `router.use(newMiddleware)`

---

## Build & Deployment

### Development
```
npm run dev
→ Starts tsx with watch mode
→ Auto-reloads on file changes
→ Runs on http://localhost:5000
```

### Production
```
npm run build
→ Compiles TypeScript to JavaScript
→ Outputs to dist/
→ npm start runs dist/index.js
```

---

## Next Steps

1. ✅ **Structure Created** - All files in place
2. **Install Dependencies** - `npm install`
3. **Configure Database** - Update `.env`
4. **Initialize Schema** - `npm run db:push`
5. **Seed Demo Data** - `npm run db:seed`
6. **Start Server** - `npm run dev`

See `BACKEND_SETUP_GUIDE.md` for detailed instructions.
