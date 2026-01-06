# Backend Guide - Complete Documentation

This guide explains the backend architecture, API endpoints, data models, and how everything works together.

## 📋 Table of Contents

1. [Overview](#overview)
2. [Project Structure](#project-structure)
3. [Setup & Installation](#setup--installation)
4. [Server Architecture](#server-architecture)
5. [Data Models](#data-models)
6. [API Endpoints](#api-endpoints)
7. [Persistence System](#persistence-system)
8. [Middleware](#middleware)
9. [Error Handling](#error-handling)
10. [Deployment](#deployment)

## 🎯 Overview

The backend is an Express.js REST API that serves:

- Course data (faculties, departments, courses)
- Educational materials (links, lectures, slides, exams)
- User authentication and management
- User activity tracking

**Key Technologies:**

- Express.js - Web framework
- Node.js File System - Data persistence
- CORS - Cross-origin resource sharing

## 📁 Project Structure

```
backend/
├── src/
│   ├── index.js           # Main server file (all routes)
│   ├── database.js        # Data models (in-memory arrays)
│   ├── persistence.js     # File persistence utilities
│   └── users-data.json    # Persistent user data (auto-generated)
├── public/                # Static files (images)
│   ├── eng.jpg
│   ├── medicine.jpg
│   └── art.jpg
└── package.json          # Dependencies
```

## 🚀 Setup & Installation

### 1. Install Dependencies

```bash
cd backend
npm install
```

This installs:

- `express` - Web framework

### 2. Start the Server

```bash
npm start
# or
node src/index.js
```

Server runs on `http://localhost:3000` (or `process.env.PORT` if set)

### 3. Verify It's Working

Visit `http://localhost:3000` - you should see:

```json
{
  "status": "ok",
  "message": "Studx Backend API is running"
}
```

## 🏗 Server Architecture

### Entry Point: `src/index.js`

The server is structured as follows:

```javascript
// 1. Import dependencies
const express = require("express");
const { Faculty, Departments, Courses, Materials, Users } = require("./database");
const { initializeUsers, saveUsers } = require("./persistence");

// 2. Initialize Express app
const app = express();

// 3. Initialize data (load from file or use defaults)
let Users = initializeUsers(defaultUsers);

// 4. Middleware setup
app.use(express.json());        // Parse JSON bodies
app.use(corsMiddleware);        // Enable CORS
app.use(staticFiles);           // Serve images

// 5. Define routes
app.get("/faculty", ...);
app.post("/auth/login", ...);
// ... more routes

// 6. Start server
app.listen(PORT, ...);
```

### Key Components

1. **Express App**: Main application instance
2. **Data Arrays**: In-memory data structures (loaded from files)
3. **Middleware**: CORS, JSON parsing, static files
4. **Routes**: API endpoints
5. **Persistence**: Auto-save user data to file

## 📊 Data Models

All data models are defined in `src/database.js`:

### 1. Faculty

```javascript
{
  id: 1,
  name: "Engineering Faculty",
  image: "eng.jpg"  // Served from /public/
}
```

**Properties:**

- `id` (number) - Unique identifier
- `name` (string) - Faculty name
- `image` (string) - Image filename in public/

### 2. Department

```javascript
{
  id: 1,
  name: "Computer Engineering",
  facultyId: 1  // Links to Faculty
}
```

**Properties:**

- `id` (number) - Unique identifier
- `name` (string) - Department name
- `facultyId` (number) - Parent faculty ID

### 3. Course

```javascript
{
  id: 1,
  name: "Data Structures",
  facultyId: 1,
  departmentId: 1  // null if shared across departments
}
```

**Properties:**

- `id` (number) - Unique identifier
- `name` (string) - Course name
- `facultyId` (number) - Parent faculty
- `departmentId` (number | null) - Specific department or null for shared courses

### 4. Material

```javascript
{
  id: 1,
  courseId: 1,
  type: "SLIDES",  // LINK, LECTURE, SLIDES, EXAM
  title: "MIT 6.006 — Lecture Notes",
  description: "Full set of lecture notes...",
  url: "https://ocw.mit.edu/...",
  upvotes: 12,
  downvotes: 1,
  likedBy: [],      // Array of user IDs
  dislikedBy: []    // Array of user IDs
}
```

**Properties:**

- `id` (number) - Unique identifier
- `courseId` (number) - Parent course
- `type` (string) - Material type
- `title` (string) - Material title
- `description` (string) - Material description
- `url` (string) - Link to material
- `upvotes` (number) - Upvote count
- `downvotes` (number) - Downvote count
- `likedBy` (array) - User IDs who upvoted
- `dislikedBy` (array) - User IDs who downvoted

### 5. User

```javascript
{
  id: 1,
  name: "Ahmed Student",
  email: "ahmed@student.msku.edu.tr",
  password: "password123",  // In production, hash this!
  coursesRecentlyViewed: [
    { courseId: 1, viewedAt: "2026-01-05T10:00:00.000Z" }
  ],
  coursesMostViewed: [
    { courseId: 1, viewCount: 15 }
  ],
  coursesLiked: [1, 2, 15],
  coursesDisliked: [20]
}
```

**Properties:**

- `id` (number) - Unique identifier
- `name` (string) - User's name
- `email` (string) - User's email (unique)
- `password` (string) - User's password (should be hashed in production!)
- `coursesRecentlyViewed` (array) - Recent course views with timestamps
- `coursesMostViewed` (array) - Course view counts
- `coursesLiked` (array) - Course IDs user liked
- `coursesDisliked` (array) - Course IDs user disliked

## 🔌 API Endpoints

### Health Check

**GET /**

- Returns server status
- Response: `{ status: "ok", message: "Studx Backend API is running" }`

### Faculties

**GET /faculty**

- Get all faculties
- Response: `Array<Faculty>`

### Departments

**GET /departments**

- Get all departments
- Query params: `facultyId` (optional)
- Response: `Array<Department>`

**GET /departments/:id**

- Get single department by ID
- Response: `Department` or `404`

### Courses

**GET /courses**

- Get all courses
- Query params:
  - `departmentId` (optional) - Filter by department
  - `facultyId` (optional) - Filter by faculty
- Response: `Array<Course>`

**GET /courses/:id**

- Get single course by ID
- Response: `Course` or `404`

### Materials

**GET /materials**

- Get all materials
- Query params:
  - `courseId` (optional) - Filter by course
  - `type` (optional) - Filter by type (LINK, LECTURE, SLIDES, EXAM)
  - `search` (optional) - Search in title/description
- Response: `Array<Material>` (sorted by upvotes)

**GET /materials/:id**

- Get single material by ID
- Response: `Material` or `404`

**POST /materials/:id/vote**

- Vote on a material
- Body: `{ voteType: "upvote" | "downvote", userId: number }`
- Response: `{ success: true, material, upvotes, downvotes, hasLiked, hasDisliked }`

**GET /materials/vote-status/:userId**

- Get user's vote status for all materials
- Response: `{ [materialId]: { hasLiked: boolean, hasDisliked: boolean } }`

### Authentication

**POST /auth/login**

- User login
- Body: `{ email: string, password: string }`
- Response: `{ success: true, user: User }` or `401`

**POST /auth/register**

- User registration
- Body: `{ name: string, email: string, password: string }`
- Response: `{ success: true, user: User }` or `400`

### User Tracking

**POST /users/:userId/courses/:courseId/view**

- Track course view
- Updates `coursesRecentlyViewed` and `coursesMostViewed`
- Response: `{ success: true, user: User }`

**POST /users/:userId/courses/:courseId/like**

- Like a course
- Response: `{ success: true, user: User }`

**POST /users/:userId/courses/:courseId/dislike**

- Dislike a course
- Response: `{ success: true, user: User }`

**GET /users/:userId**

- Get user data (without password)
- Response: `User` (password excluded)

## 💾 Persistence System

### How It Works

The persistence system (`src/persistence.js`) saves user data to `users-data.json`:

1. **On Server Start:**

   - Loads users from `users-data.json` if it exists
   - Otherwise, uses defaults from `database.js` and saves them

2. **On User Data Changes:**
   - After every user modification, calls `saveUsers(Users)`
   - Writes entire Users array to JSON file
   - Data persists across server restarts

### Functions

```javascript
// Load users from file
loadUsers() → Array<User>

// Save users to file
saveUsers(users: Array<User>) → void

// Initialize (load or use defaults)
initializeUsers(defaultUsers: Array<User>) → Array<User>
```

### When Data is Saved

- User registration
- Course view tracking
- Course like/dislike
- (Material votes don't modify user data, so no save needed)

## 🔧 Middleware

### 1. JSON Parser

```javascript
app.use(express.json());
```

Parses JSON request bodies into `req.body`.

### 2. CORS (Cross-Origin Resource Sharing)

```javascript
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );

  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }
  next();
});
```

Allows frontend (on different origin) to access API.

### 3. Static Files

```javascript
app.use(express.static(path.join(__dirname, "../public")));
```

Serves images from `/public` directory at root URL (e.g., `/eng.jpg`).

## ⚠️ Error Handling

### Standard Error Responses

- **404 Not Found**: Resource doesn't exist

  ```json
  { "error": "User not found" }
  ```

- **400 Bad Request**: Invalid input

  ```json
  { "error": "User with this email already exists" }
  ```

- **401 Unauthorized**: Authentication failed
  ```json
  { "error": "Invalid email or password" }
  ```

### Error Patterns

```javascript
// Check if resource exists
const user = Users.find((u) => u.id === userId);
if (!user) {
  return res.status(404).json({ error: "User not found" });
}

// Validate input
if (!email || !password) {
  return res.status(400).json({ error: "Email and password required" });
}
```

## 🚀 Deployment

### Render.com (Current Setup)

1. **Configuration**: `render.yaml` in root
2. **Build**: `npm install`
3. **Start**: `npm start` (runs `node src/index.js`)
4. **Port**: Uses `process.env.PORT` (provided by Render)

### Environment Variables

- `PORT` - Server port (auto-set by Render)
- `NODE_ENV` - Set to "production" on Render

### Important Notes

1. **File Persistence**: `users-data.json` persists on Render's filesystem
2. **Static Files**: Images are served from `/public`
3. **CORS**: Currently allows all origins (`*`) - restrict in production!

## 🔒 Security Considerations

### Current State (Development)

- Passwords stored in plain text ❌
- CORS allows all origins ❌
- No rate limiting ❌
- No input validation/sanitization ❌

### Production Recommendations

1. **Hash Passwords**: Use bcrypt

   ```javascript
   const bcrypt = require("bcrypt");
   password: await bcrypt.hash(password, 10);
   ```

2. **Restrict CORS**: Only allow your frontend domain

   ```javascript
   res.header("Access-Control-Allow-Origin", "https://your-frontend.com");
   ```

3. **Add Rate Limiting**: Use express-rate-limit
4. **Input Validation**: Use express-validator
5. **HTTPS Only**: Enforce secure connections
6. **Environment Variables**: Store secrets in env vars

## 📝 Code Examples

### Adding a New Endpoint

```javascript
// GET /api/example
app.get("/api/example", (req, res) => {
  const { queryParam } = req.query;

  // Your logic here
  const result = { message: "Example", queryParam };

  res.json(result);
});

// POST /api/example
app.post("/api/example", (req, res) => {
  const { bodyData } = req.body;

  // Validate
  if (!bodyData) {
    return res.status(400).json({ error: "bodyData required" });
  }

  // Your logic here
  res.json({ success: true });
});
```

### Modifying User Data

```javascript
// Always save after modification
const user = Users.find((u) => u.id === userId);
user.coursesLiked.push(courseId);
saveUsers(Users); // Persist to file
res.json({ success: true, user });
```

## 🐛 Debugging

### Enable Logging

Add console.logs:

```javascript
console.log("Request received:", req.method, req.path);
console.log("Query params:", req.query);
console.log("Body:", req.body);
```

### Check Data

```javascript
console.log("Total users:", Users.length);
console.log("Total materials:", Materials.length);
```

### Test Endpoints

Use curl or Postman:

```bash
# Test health check
curl http://localhost:3000/

# Test login
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"ahmed@student.msku.edu.tr","password":"password123"}'
```

## 📚 Next Steps

1. Read [AUTH_GUIDE.md](./AUTH_GUIDE.md) for authentication details
2. Read [FRONTEND_GUIDE.md](./FRONTEND_GUIDE.md) to understand frontend integration
3. Check [DEPLOYMENT.md](./DEPLOYMENT.md) for deployment instructions

---

**Questions?** Check the code comments or open an issue!
