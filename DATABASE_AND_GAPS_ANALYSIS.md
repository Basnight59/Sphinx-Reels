# Database & Code Gaps Analysis - Sphinx-Reels (Faceless Reels AI)

## Executive Summary
The application is currently a **frontend-only prototype with mock data**. To move to production, a backend system and database are required. Below is a comprehensive analysis of gaps and database requirements.

---

## 🔴 CRITICAL GAPS

### 1. **No Backend Server**
- ❌ No API endpoints for CRUD operations
- ❌ No authentication/authorization system
- ❌ No data persistence layer
- ❌ All state is in-memory (lost on page refresh)

### 2. **No Database**
- ❌ No database schema
- ❌ No video template storage
- ❌ No user/project storage
- ❌ No persistent data

### 3. **Mock Data Only**
- `App.tsx`: Uses hardcoded `INITIAL_PROJECTS` array
- `Templates.tsx`: Uses hardcoded `TEMPLATES` array
- No API calls to retrieve actual data
- No export/save functionality (Save button exists but does nothing)

### 4. **Security Issues**
- ❌ No real authentication system (Login form is mock)
- ❌ No JWT/session tokens
- ❌ API key exposed in client code (`geminiService.ts`)
- ❌ No user validation or authorization

### 5. **API Key Management**
- Gemini API key expected in `process.env.API_KEY`
- No proper environment variable handling
- Client-side API access (security risk)
- Fallback to mock data if key missing

---

## 📊 REQUIRED DATABASE SCHEMA

### **1. Users Table**
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  is_active BOOLEAN DEFAULT true
);
```

### **2. Templates Table**
```sql
CREATE TABLE templates (
  id UUID PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  category VARCHAR(100) NOT NULL,
  description TEXT,
  thumbnail_url VARCHAR(500),
  layout_config JSONB,
  default_duration INTEGER DEFAULT 3,
  is_published BOOLEAN DEFAULT false,
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### **3. Projects Table**
```sql
CREATE TABLE projects (
  id UUID PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  thumbnail_url VARCHAR(500),
  status VARCHAR(50) DEFAULT 'draft',
  template_id UUID REFERENCES templates(id),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  deleted_at TIMESTAMP
);
```

### **4. Scenes Table**
```sql
CREATE TABLE scenes (
  id UUID PRIMARY KEY,
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  scene_order INTEGER NOT NULL,
  text VARCHAR(1000),
  image_url VARCHAR(500),
  video_url VARCHAR(500),
  duration DECIMAL(5, 2) DEFAULT 3.0,
  voiceover_url VARCHAR(500),
  voiceover_text TEXT,
  ai_generated BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### **5. Template Components Table** (for reusable UI elements)
```sql
CREATE TABLE template_components (
  id UUID PRIMARY KEY,
  template_id UUID NOT NULL REFERENCES templates(id) ON DELETE CASCADE,
  component_type VARCHAR(100),
  position_x INTEGER,
  position_y INTEGER,
  width INTEGER,
  height INTEGER,
  config JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### **6. Sessions Table** (for authentication)
```sql
CREATE TABLE sessions (
  id UUID PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  token VARCHAR(500) UNIQUE NOT NULL,
  expires_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);
```

---

## 🏗️ BACKEND REQUIREMENTS

### **Technology Stack Recommendations**
- **Runtime**: Node.js with Express.js OR Python with FastAPI
- **Database**: PostgreSQL (supports JSONB for template configs)
- **ORM**: Prisma, Sequelize, or SQLAlchemy
- **Authentication**: JWT + bcrypt
- **File Storage**: AWS S3 or similar for images/videos
- **API Format**: REST or GraphQL

### **Essential API Endpoints Needed**

#### **Authentication**
```
POST   /api/auth/register          - Create user account
POST   /api/auth/login             - Login & get JWT token
POST   /api/auth/logout            - Logout
POST   /api/auth/refresh-token     - Refresh JWT
```

#### **Templates**
```
GET    /api/templates              - List all templates
GET    /api/templates/:id          - Get template details
POST   /api/templates              - Create template (admin)
PUT    /api/templates/:id          - Update template (admin)
DELETE /api/templates/:id          - Delete template (admin)
GET    /api/templates/category/:cat - Filter by category
```

#### **Projects**
```
GET    /api/projects               - List user's projects
GET    /api/projects/:id           - Get project details
POST   /api/projects               - Create new project
PUT    /api/projects/:id           - Update project
DELETE /api/projects/:id           - Delete project
POST   /api/projects/:id/duplicate - Duplicate project
POST   /api/projects/:id/export    - Export video
```

#### **Scenes**
```
GET    /api/projects/:id/scenes    - List scenes
POST   /api/projects/:id/scenes    - Add scene
PUT    /api/scenes/:id             - Update scene
DELETE /api/scenes/:id             - Delete scene
PUT    /api/scenes/:id/reorder     - Reorder scenes
```

#### **AI Generation** (Backend should proxy this)
```
POST   /api/ai/generate-scenes     - Generate scenes from topic
POST   /api/ai/generate-script     - Generate script from content
```

---

## 🔧 CODE GAPS & MISSING IMPLEMENTATIONS

### **1. Frontend Issues**

#### **App.tsx**
- ❌ Mock data only, no API calls
- ❌ No user authentication check on protected routes
- ❌ Projects not persisted
- ✅ Structure is correct, just needs API integration

#### **pages/Templates.tsx**
- ❌ Mock templates array (5 hardcoded templates)
- ❌ Search/filter not functional
- ❌ "Use Template" button doesn't do anything
- ❌ No database of templates
- ✅ UI is well-designed

#### **pages/Editor.tsx**
- ❌ Save button doesn't actually save
- ❌ Export functionality missing
- ❌ No project persistence
- ❌ Scene drag-reorder not implemented (GripVertical icon exists but no handler)
- ❌ "Change Image" button not functional
- ✅ AI generation integration exists (but API key issue)

#### **pages/Dashboard.tsx**
- ❌ Projects only in state, not from database
- ❌ No delete/duplicate functionality (MoreVertical button exists but no menu)
- ❌ Rendering status doesn't update
- ✅ Good layout structure

#### **pages/Login.tsx**
- ❌ No actual authentication
- ❌ No form validation
- ❌ No server-side login
- ❌ No password reset
- ✅ UI looks good

#### **services/geminiService.ts**
- ✅ AI generation logic is implemented
- ❌ API key exposed on client side
- ⚠️ Fallback to mock data is good, but needs backend proxy

### **2. Missing Features**

| Feature | Status | Priority |
|---------|--------|----------|
| User Authentication | ❌ Not implemented | 🔴 Critical |
| Project Persistence | ❌ Not implemented | 🔴 Critical |
| Template Database | ❌ Not implemented | 🔴 Critical |
| Scene Management | ⚠️ UI only, no save | 🔴 Critical |
| Video Export | ❌ Not implemented | 🟡 High |
| Drag-to-Reorder Scenes | ❌ Icon only | 🟡 High |
| Project Sharing | ❌ Not implemented | 🟡 High |
| Rendering Queue | ❌ Not implemented | 🟡 High |
| File Upload (images) | ❌ Not implemented | 🟡 High |
| Voiceover Support | ⚠️ Type exists, no UI | 🟢 Medium |

### **3. Type System Issues**

#### **types.ts** - Good foundation but incomplete:
```typescript
// Missing properties that should be in types:
- Template: missing layout_config, default_duration, is_published
- Project: missing template_id, user_id, rendering_progress
- Scene: needs more metadata (position, size, effects)
- User: needs user avatar, subscription tier
```

### **4. Environment Configuration**

#### **Missing .env support**
```
# Should be in .env, not hardcoded
API_KEY=your_gemini_key
BACKEND_URL=http://localhost:5000
DATABASE_URL=postgres://...
```

#### **Vite Config Issue**
- `vite.config.ts` exists but not shown
- Need proper env variable handling

---

## 📋 IMPLEMENTATION ROADMAP

### **Phase 1: Backend Setup** (1-2 weeks)
1. Choose backend framework (Node.js/Express recommended)
2. Set up PostgreSQL database
3. Implement user authentication system
4. Create database migrations
5. Build API endpoints for Projects & Templates
6. Set up environment variables & security

### **Phase 2: Data Persistence** (1-2 weeks)
1. Update `App.tsx` to fetch projects from API
2. Implement project CRUD operations
3. Persist template data in database
4. Update all API calls in components
5. Add error handling & loading states

### **Phase 3: Core Features** (2-3 weeks)
1. Implement project save/export
2. Build scene reordering (drag-drop)
3. Add image upload functionality
4. Implement template selection on project creation
5. Add project sharing/collaboration

### **Phase 4: Advanced Features** (2-3 weeks)
1. Video rendering pipeline
2. Voiceover generation
3. Advanced effects/transitions
4. Project templates library
5. Usage analytics

---

## 🔐 SECURITY CONSIDERATIONS

1. **API Key Management**: Move Gemini API calls to backend
2. **Authentication**: Implement JWT + refresh tokens
3. **Authorization**: Add role-based access control
4. **Data Validation**: Server-side validation for all inputs
5. **Rate Limiting**: Implement rate limiting on API endpoints
6. **CORS**: Configure proper CORS policy
7. **Database**: Use parameterized queries to prevent SQL injection
8. **File Upload**: Validate file types and sizes
9. **Password**: Hash passwords with bcrypt, min 12 characters
10. **HTTPS**: Enforce HTTPS in production

---

## 📊 DATA RELATIONSHIPS

```
User (1) ──────────────────── (N) Project
                                    │
                                    ├── Template
                                    └── (N) Scene
                                         └── (0-1) Image/Video


Template (1) ──────── (N) Template Components
       │
       └── Template Preview/Thumbnail
```

---

## ✅ NEXT STEPS

1. **Create backend project** (Node.js + Express + PostgreSQL)
2. **Implement authentication** (JWT, user signup/login)
3. **Build database schema** (using the SQL provided above)
4. **Create API endpoints** (CRUD for all resources)
5. **Update frontend** to use real API instead of mock data
6. **Add error handling** & loading states
7. **Implement project save/export**
8. **Set up video rendering pipeline**
9. **Add comprehensive testing**
10. **Deploy to production**

---

## 📝 SUMMARY TABLE

| Aspect | Current State | Required | Gap Level |
|--------|--------------|----------|-----------|
| **Frontend UI** | ✅ Complete | ✅ Done | None |
| **Backend** | ❌ Missing | 🔴 Required | Critical |
| **Database** | ❌ Missing | 🔴 Required | Critical |
| **Authentication** | ❌ Mock | 🔴 Required | Critical |
| **Data Persistence** | ❌ In-memory | 🔴 Required | Critical |
| **Video Export** | ❌ Missing | 🟡 High | High |
| **Image Upload** | ❌ Missing | 🟡 High | High |
| **Scene Reordering** | ⚠️ UI only | 🟡 High | High |
| **Voiceover** | ⚠️ Type only | 🟡 High | Medium |
| **Search/Filter** | ⚠️ UI only | 🟢 Medium | Medium |

