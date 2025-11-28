# TaskFlow - Complete MERN Capstone Project

## 📋 Project Description

TaskFlow is a real-time collaborative task management application built with the MERN stack. It allows teams to create projects, manage tasks, assign work to team members, and communicate through comments. The application features real-time updates using Socket.io, ensuring all team members see changes instantly.

## ✨ Key Features

- 🔐 **User Authentication** - JWT-based secure authentication
- 📊 **Project Management** - Create and manage multiple projects
- ✅ **Task Management** - Create, assign, and track tasks with priorities and deadlines
- 💬 **Real-time Comments** - Discuss tasks with team members
- ⚡ **Live Updates** - Socket.io powered real-time synchronization
- 👥 **Team Collaboration** - Add members to projects with different roles
- 🎨 **Responsive Design** - Works seamlessly on all devices
- 🔍 **Advanced Filtering** - Filter tasks by status, priority, assignee
- 📱 **Dashboard Analytics** - View project progress at a glance

## 🛠️ Technologies Used

### Backend
- Node.js & Express.js
- MongoDB & Mongoose
- Socket.io for real-time features
- JWT for authentication
- Bcrypt for password hashing
- Express-validator for input validation
- Jest & Supertest for testing

### Frontend
- React 18
- React Router v6
- Axios for API calls
- Socket.io-client
- Lucide React for icons
- React Hot Toast for notifications
- Date-fns for date formatting

## 📁 Project Structure

```
taskflow/
├── backend/
│   ├── config/          # Database configuration
│   ├── models/          # Mongoose schemas
│   ├── controllers/     # Route controllers
│   ├── routes/          # API routes
│   ├── middleware/      # Custom middleware
│   ├── utils/           # Utility functions
│   ├── tests/           # Test files
│   └── server.js        # Entry point
├── frontend/
│   ├── public/
│   └── src/
│       ├── components/  # React components
│       ├── context/     # Context providers
│       ├── services/    # API services
│       ├── hooks/       # Custom hooks
│       └── App.jsx      # Main app component
└── README.md
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/taskflow.git
cd taskflow
```

2. **Backend Setup**
```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your configuration
npm run dev
```

3. **Frontend Setup**
```bash
cd frontend
npm install
cp .env.example .env
# Edit .env with your configuration
npm start
```

### Environment Variables

**Backend (.env)**
```
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb://localhost:27017/taskflow
JWT_SECRET=your_jwt_secret_here
JWT_EXPIRE=7d
CLIENT_URL=http://localhost:3000
```

**Frontend (.env)**
```
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_SOCKET_URL=http://localhost:5000
```

## 🧪 Running Tests

```bash
cd backend
npm test
```

## 📚 API Documentation

### Authentication Endpoints

#### Register User
```
POST /api/auth/register
Body: { name, email, password }
Response: { success, data: { user }, token }
```

#### Login
```
POST /api/auth/login
Body: { email, password }
Response: { success, data: { user }, token }
```

#### Get Current User
```
GET /api/auth/me
Headers: Authorization: Bearer <token>
Response: { success, data: { user } }
```

### Projects Endpoints

#### Get All Projects
```
GET /api/projects
Headers: Authorization: Bearer <token>
Response: { success, count, data: [projects] }
```

#### Create Project
```
POST /api/projects
Headers: Authorization: Bearer <token>
Body: { name, description, status?, color?, deadline? }
Response: { success, data: { project } }
```

#### Update Project
```
PUT /api/projects/:id
Headers: Authorization: Bearer <token>
Body: { name?, description?, status?, color?, deadline? }
Response: { success, data: { project } }
```

#### Add Member to Project
```
POST /api/projects/:id/members
Headers: Authorization: Bearer <token>
Body: { email, role }
Response: { success, data: { project } }
```

### Tasks Endpoints

#### Get Tasks
```
GET /api/tasks?project=:projectId&status=:status
Headers: Authorization: Bearer <token>
Response: { success, count, data: [tasks] }
```

#### Create Task
```
POST /api/tasks
Headers: Authorization: Bearer <token>
Body: { title, description?, project, assignedTo?, priority?, dueDate? }
Response: { success, data: { task } }
```

#### Update Task
```
PUT /api/tasks/:id
Headers: Authorization: Bearer <token>
Body: { title?, description?, status?, priority?, assignedTo?, dueDate? }
Response: { success, data: { task } }
```

### Comments Endpoints

#### Get Comments
```
GET /api/comments?task=:taskId
Headers: Authorization: Bearer <token>
Response: { success, count, data: [comments] }
```

#### Create Comment
```
POST /api/comments
Headers: Authorization: Bearer <token>
Body: { content, task }
Response: { success, data: { comment } }
```

## 🔌 Socket.io Events

### Client -> Server
- `join:project` - Join a project room
- `leave:project` - Leave a project room
- `typing:start` - User started typing
- `typing:stop` - User stopped typing

### Server -> Client
- `project:created` - New project created
- `project:updated` - Project updated
- `project:deleted` - Project deleted
- `task:created` - New task created
- `task:updated` - Task updated
- `task:deleted` - Task deleted
- `comment:created` - New comment added
- `user:typing` - User is typing
- `user:stopped-typing` - User stopped typing

## 🚀 Deployment

### Backend (Railway/Render)
1. Create account on Railway or Render
2. Create new web service from GitHub repo
3. Set environment variables
4. Deploy

### Frontend (Vercel/Netlify)
1. Create account on Vercel or Netlify
2. Import GitHub repository
3. Set build command: `npm run build`
4. Set publish directory: `build`
5. Add environment variables
6. Deploy

## 📸 Screenshots

*Add screenshots of your application here*

## 🎥 Video Demonstration

Link to video: [Your Video URL]

## 🧪 Testing Coverage

- Authentication tests (register, login, protected routes)
- Project CRUD operations
- Task management
- Authorization checks
- Input validation

## 🔒 Security Features

- Password hashing with bcrypt
- JWT token authentication
- Protected API routes
- Input validation and sanitization
- Rate limiting
- Helmet for security headers
- CORS configuration

## 📈 Future Enhancements

- File attachments for tasks
- Drag-and-drop task boards
- Email notifications
- Calendar view
- Advanced analytics
- Mobile app
- Dark mode

## 👥 Team (if applicable)

- Your Name - Full Stack Developer

## 📄 License

MIT License

## 🙏 Acknowledgments

- MongoDB Documentation
- Express.js Documentation
- React Documentation
- Socket.io Documentation

---

## Additional Files Needed

### frontend/src/App.jsx

```jsx
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import { SocketProvider } from './context/SocketContext';

import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import Dashboard from './components/Dashboard/Dashboard';
import ProjectDetail from './components/Projects/ProjectDetail';
import Navbar from './components/Layout/Navbar';

const PrivateRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }
  
  return isAuthenticated ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <SocketProvider>
          <Toaster position="top-right" />
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route
              path="/dashboard"
              element={
                <PrivateRoute>
                  <>
                    <Navbar />
                    <Dashboard />
                  </>
                </PrivateRoute>
              }
            />
            <Route
              path="/projects/:id"
              element={
                <PrivateRoute>
                  <>
                    <Navbar />
                    <ProjectDetail />
                  </>
                </PrivateRoute>
              }
            />
            <Route path="/" element={<Navigate to="/dashboard" />} />
          </Routes>
        </SocketProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
```

### frontend/src/App.css

```css
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
    'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
    sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
}

/* Custom scrollbar */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
}

::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: #555;
}
```

### .gitignore

```
# Dependencies
node_modules/
/.pnp
.pnp.js

# Testing
/coverage

# Production
/build
/dist

# Environment
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# IDE
.vscode/
.idea/
*.swp
*.swo
*~

# Logs
npm-debug.log*
yarn-debug.log*
yarn-error.log*
logs/
*.log

# OS
.DS_Store
Thumbs.db

# Misc
.cache
```

## Submission Checklist

- [ ] Complete source code pushed to GitHub
- [ ] README.md with setup instructions
- [ ] .env.example files included
- [ ] Application deployed and accessible
- [ ] Video demonstration recorded (5-10 minutes)
- [ ] Tests written and passing
- [ ] API documentation included
- [ ] Screenshots added to README
- [ ] All features working correctly

## Grading Criteria

1. **Functionality (40%)**
   - All features work as expected
   - No critical bugs
   - Proper error handling

2. **Code Quality (25%)**
   - Clean, readable code
   - Proper structure and organization
   - Following best practices

3. **Testing (15%)**
   - Comprehensive test coverage
   - All tests passing

4. **Documentation (10%)**
   - Clear README
   - API documentation
   - Code comments where needed

5. **Deployment (10%)**
   - Successfully deployed
   - Accessible online
   - Environment properly configured