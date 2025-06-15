# BowlersNetwork Backend API Testing

This file contains example API calls for testing the backend functionality.

## Environment
- Backend URL: http://localhost:5000
- Admin Email: admin@example.com
- Admin Password: admin123

## 1. Health Check
```bash
curl http://localhost:5000/api/health
```

## 2. Login (Get JWT Token)
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "admin123"
  }'
```

## 3. Get All Features (Public)
```bash
curl http://localhost:5000/api/features
```

## 4. Get Features with Filters
```bash
# Filter by status
curl "http://localhost:5000/api/features?status=completed"

# Filter by priority
curl "http://localhost:5000/api/features?priority=high"

# Search features
curl "http://localhost:5000/api/features?search=player"

# Pagination
curl "http://localhost:5000/api/features?page=1&limit=5"
```

## 5. Get Feature Statistics
```bash
curl http://localhost:5000/api/features/stats
```

## 6. Get Single Feature
```bash
curl http://localhost:5000/api/features/FEATURE_ID
```

## 7. Create New Feature (Admin Only)
```bash
# First get JWT token from login, then:
curl -X POST http://localhost:5000/api/features \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "name": "New Feature",
    "description": "Description of the new feature",
    "purpose": "Why this feature is needed",
    "implementation": "How we are building it",
    "technicalDetails": "Technical implementation details",
    "status": "planned",
    "priority": "medium",
    "tags": ["new", "feature"],
    "author": "Development Team"
  }'
```

## 8. Update Feature (Admin Only)
```bash
curl -X PUT http://localhost:5000/api/features/FEATURE_ID \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "status": "in-progress",
    "priority": "high"
  }'
```

## 9. Upload Attachments (Admin Only)
```bash
curl -X POST http://localhost:5000/api/upload/feature/FEATURE_ID/attachments \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -F "attachments=@document.pdf" \
  -F "attachments=@image.png"
```

## 10. Delete Feature (Admin Only)
```bash
curl -X DELETE http://localhost:5000/api/features/FEATURE_ID \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## Response Examples

### Successful Login Response
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "user_id",
      "email": "admin@example.com",
      "name": "Super Admin",
      "role": "admin",
      "lastLogin": "2024-01-01T00:00:00.000Z"
    }
  }
}
```

### Features List Response
```json
{
  "success": true,
  "data": {
    "features": [
      {
        "_id": "feature_id",
        "name": "Player Profile Management",
        "description": "Comprehensive player profile system...",
        "purpose": "Enable players to track their bowling performance...",
        "implementation": "Built using React components...",
        "technicalDetails": "Frontend: React, TypeScript...",
        "status": "completed",
        "priority": "high",
        "tags": ["player-management", "analytics"],
        "author": "Development Team",
        "attachments": [],
        "createdAt": "2024-01-01T00:00:00.000Z",
        "updatedAt": "2024-01-01T00:00:00.000Z"
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 1,
      "totalFeatures": 5,
      "hasNextPage": false,
      "hasPrevPage": false,
      "limit": 10
    }
  }
}
```

### Error Response
```json
{
  "success": false,
  "message": "Invalid credentials"
}
```

## Notes
- Replace `YOUR_JWT_TOKEN` with the actual token from login response
- Replace `FEATURE_ID` with actual feature MongoDB ObjectId
- All protected routes require `Authorization: Bearer TOKEN` header
- File uploads use `multipart/form-data` content type
- API uses JSON for all other endpoints
