# API Integration Setup Guide

## ✅ Backend Server Status
- **Server**: Running on `http://localhost:4000`
- **Database**: MySQL connected successfully
- **CORS**: Configured for frontend communication
- **All Routes**: Properly configured and working

## 🔧 Configuration Changes Made

### 1. Backend Configuration
- ✅ Fixed Prisma schema for MySQL compatibility
- ✅ Generated Prisma client successfully
- ✅ Created local MySQL database `hairstylist`
- ✅ All database tables created
- ✅ Server running on port 4000

### 2. Frontend Configuration
- ✅ Updated API client to use port 4000
- ✅ Updated env.example with correct API URL
- ✅ CORS configured for frontend-backend communication

## 📡 API Endpoints Available

### Authentication (`/api/auth`)
- `POST /api/auth/signup` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/profile` - Update user profile
- `PUT /api/auth/change-password` - Change password
- `POST /api/auth/forgot-password` - Forgot password
- `POST /api/auth/reset-password` - Reset password

### Workshops (`/api/workshops`)
- `GET /api/workshops` - Get all workshops
- `GET /api/workshops/:id` - Get workshop by ID
- `POST /api/workshops/:id/register` - Register for workshop
- `DELETE /api/workshops/:id/unregister` - Unregister from workshop
- `GET /api/workshops/my/registrations` - Get user registrations

### Community (`/api/community`)
- `GET /api/community/posts` - Get all posts
- `GET /api/community/posts/:id` - Get post by ID
- `POST /api/community/posts` - Create post
- `PUT /api/community/posts/:id` - Update post
- `DELETE /api/community/posts/:id` - Delete post
- `POST /api/community/posts/:id/like` - Like post
- `DELETE /api/community/posts/:id/like` - Unlike post
- `GET /api/community/posts/:id/comments` - Get comments
- `POST /api/community/posts/:id/comments` - Create comment

### Gallery (`/api/gallery`)
- `GET /api/gallery/hairstyles` - Get all hairstyles
- `GET /api/gallery/hairstyles/:id` - Get hairstyle by ID
- `POST /api/gallery/hairstyles/:id/favorite` - Favorite hairstyle
- `DELETE /api/gallery/hairstyles/:id/favorite` - Unfavorite hairstyle
- `GET /api/gallery/favorites` - Get user favorites
- `POST /api/gallery/upload` - Upload image

### Tutorials (`/api/tutorials`)
- `GET /api/tutorials` - Get all tutorials
- `GET /api/tutorials/:id` - Get tutorial by ID
- `GET /api/tutorials/:id/progress` - Get tutorial progress
- `PUT /api/tutorials/:id/progress` - Update progress
- `POST /api/tutorials/:id/favorite` - Favorite tutorial
- `DELETE /api/tutorials/:id/favorite` - Unfavorite tutorial

### Chat (`/api/chat`)
- `POST /api/chat/send` - Send message
- `GET /api/chat/sessions` - Get chat sessions
- `GET /api/chat/sessions/:id` - Get session by ID
- `DELETE /api/chat/sessions/:id` - Delete session

## 🧪 Testing API Integration

### 1. Health Check
```bash
curl http://localhost:4000/health
```

### 2. Test Authentication
```bash
# Signup
curl -X POST http://localhost:4000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"password123","confirmPassword":"password123"}'

# Login
curl -X POST http://localhost:4000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

### 3. Frontend Integration Test
Visit: `http://localhost:3000/test-integration` to run the API integration test component.

## 🔑 Environment Variables

### Backend (.env)
```env
DATABASE_URL="mysql://root:@localhost:3306/hairstylist"
JWT_SECRET="your-super-secret-jwt-key-here"
PORT=4000
NODE_ENV="development"
FRONTEND_URL="http://localhost:3000"
```

### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL=http://localhost:4000
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## 🚀 Starting the Applications

### Backend
```bash
cd hairstylist-backend
npm start
```

### Frontend
```bash
cd hairstylist
npm run dev
```

## 📊 Database Schema

The following tables have been created:
- `users` - User accounts and profiles
- `workshops` - Workshop information
- `workshop_registrations` - User workshop registrations
- `hairstyles` - Hairstyle gallery
- `hairstyle_favorites` - User favorites
- `tutorials` - Video tutorials
- `tutorial_progress` - User progress tracking
- `posts` - Community posts
- `comments` - Post comments
- `likes` - Post/comment likes
- `chat_sessions` - AI chat sessions
- `notifications` - User notifications

## 🔧 Troubleshooting

### Common Issues:
1. **Port conflicts**: Ensure port 4000 is available for backend
2. **Database connection**: Verify MySQL is running and database exists
3. **CORS errors**: Check that frontend URL is correctly configured
4. **Authentication**: Ensure JWT secret is set

### Debug Commands:
```bash
# Check if backend is running
netstat -an | findstr :4000

# Check database connection
npx prisma studio

# Test API endpoints
curl http://localhost:4000/health
```

## ✅ Integration Status
- ✅ Backend server running
- ✅ Database connected
- ✅ All API routes configured
- ✅ CORS properly set up
- ✅ Frontend API client configured
- ✅ Ready for development and testing
