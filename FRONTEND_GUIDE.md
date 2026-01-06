# Frontend Guide - Complete Documentation

This guide explains the frontend architecture, page structure, JavaScript modules, and how everything works together.

## 📋 Table of Contents

1. [Overview](#overview)
2. [Project Structure](#project-structure)
3. [Page Architecture](#page-architecture)
4. [JavaScript Modules](#javascript-modules)
5. [State Management](#state-management)
6. [API Integration](#api-integration)
7. [Routing & Navigation](#routing--navigation)
8. [Styling System](#styling-system)
9. [Internationalization](#internationalization)
10. [User Interactions](#user-interactions)

## 🎯 Overview

The frontend is a **single-page application (SPA)** built with:
- **Vanilla JavaScript** - No frameworks
- **HTML5** - Semantic markup
- **CSS3** - Modern styling with variables
- **Fetch API** - HTTP requests
- **Cookies** - Session management
- **LocalStorage** - Language preference

### Key Principles

1. **No Build Step** - Pure HTML/CSS/JS
2. **Modular Functions** - Organized by feature
3. **Dynamic Content** - Fetched from API
4. **Responsive Design** - Works on all devices
5. **Progressive Enhancement** - Works without JS (basic)

## 📁 Project Structure

```
frontend/
├── index.html              # Homepage
├── css/
│   └── style.css          # All styles (357 lines)
├── js/
│   ├── script.js          # Main application (1118 lines)
│   └── translations.js    # i18n translations
├── pages/
│   ├── departments.html   # Departments list
│   ├── department.html    # Department courses
│   ├── materials.html     # Course materials
│   ├── login.html         # Login page
│   ├── register.html      # Registration page
│   └── profile.html       # User profile
└── content/
    └── Image/             # Images and icons
```

## 🏗 Page Architecture

### 1. Homepage (`index.html`)

**Structure**:
```html
<nav class="navbar">
  <!-- Brand, links, language toggle, auth buttons -->
</nav>

<header class="hero">
  <!-- University title, subtitle, CTA button -->
</header>

<main class="container">
  <h2>Faculties</h2>
  <div id="facultiesGrid"></div>  <!-- Populated by JS -->
  
  <div id="userSections" style="display: none;">
    <!-- Recently viewed courses -->
    <!-- Most viewed courses -->
  </div>
</main>
```

**JavaScript Flow**:
1. `DOMContentLoaded` event fires
2. `updateAuthUI()` - Updates navbar
3. `updatePageLanguage()` - Applies translations
4. `fetchFaculties()` - Loads and displays faculties
5. `loadUserCoursesOnHomepage()` - If logged in, shows user courses

### 2. Departments Page (`pages/departments.html`)

**Purpose**: Shows departments for a selected faculty

**URL**: `departments.html?facultyId=1`

**JavaScript**:
```javascript
const urlParams = new URLSearchParams(window.location.search);
const facultyId = urlParams.get("facultyId");
fetchDepartments(departmentsGrid, facultyId);
```

### 3. Department Page (`pages/department.html`)

**Purpose**: Shows courses for a department (department-specific + shared)

**URL**: `department.html?departmentId=1`

**JavaScript**:
```javascript
const departmentId = urlParams.get("departmentId");
fetchDepartmentCourses(coursesGrid, departmentId);
```

### 4. Materials Page (`pages/materials.html`)

**Purpose**: Shows course materials with search and filters

**URL**: `materials.html?courseId=1` (optional)

**Features**:
- Search input
- Type filter (LINK, LECTURE, SLIDES, EXAM)
- Course filter
- Material cards with voting

**JavaScript**:
```javascript
populateCourseFilter().then(() => {
  if (courseId) {
    courseFilter.value = courseId;
    fetchCourseName(courseId);
  }
  fetchMaterials();
});
```

### 5. Login/Register Pages

**Purpose**: User authentication

**Forms**: Submit to `handleLogin()` or `handleRegister()`

### 6. Profile Page (`pages/profile.html`)

**Purpose**: Shows user's course tracking data

**JavaScript**: `loadUserProfile()` - Fetches and displays user data

## 📦 JavaScript Modules

### Main File: `script.js`

**Structure**:

```javascript
// 1. Configuration
const API_BASE_URL = "https://studx-backend.onrender.com";
let currentLang = localStorage.getItem("studx_lang") || "tr";

// 2. Helper Functions
function getPagesPath(filename) { ... }
function setCookie(name, value, days) { ... }
function getCookie(name) { ... }
function deleteCookie(name) { ... }

// 3. Initialization
document.addEventListener("DOMContentLoaded", () => {
  // Page-specific initialization
});

// 4. Language Functions
function toggleLanguage() { ... }
function updatePageLanguage() { ... }

// 5. Data Fetching Functions
async function fetchFaculties(container) { ... }
async function fetchDepartments(container, facultyId) { ... }
async function fetchDepartmentCourses(container, departmentId) { ... }
async function fetchMaterials() { ... }

// 6. Authentication Functions
async function handleLogin(e) { ... }
async function handleRegister(e) { ... }
function handleLogout() { ... }
function getCurrentUser() { ... }
function updateAuthUI() { ... }

// 7. User Tracking Functions
async function trackCourseView(courseId) { ... }
async function loadUserCoursesOnHomepage() { ... }
async function loadUserProfile() { ... }

// 8. Material Functions
async function voteMaterial(materialId, voteType, event) { ... }
async function populateCourseFilter() { ... }
async function fetchCourseName(courseId) { ... }
```

### Key Functions Explained

#### 1. getPagesPath(filename)

**Purpose**: Generates correct relative path based on current page location

**Problem Solved**: Prevents `pages/pages/` double prefix issue

```javascript
function getPagesPath(filename) {
  const currentPath = window.location.pathname;
  if (currentPath.includes("/pages/")) {
    return filename;  // Already in pages/
  } else {
    return `pages/${filename}`;  // Need to add pages/
  }
}
```

**Usage**:
```javascript
const materialsPath = getPagesPath("materials.html");
// On homepage: "pages/materials.html"
// On pages/departments.html: "materials.html"
```

#### 2. fetchFaculties(container)

**Purpose**: Fetches and displays faculty cards

**Flow**:
1. Show loading message
2. Fetch from `/faculty` endpoint
3. Generate HTML cards
4. Insert into container
5. Handle errors

**Example Output**:
```html
<div class="card">
  <img src="https://api.com/eng.jpg">
  <div class="card-content">
    <h3>Engineering Faculty</h3>
    <a href="pages/departments.html?facultyId=1">View</a>
  </div>
</div>
```

#### 3. fetchMaterials()

**Purpose**: Fetches materials with filters and search

**Features**:
- Search by title/description
- Filter by type
- Filter by course
- Sort by upvotes
- Show user vote status

**Flow**:
1. Get filter values
2. Build query string
3. Fetch from `/materials` endpoint
4. Fetch user vote status (if logged in)
5. Generate material cards
6. Display results

#### 4. voteMaterial(materialId, voteType, event)

**Purpose**: Handles material voting

**Flow**:
1. Check if user is logged in
2. Send POST to `/materials/:id/vote`
3. Update vote counts in UI
4. Update button styles
5. Visual feedback animation

**Vote Logic**:
- If already liked → remove like
- If already disliked → remove dislike
- If opposite vote exists → switch vote
- Otherwise → add vote

## 🔄 State Management

### Global State

**Variables**:
```javascript
const API_BASE_URL = "https://studx-backend.onrender.com";
let currentLang = localStorage.getItem("studx_lang") || "tr";
```

### User State

**Storage**: Cookie (`studx_user`)

**Access**: `getCurrentUser()` function

**Updates**: On login, register, logout

### Language State

**Storage**: LocalStorage (`studx_lang`)

**Values**: `"tr"` or `"en"`

**Updates**: `toggleLanguage()` function

### Page State

**URL Parameters**: Used for navigation
- `?facultyId=1` - Departments page
- `?departmentId=1` - Department page
- `?courseId=1` - Materials page

**Reading**:
```javascript
const urlParams = new URLSearchParams(window.location.search);
const facultyId = urlParams.get("facultyId");
```

## 🔌 API Integration

### Base Configuration

```javascript
const API_BASE_URL = "https://studx-backend.onrender.com";
```

### Fetch Pattern

**Standard Pattern**:
```javascript
async function fetchData() {
  try {
    const response = await fetch(`${API_BASE_URL}/endpoint`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    // Process data
  } catch (error) {
    console.error("Fetch error:", error);
    // Show error to user
  }
}
```

### POST Request Pattern

```javascript
async function postData(body) {
  try {
    const response = await fetch(`${API_BASE_URL}/endpoint`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });
    
    const result = await response.json();
    
    if (!response.ok) {
      throw new Error(result.error || "Request failed");
    }
    
    return result;
  } catch (error) {
    console.error("Post error:", error);
    throw error;
  }
}
```

### Error Handling

**User-Friendly Messages**:
```javascript
container.innerHTML = `<p style="color:red; text-align:center;">${t.error_fetch}</p>`;
```

**Console Logging**:
```javascript
console.error("Fetch error:", error);
```

## 🧭 Routing & Navigation

### Navigation System

**No Router Library** - Uses standard HTML links and URL parameters

### Page Flow

```
Home (index.html)
  ↓
Faculties → Departments (departments.html?facultyId=1)
  ↓
Departments → Department (department.html?departmentId=1)
  ↓
Department → Materials (materials.html?courseId=1)
  ↓
Materials → External links (target="_blank")
```

### Dynamic Links

**Generated Links**:
```javascript
const link = `${getPagesPath("materials.html")}?courseId=${course.id}`;
```

**Click Handlers**:
```javascript
onclick="trackCourseView(${course.id}); window.location.href='${link}'"
```

### Back Navigation

**Browser Back Button** - Works naturally with URL parameters

## 🎨 Styling System

### CSS Variables

**Location**: `css/style.css`

**Variables**:
```css
:root {
  --bg-cream: #FFF5E4;      /* Main Background */
  --bg-pink: #FFE3E1;        /* Secondary Background */
  --accent-light: #FFD1D1;   /* Borders / Hovers */
  --accent-main: #FF9494;    /* Navbar / Buttons / Headings */
  --text-dark: #333;         /* Text color */
  --white: #FFFFFF;          /* White */
}
```

**Usage**:
```css
.card {
  background-color: var(--white);
  border: 1px solid var(--accent-light);
  color: var(--text-dark);
}
```

### Component Classes

**Card**:
```css
.card {
  background: var(--white);
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(255, 148, 148, 0.1);
  transition: transform 0.2s, box-shadow 0.2s;
}

.card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 12px rgba(255, 148, 148, 0.2);
}
```

**Button**:
```css
.btn-login {
  background: linear-gradient(135deg, var(--accent-main), var(--accent-light));
  color: var(--white);
  padding: 10px 20px;
  border-radius: 8px;
}
```

### Responsive Design

**Grid System**:
```css
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px;
}
```

**Media Queries**: (if needed, add to style.css)

## 🌍 Internationalization

### Translation System

**File**: `js/translations.js`

**Structure**:
```javascript
const translations = {
  tr: {
    nav_home: "Ana Sayfa",
    nav_login: "Giriş Yap",
    // ... more translations
  },
  en: {
    nav_home: "Home",
    nav_login: "Log In",
    // ... more translations
  }
};
```

### Usage

**HTML**:
```html
<a data-i18n="nav_home">Ana Sayfa</a>
```

**JavaScript**:
```javascript
const t = translations[currentLang];
element.textContent = t.nav_home;
```

### Language Toggle

**Function**: `toggleLanguage()`

**Flow**:
1. Switch `currentLang` between "tr" and "en"
2. Save to localStorage
3. Call `updatePageLanguage()`
4. Update all `[data-i18n]` elements

## 👆 User Interactions

### Course View Tracking

**When**: User clicks on a course card

**Function**: `trackCourseView(courseId)`

**Action**: Sends POST to `/users/:userId/courses/:courseId/view`

**Updates**:
- `coursesRecentlyViewed` (moves to front, updates timestamp)
- `coursesMostViewed` (increments count)

### Material Voting

**When**: User clicks upvote/downvote button

**Function**: `voteMaterial(materialId, voteType, event)`

**Action**: Sends POST to `/materials/:id/vote`

**Updates**:
- Material upvotes/downvotes
- User's vote status
- Button styles (green for upvote, red for downvote)

### Search & Filters

**Debouncing**: Search input uses 300ms debounce

```javascript
searchInput.addEventListener("input", debounce(fetchMaterials, 300));
```

**Filter Changes**: Immediately trigger fetch

```javascript
typeFilter.addEventListener("change", fetchMaterials);
courseFilter.addEventListener("change", fetchMaterials);
```

## 🐛 Debugging

### Console Logging

**Add logs**:
```javascript
console.log("Fetching faculties...");
console.log("Received data:", faculties);
```

### Check State

```javascript
// In browser console
getCurrentUser()  // Check user
currentLang       // Check language
API_BASE_URL      // Check API URL
```

### Network Tab

**Chrome DevTools**:
1. Open DevTools (F12)
2. Go to Network tab
3. See all API requests
4. Check request/response details

### Common Issues

1. **CORS Errors**
   - Check backend CORS settings
   - Verify API_BASE_URL is correct

2. **404 Errors**
   - Check endpoint URLs
   - Verify backend is running

3. **Cookie Issues**
   - Check browser console
   - Verify cookie path is `/`
   - Check SameSite settings

## 📚 Next Steps

1. Read [BACKEND_GUIDE.md](./BACKEND_GUIDE.md) for API details
2. Read [AUTH_GUIDE.md](./AUTH_GUIDE.md) for authentication
3. Check [DEPLOYMENT.md](./DEPLOYMENT.md) for deployment

---

**Happy Coding! 🚀**

