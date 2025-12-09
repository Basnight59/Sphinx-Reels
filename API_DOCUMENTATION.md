# API Documentation

Complete REST API reference for Sphinx-Reels backend.

Base URL: `http://localhost:5000/api`

## Authentication Endpoints

### Register User
**POST** `/auth/register`

Create a new user account.

**Request:**
```json
{
  "email": "user@example.com",
  "name": "John Doe",
  "password": "SecurePass123"
}
```

**Requirements:**
- Email must be unique
- Password: min 8 chars, 1 uppercase, 1 lowercase, 1 digit

**Response:** (201 Created)
```json
{
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "name": "John Doe"
  },
  "tokens": {
    "accessToken": "eyJhbGc...",
    "refreshToken": "eyJhbGc..."
  }
}
```

---

### Login User
**POST** `/auth/login`

Authenticate and get tokens.

**Request:**
```json
{
  "email": "user@example.com",
  "password": "SecurePass123"
}
```

**Response:** (200 OK)
```json
{
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "name": "John Doe"
  },
  "tokens": {
    "accessToken": "eyJhbGc...",
    "refreshToken": "eyJhbGc..."
  }
}
```

---

### Refresh Token
**POST** `/auth/refresh-token`

Get a new access token using refresh token.

**Request:**
```json
{
  "refreshToken": "eyJhbGc..."
}
```

**Response:** (200 OK)
```json
{
  "tokens": {
    "accessToken": "eyJhbGc...",
    "refreshToken": "eyJhbGc..."
  }
}
```

---

### Logout
**POST** `/auth/logout`

Logout and invalidate refresh token.

**Headers:**
```
Authorization: Bearer <accessToken>
```

**Request:**
```json
{
  "refreshToken": "eyJhbGc..."
}
```

**Response:** (200 OK)
```json
{
  "message": "Logged out successfully"
}
```

---

### Get Current User
**GET** `/auth/me`

Get logged-in user information.

**Headers:**
```
Authorization: Bearer <accessToken>
```

**Response:** (200 OK)
```json
{
  "id": "uuid",
  "email": "user@example.com",
  "name": "John Doe",
  "avatar": null,
  "subscriptionTier": "free",
  "createdAt": "2025-12-09T12:00:00Z"
}
```

---

## Template Endpoints

### List Templates
**GET** `/templates`

Get all published templates with optional filtering.

**Query Parameters:**
- `category` (optional): Filter by category (Educational, Inspiration, Storytime, Promotional, Social)
- `search` (optional): Search by name or description

**Example:**
```
GET /templates?category=Educational&search=facts
```

**Response:** (200 OK)
```json
[
  {
    "id": "uuid",
    "name": "Viral Facts Dark",
    "category": "Educational",
    "description": "Dark themed template...",
    "thumbnailUrl": "https://...",
    "defaultDuration": 3,
    "createdAt": "2025-12-09T12:00:00Z"
  }
]
```

---

### Get Template Details
**GET** `/templates/:id`

Get a specific template.

**Parameters:**
- `id` (required): Template ID

**Response:** (200 OK)
```json
{
  "id": "uuid",
  "name": "Viral Facts Dark",
  "category": "Educational",
  "description": "...",
  "thumbnailUrl": "https://...",
  "layoutConfig": { },
  "defaultDuration": 3,
  "isPublished": true,
  "createdBy": "creator-uuid",
  "createdAt": "2025-12-09T12:00:00Z",
  "updatedAt": "2025-12-09T12:00:00Z"
}
```

---

### Create Template
**POST** `/templates`

Create a new template (admin only).

**Headers:**
```
Authorization: Bearer <accessToken>
Content-Type: application/json
```

**Request:**
```json
{
  "name": "My Template",
  "category": "Educational",
  "description": "Template description",
  "thumbnailUrl": "https://...",
  "layoutConfig": { },
  "defaultDuration": 3
}
```

**Response:** (201 Created)
```json
{
  "id": "uuid",
  "name": "My Template",
  "category": "Educational",
  "createdBy": "user-uuid",
  "createdAt": "2025-12-09T12:00:00Z"
}
```

---

## Project Endpoints

### List Projects
**GET** `/projects`

Get all projects for authenticated user.

**Headers:**
```
Authorization: Bearer <accessToken>
```

**Response:** (200 OK)
```json
[
  {
    "id": "uuid",
    "userId": "user-uuid",
    "name": "My Video",
    "description": "A test project",
    "thumbnailUrl": "https://...",
    "status": "draft",
    "templateId": "template-uuid",
    "renderingProgress": 0,
    "createdAt": "2025-12-09T12:00:00Z",
    "updatedAt": "2025-12-09T12:00:00Z",
    "scenes": [
      {
        "id": "scene-uuid",
        "projectId": "project-uuid",
        "sceneOrder": 1,
        "text": "Scene text",
        "imageUrl": "https://...",
        "duration": 3,
        "createdAt": "2025-12-09T12:00:00Z"
      }
    ]
  }
]
```

---

### Create Project
**POST** `/projects`

Create a new video project.

**Headers:**
```
Authorization: Bearer <accessToken>
```

**Request:**
```json
{
  "name": "My Video",
  "description": "A test project",
  "templateId": "template-uuid"
}
```

**Response:** (201 Created)
```json
{
  "id": "uuid",
  "userId": "user-uuid",
  "name": "My Video",
  "description": "A test project",
  "status": "draft",
  "templateId": "template-uuid",
  "scenes": [],
  "createdAt": "2025-12-09T12:00:00Z",
  "updatedAt": "2025-12-09T12:00:00Z"
}
```

---

### Get Project Details
**GET** `/projects/:id`

Get a specific project with all scenes.

**Headers:**
```
Authorization: Bearer <accessToken>
```

**Parameters:**
- `id` (required): Project ID

**Response:** (200 OK)
```json
{
  "id": "uuid",
  "userId": "user-uuid",
  "name": "My Video",
  "status": "draft",
  "scenes": [
    {
      "id": "scene-uuid",
      "projectId": "project-uuid",
      "sceneOrder": 1,
      "text": "Scene text",
      "imageUrl": "https://...",
      "duration": 3,
      "voiceoverUrl": null,
      "voiceoverText": null,
      "aiGenerated": false,
      "createdAt": "2025-12-09T12:00:00Z",
      "updatedAt": "2025-12-09T12:00:00Z"
    }
  ],
  "template": {
    "id": "template-uuid",
    "name": "Viral Facts Dark"
  },
  "createdAt": "2025-12-09T12:00:00Z",
  "updatedAt": "2025-12-09T12:00:00Z"
}
```

---

### Update Project
**PUT** `/projects/:id`

Update project details.

**Headers:**
```
Authorization: Bearer <accessToken>
```

**Parameters:**
- `id` (required): Project ID

**Request:**
```json
{
  "name": "Updated Name",
  "description": "Updated description",
  "status": "draft",
  "thumbnailUrl": "https://..."
}
```

**Response:** (200 OK)
```json
{
  "id": "uuid",
  "name": "Updated Name",
  "description": "Updated description",
  "status": "draft",
  "updatedAt": "2025-12-09T12:01:00Z"
}
```

---

### Delete Project
**DELETE** `/projects/:id`

Soft delete a project (moves to trash).

**Headers:**
```
Authorization: Bearer <accessToken>
```

**Parameters:**
- `id` (required): Project ID

**Response:** (200 OK)
```json
{
  "message": "Project deleted successfully"
}
```

---

### Duplicate Project
**POST** `/projects/:id/duplicate`

Create a copy of an existing project.

**Headers:**
```
Authorization: Bearer <accessToken>
```

**Parameters:**
- `id` (required): Project ID to duplicate

**Response:** (201 Created)
```json
{
  "id": "new-uuid",
  "userId": "user-uuid",
  "name": "My Video (Copy)",
  "scenes": [
    // All scenes from original project
  ],
  "createdAt": "2025-12-09T12:00:00Z"
}
```

---

## Scene Endpoints

### List Scenes
**GET** `/scenes/:projectId/scenes`

Get all scenes in a project.

**Headers:**
```
Authorization: Bearer <accessToken>
```

**Parameters:**
- `projectId` (required): Project ID

**Response:** (200 OK)
```json
[
  {
    "id": "scene-uuid",
    "projectId": "project-uuid",
    "sceneOrder": 1,
    "text": "Scene text",
    "imageUrl": "https://...",
    "videoUrl": null,
    "duration": 3.0,
    "voiceoverUrl": null,
    "voiceoverText": null,
    "aiGenerated": false,
    "createdAt": "2025-12-09T12:00:00Z",
    "updatedAt": "2025-12-09T12:00:00Z"
  }
]
```

---

### Add Scene
**POST** `/scenes/:projectId/scenes`

Add a new scene to a project.

**Headers:**
```
Authorization: Bearer <accessToken>
```

**Parameters:**
- `projectId` (required): Project ID

**Request:**
```json
{
  "text": "Scene narration text",
  "imageUrl": "https://...",
  "videoUrl": "https://...",
  "duration": 3.5,
  "voiceoverUrl": "https://...",
  "voiceoverText": "Voiceover script",
  "aiGenerated": false
}
```

**Response:** (201 Created)
```json
{
  "id": "scene-uuid",
  "projectId": "project-uuid",
  "sceneOrder": 2,
  "text": "Scene narration text",
  "imageUrl": "https://...",
  "duration": 3.5,
  "createdAt": "2025-12-09T12:00:00Z"
}
```

---

### Update Scene
**PUT** `/scenes/:sceneId`

Update scene details.

**Headers:**
```
Authorization: Bearer <accessToken>
```

**Parameters:**
- `sceneId` (required): Scene ID

**Request:**
```json
{
  "text": "Updated text",
  "imageUrl": "https://...",
  "duration": 4.0,
  "voiceoverText": "Updated voiceover"
}
```

**Response:** (200 OK)
```json
{
  "id": "scene-uuid",
  "text": "Updated text",
  "duration": 4.0,
  "updatedAt": "2025-12-09T12:01:00Z"
}
```

---

### Delete Scene
**DELETE** `/scenes/:sceneId`

Delete a scene and reorder remaining scenes.

**Headers:**
```
Authorization: Bearer <accessToken>
```

**Parameters:**
- `sceneId` (required): Scene ID

**Response:** (200 OK)
```json
{
  "message": "Scene deleted successfully"
}
```

---

### Reorder Scenes
**PUT** `/scenes/:projectId/scenes/reorder`

Change the order of scenes in a project.

**Headers:**
```
Authorization: Bearer <accessToken>
```

**Parameters:**
- `projectId` (required): Project ID

**Request:**
```json
{
  "sceneIds": ["scene-uuid-3", "scene-uuid-1", "scene-uuid-2"]
}
```

**Response:** (200 OK)
```json
[
  {
    "id": "scene-uuid-3",
    "sceneOrder": 1,
    "text": "Third scene now first"
  },
  {
    "id": "scene-uuid-1",
    "sceneOrder": 2,
    "text": "First scene now second"
  },
  {
    "id": "scene-uuid-2",
    "sceneOrder": 3,
    "text": "Second scene now third"
  }
]
```

---

## AI Generation Endpoints

### Generate Scenes from Topic
**POST** `/ai/generate-scenes`

Generate video scenes from a topic using AI.

**Headers:**
```
Authorization: Bearer <accessToken>
Content-Type: application/json
```

**Request:**
```json
{
  "topic": "5 benefits of drinking water",
  "type": "educational",
  "count": 3
}
```

**Parameters:**
- `topic` (required): Topic to generate scenes about
- `type` (required): Type of content (motivational, educational, storytime, facts)
- `count` (optional): Number of scenes to generate (default: 3)

**Response:** (200 OK)
```json
{
  "scenes": [
    {
      "text": "Here's an interesting fact about 5 benefits of drinking water - Part 1",
      "duration": 3,
      "imageUrl": "https://picsum.photos/seed/...",
      "aiGenerated": true
    },
    {
      "text": "Here's an interesting fact about 5 benefits of drinking water - Part 2",
      "duration": 3,
      "imageUrl": "https://picsum.photos/seed/...",
      "aiGenerated": true
    },
    {
      "text": "Here's an interesting fact about 5 benefits of drinking water - Part 3",
      "duration": 3,
      "imageUrl": "https://picsum.photos/seed/...",
      "aiGenerated": true
    }
  ],
  "count": 3
}
```

---

## Error Responses

All errors return consistent format:

```json
{
  "error": "Error message describing what went wrong",
  "status": 400
}
```

### Common Error Codes

| Status | Message | Reason |
|--------|---------|--------|
| 400 | Invalid input provided | Request body validation failed |
| 400 | Missing required field | Required field not provided |
| 401 | Unauthorized access | No token or invalid token |
| 401 | Invalid token | Token verification failed |
| 401 | Token has expired | Access token expired |
| 403 | You do not have access | Trying to access another user's data |
| 404 | Resource not found | Project/Scene/Template doesn't exist |
| 409 | Email already registered | Email already exists |
| 500 | Internal server error | Server error |

---

## Authentication Flow

1. **Register**
   ```
   POST /auth/register
   → Returns accessToken + refreshToken
   ```

2. **Use accessToken** in subsequent requests
   ```
   GET /projects
   Headers: Authorization: Bearer <accessToken>
   ```

3. **When accessToken expires**
   ```
   POST /auth/refresh-token
   → Returns new accessToken + refreshToken
   ```

4. **Logout**
   ```
   POST /auth/logout
   → Invalidates refreshToken
   ```

---

## Rate Limiting

API enforces rate limiting:
- **100 requests per 15 minutes** per IP address

If limit exceeded, response:
```
429 Too Many Requests
```

---

## CORS

API accepts requests from configured frontend URL:
- Development: `http://localhost:5173`
- Production: Configured in `FRONTEND_URL` env var

---

## Pagination

Future versions will support pagination. Currently, endpoints return all results.

Example (future):
```
GET /projects?page=1&limit=10
```

---

## Testing with curl

### Register
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"user@test.com","name":"Test","password":"Pass123"}'
```

### Login and Get Token
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@test.com","password":"Pass123"}'
```

### Use Token to Get Projects
```bash
curl -X GET http://localhost:5000/api/projects \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

---

## Webhook Events (Future)

Planned webhook events:
- `project.created` - When project is created
- `project.rendered` - When rendering completes
- `scene.uploaded` - When scene video is uploaded
- `project.shared` - When project is shared

---

## Rate Limits (Future)

Planned tier-based limits:
- **Free**: 5 projects, 50 scenes, 5 AI generations/month
- **Pro**: Unlimited projects, 1000 scenes, 500 AI generations/month
- **Enterprise**: Everything unlimited
