# BowlersNetwork Backend API

Node.js backend API for the BowlersNetwork Feature Tracker application with MongoDB for data storage and Cloudinary for file attachments.

## 🚀 Features

- **Authentication System**: JWT-based auth with single super admin
- **Feature Management**: Full CRUD operations for features
- **File Upload**: Cloudinary integration for attachments
- **Security**: Helmet, rate limiting, input validation
- **Database**: MongoDB with Mongoose ODM
- **Validation**: Express-validator for input validation

## 📦 Installation

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables in `.env`:
```env
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your-super-secret-jwt-key
PORT=5000
NODE_ENV=development

# Admin credentials
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=admin123

# Cloudinary configuration
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

4. Initialize the database with sample data:
```bash
npm run init-db
```

5. Start the development server:
```bash
npm run dev
```

The API will be available at `http://localhost:5000`

## 🛠 API Endpoints

### Authentication
- `POST /api/auth/login` - Login with admin credentials
- `GET /api/auth/me` - Get current user info
- `POST /api/auth/logout` - Logout user
- `POST /api/auth/verify-token` - Verify JWT token

### Features
- `GET /api/features` - Get all features (with filtering, pagination)
- `GET /api/features/stats` - Get feature statistics
- `GET /api/features/:id` - Get single feature
- `POST /api/features` - Create new feature (Admin only)
- `PUT /api/features/:id` - Update feature (Admin only)
- `DELETE /api/features/:id` - Delete feature (Admin only)
- `DELETE /api/features/:id/attachments/:attachmentId` - Delete attachment (Admin only)

### File Upload
- `POST /api/upload/feature/:id/attachments` - Upload attachments to feature (Admin only)
- `POST /api/upload/single` - Upload single file (Admin only)
- `DELETE /api/upload/file/:publicId` - Delete file from Cloudinary (Admin only)

### Health Check
- `GET /api/health` - API health status

## 🔒 Authentication

The system uses a single super admin approach:
- Only one admin user with credentials from environment variables
- No signup endpoint - admin is created automatically
- JWT tokens with 7-day expiration
- All users except admin are viewers (read-only access)

### Admin Login
```json
POST /api/auth/login
Content-Type: application/json

{
  "email": "admin@example.com",
  "password": "admin123"
}
```

Response:
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "jwt_token_here",
    "user": {
      "id": "user_id",
      "email": "admin@example.com",
      "name": "Super Admin",
      "role": "admin"
    }
  }
}
```

## 📁 File Upload

Files are uploaded to Cloudinary with the following restrictions:
- **Max file size**: 10MB per file
- **Max files per upload**: 5 files
- **Allowed formats**: 
  - Images: JPG, JPEG, PNG, GIF
  - Documents: PDF, DOC, DOCX, XLS, XLSX, PPT, PPTX

### Upload Example
```bash
curl -X POST \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -F "attachments=@file1.pdf" \
  -F "attachments=@file2.png" \
  http://localhost:5000/api/upload/feature/FEATURE_ID/attachments
```

## 🗄 Database Schema

### Feature Model
```javascript
{
  name: String (required, max 200 chars),
  description: String (required, max 1000 chars),
  purpose: String (required, max 2000 chars),
  implementation: String (required, max 3000 chars),
  technicalDetails: String (required, max 3000 chars),
  status: Enum ['planned', 'in-progress', 'completed', 'on-hold'],
  priority: Enum ['low', 'medium', 'high', 'critical'],
  tags: Array of Strings (max 10 tags, 50 chars each),
  attachments: Array of Attachment objects,
  author: String (default: 'Development Team'),
  createdAt: Date,
  updatedAt: Date
}
```

### Attachment Model
```javascript
{
  fileName: String (required),
  fileType: String (required),
  fileSize: Number (required),
  url: String (required),
  publicId: String (required, for Cloudinary),
  uploadedAt: Date
}
```

## 🔧 Development

### Project Structure
```
backend/
├── config/
│   ├── database.js      # MongoDB connection
│   └── cloudinary.js    # Cloudinary configuration
├── middleware/
│   ├── auth.js          # Authentication middleware
│   └── validation.js    # Input validation
├── models/
│   ├── Feature.js       # Feature data model
│   └── User.js          # User data model
├── routes/
│   ├── auth.js          # Authentication routes
│   ├── features.js      # Feature CRUD routes
│   └── upload.js        # File upload routes
├── scripts/
│   └── initDb.js        # Database initialization
├── .env                 # Environment variables
├── package.json         # Dependencies and scripts
└── server.js           # Main application file
```

### Environment Variables
All sensitive configuration is stored in environment variables:
- Database connection strings
- JWT secrets
- Admin credentials
- Cloudinary API keys

### Security Features
- Helmet for security headers
- CORS configuration
- Rate limiting (100 requests per 15 minutes)
- Input validation and sanitization
- JWT authentication
- File type validation for uploads

## 🐛 Error Handling

The API uses consistent error response format:
```json
{
  "success": false,
  "message": "Error description",
  "errors": [] // Optional validation errors
}
```

Common HTTP status codes:
- `200` - Success
- `201` - Created
- `400` - Bad Request / Validation Error
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Internal Server Error

## 📊 Database Initialization

Run the initialization script to populate the database with sample data:

```bash
npm run init-db
```

This will:
- Clear existing features
- Create 5 sample features
- Create the admin user
- Set up database indexes

## 🔄 API Integration

For frontend integration, the API expects:
- JWT token in Authorization header: `Bearer YOUR_TOKEN`
- JSON content type for POST/PUT requests
- Multipart form data for file uploads

Example API call from frontend:
```javascript
const response = await fetch('/api/features', {
  method: 'GET',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  }
});
```

## 🚀 Production Deployment

1. Set `NODE_ENV=production` in environment
2. Update CORS origins for production domains
3. Use environment variables for all secrets
4. Set up proper MongoDB Atlas connection
5. Configure Cloudinary for production
6. Set up proper logging and monitoring

## 📝 License

This project is part of the BowlersNetwork ecosystem development.
