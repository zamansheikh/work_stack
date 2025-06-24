# BowlersNetwork Backend API Testing

This file contains example API calls for testing the backend functionality.

## Environment
- Backend URL: http://localhost:5000
- Admin Email: admin@example.com
- Admin Password: admin123
- Super Admin Email: superadmin@example.com
- Super Admin Password: superadmin123

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

## 11. Super Admin - Get All Users
```bash
curl http://localhost:5000/api/admin/users \
  -H "Authorization: Bearer YOUR_SUPER_ADMIN_JWT_TOKEN"
```

## 12. Super Admin - Create New User
```bash
curl -X POST http://localhost:5000/api/admin/users \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_SUPER_ADMIN_JWT_TOKEN" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123",
    "role": "admin"
  }'
```

## 13. Super Admin - Enable/Disable User
```bash
# Enable user
curl -X PATCH http://localhost:5000/api/admin/users/USER_ID/toggle \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_SUPER_ADMIN_JWT_TOKEN" \
  -d '{
    "enabled": true
  }'

# Disable user
curl -X PATCH http://localhost:5000/api/admin/users/USER_ID/toggle \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_SUPER_ADMIN_JWT_TOKEN" \
  -d '{
    "enabled": false
  }'
```

## 14. Super Admin - Get User Details
```bash
curl http://localhost:5000/api/admin/users/USER_ID \
  -H "Authorization: Bearer YOUR_SUPER_ADMIN_JWT_TOKEN"
```

## 15. Super Admin - Update User
```bash
curl -X PUT http://localhost:5000/api/admin/users/USER_ID \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_SUPER_ADMIN_JWT_TOKEN" \
  -d '{
    "name": "Updated Name",
    "email": "updated@example.com",
    "role": "admin"
  }'
```

## 16. Super Admin - Delete User
```bash
curl -X DELETE http://localhost:5000/api/admin/users/USER_ID \
  -H "Authorization: Bearer YOUR_SUPER_ADMIN_JWT_TOKEN"
```

## 17. Change Password (Any Authenticated User)
```bash
curl -X PUT http://localhost:5000/api/auth/change-password \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "currentPassword": "oldpassword123",
    "newPassword": "newpassword123"
  }'
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

### Users List Response (Super Admin)
```json
{
  "success": true,
  "data": {
    "users": [
      {
        "_id": "user_id_1",
        "name": "John Doe",
        "email": "john@example.com",
        "role": "admin",
        "enabled": true,
        "createdAt": "2024-01-01T00:00:00.000Z",
        "updatedAt": "2024-01-01T00:00:00.000Z",
        "lastLogin": "2024-01-02T10:30:00.000Z"
      },
      {
        "_id": "user_id_2",
        "name": "Jane Smith",
        "email": "jane@example.com",
        "role": "admin",
        "enabled": false,
        "createdAt": "2024-01-01T00:00:00.000Z",
        "updatedAt": "2024-01-03T14:20:00.000Z",
        "lastLogin": "2024-01-01T09:15:00.000Z"
      }
    ],
    "totalUsers": 2
  }
}
```

### Create User Response (Super Admin)
```json
{
  "success": true,
  "message": "User created successfully",
  "data": {
    "user": {
      "id": "new_user_id",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "admin",
      "enabled": true,
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  }
}
```

### Toggle User Status Response (Super Admin)
```json
{
  "success": true,
  "message": "User disabled successfully",
  "data": {
    "user": {
      "id": "user_id",
      "name": "John Doe",
      "email": "john@example.com",
      "enabled": false
    }
  }
}
```

### Change Password Response
```json
{
  "success": true,
  "message": "Password changed successfully"
}
```

### Change Password Error Response
```json
{
  "success": false,
  "message": "Current password is incorrect"
}
```

### Error Response
```json
{
  "success": false,
  "message": "Invalid credentials"
}
```

### Disabled User Login Error
```json
{
  "success": false,
  "message": "Account is disabled. Please contact administrator."
}
```

### Access Denied Error
```json
{
  "success": false,
  "message": "Access denied. Super Admin privileges required."
}
```

## Notes
- Replace `YOUR_JWT_TOKEN` with the actual token from login response
- Replace `YOUR_SUPER_ADMIN_JWT_TOKEN` with the actual token for super admin
- Replace `FEATURE_ID` with actual feature MongoDB ObjectId
- Replace `USER_ID` with actual user MongoDB ObjectId
- All protected routes require `Authorization: Bearer TOKEN` header
- File uploads use `multipart/form-data` content type
- API uses JSON for all other endpoints
