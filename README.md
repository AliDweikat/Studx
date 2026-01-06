# Studx - Student Course Materials Platform

A full-stack web application for sharing and accessing course materials, notes, and resources for university students.

## 📚 Table of Contents

1. [Project Overview](#project-overview)
2. [Tech Stack](#tech-stack)
3. [Project Structure](#project-structure)
4. [Quick Start](#quick-start)
5. [Detailed Guides](#detailed-guides)
6. [Features](#features)


## 🎯 Project Overview

Studx is a platform where students can:

- Browse faculties, departments, and courses
- Access course materials (lectures, slides, exams, links)
- Track their recently viewed and most viewed courses
- Vote on materials (upvote/downvote)
- Manage their profile and course preferences

### Architecture

- **Backend**: Express.js REST API (Node.js)
- **Frontend**: Vanilla JavaScript, HTML, CSS
- **Data Storage**: JSON files (in-memory with file persistence)
- **Authentication**: Cookie-based sessions
- **Deployment**:
  - Backend: Render.com
  - Frontend: GitHub Pages

## 🛠 Tech Stack

### Backend

- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **File System (fs)** - Data persistence

### Frontend

- **HTML5** - Structure
- **CSS3** - Styling (with CSS variables)
- **Vanilla JavaScript** - No frameworks, pure JS
- **Fetch API** - HTTP requests
- **Cookies** - Session management
- **LocalStorage** - Language preference

## 📁 Project Structure

```
Studx/
├── backend/                 # Backend server
│   ├── src/
│   │   ├── index.js        # Main Express server
│   │   ├── database.js     # Data models (Faculty, Departments, Courses, Materials, Users)
│   │   ├── persistence.js  # File-based data persistence
│   │   └── users-data.json # Persistent user data (auto-generated)
│   ├── public/              # Static files (images)
│   │   ├── eng.jpg
│   │   ├── medicine.jpg
│   │   └── art.jpg
│   └── package.json        # Dependencies
│
├── frontend/                # Frontend application
│   ├── index.html          # Homepage
│   ├── css/
│   │   └── style.css      # All styles
│   ├── js/
│   │   ├── script.js      # Main application logic
│   │   └── translations.js # i18n translations (TR/EN)
│   ├── pages/              # Additional pages
│   │   ├── departments.html
│   │   ├── department.html
│   │   ├── materials.html
│   │   ├── login.html
│   │   ├── register.html
│   │   └── profile.html
│   └── content/            # Assets
│       └── Image/          # Images and icons
│
├── .github/
│   └── workflows/
│       └── deploy.yml     # GitHub Pages deployment
│
├── render.yaml             # Render.com deployment config
├── DEPLOYMENT.md           # Deployment instructions
└── README.md              # This file
```

## 🚀 Quick Start

### Prerequisites

- Node.js (v14 or higher)
- npm (comes with Node.js)
- Git

### Local Development Setup

1. **Clone the repository**

   ```bash
   git clone <your-repo-url>
   cd Studx
   ```

2. **Install backend dependencies**

   ```bash
   cd backend
   npm install
   ```

3. **Start the backend server**

   ```bash
   npm start
   # Server runs on http://localhost:3000
   ```

4. **Open the frontend**

   - Open `frontend/index.html` in your browser
   - Or use a local server:
     ```bash
     # Using Python
     cd frontend
     python3 -m http.server 8000
     # Then visit http://localhost:8000
     ```

5. **Update API URL (if needed)**
   - Edit `frontend/js/script.js`
   - Change `API_BASE_URL` to `http://localhost:3000` for local development

## 📖 Detailed Guides

For in-depth understanding, read these guides:

1. **[BACKEND_GUIDE.md](./BACKEND_GUIDE.md)** - Complete backend documentation

   - API endpoints
   - Data models
   - Persistence system
   - Server architecture

2. **[AUTH_GUIDE.md](./AUTH_GUIDE.md)** - Authentication system

   - Login/Register flow
   - Session management
   - Cookie handling
   - Security considerations

3. **[FRONTEND_GUIDE.md](./FRONTEND_GUIDE.md)** - Frontend architecture

   - Page structure
   - JavaScript modules
   - State management
   - User interactions

4. **[DEPLOYMENT.md](./DEPLOYMENT.md)** - Deployment instructions
   - Backend (Render.com)
   - Frontend (GitHub Pages)

## ✨ Features

### Core Features

- ✅ Browse faculties and departments
- ✅ View courses by department
- ✅ Access course materials (links, lectures, slides, exams)
- ✅ Search and filter materials
- ✅ User authentication (login/register)
- ✅ User profiles with course tracking
- ✅ Recently viewed courses
- ✅ Most viewed courses
- ✅ Material voting system
- ✅ Bilingual support (Turkish/English)

### User Tracking

- Course view history
- Most viewed courses
- Course likes/dislikes
- Material votes

### Data Persistence

- User data persists across server restarts
- Session persists across page navigations
- Language preference saved

## 🔗 API Endpoints

See [BACKEND_GUIDE.md](./BACKEND_GUIDE.md) for complete API documentation.

Quick reference:

- `GET /faculty` - Get all faculties
- `GET /departments?facultyId=1` - Get departments
- `GET /courses?departmentId=1` - Get courses
- `GET /materials?courseId=1` - Get materials
- `POST /auth/login` - User login
- `POST /auth/register` - User registration
- `POST /users/:userId/courses/:courseId/view` - Track course view
- `POST /materials/:id/vote` - Vote on material

## 🎨 Design

- **Color Palette**: Soft pink/cream theme
- **Responsive**: Works on desktop and mobile
- **Modern UI**: Card-based layout with smooth transitions
- **Accessibility**: Semantic HTML, proper ARIA labels

## 📝 License

This project is for educational purposes.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📧 Support

For issues or questions, please open an issue on GitHub.

---

**Happy Learning! 🎓**
