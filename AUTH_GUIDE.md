# Authentication Guide - Complete Documentation

This guide explains the authentication system, session management, and security implementation.

## 📋 Table of Contents

1. [Overview](#overview)
2. [Authentication Flow](#authentication-flow)
3. [Session Management](#session-management)
4. [Frontend Implementation](#frontend-implementation)
5. [Backend Implementation](#backend-implementation)
6. [Security Considerations](#security-considerations)
7. [Code Walkthrough](#code-walkthrough)

## 🎯 Overview

The authentication system uses:
- **Backend**: Express.js endpoints for login/register
- **Frontend**: Cookie-based session storage
- **Session**: Stored in browser cookies (7-day expiration)
- **State**: User data stored in cookie, synced with backend

### Key Components

1. **Login Endpoint** (`POST /auth/login`)
2. **Register Endpoint** (`POST /auth/register`)
3. **Cookie Management** (setCookie, getCookie, deleteCookie)
4. **UI Updates** (updateAuthUI function)
5. **User Tracking** (getCurrentUser function)

## 🔄 Authentication Flow

### Registration Flow

```
User fills form → Frontend sends POST /auth/register
    ↓
Backend validates (email unique, all fields present)
    ↓
Creates new user → Saves to Users array → Persists to file
    ↓
Returns user data (without password)
    ↓
Frontend stores user in cookie → Updates UI → Redirects to home
```

### Login Flow

```
User fills form → Frontend sends POST /auth/login
    ↓
Backend finds user by email → Validates password
    ↓
Returns user data (without password)
    ↓
Frontend stores user in cookie → Updates UI → Redirects to home
```

### Logout Flow

```
User clicks logout → Confirmation dialog
    ↓
Frontend deletes cookie → Updates UI → Redirects to home
```

### Session Check Flow

```
Page loads → Frontend reads cookie
    ↓
If cookie exists → Parse user data → Update UI (show profile/logout)
    ↓
If no cookie → Show login button
```

## 🍪 Session Management

### Cookie Structure

**Cookie Name**: `studx_user`

**Cookie Value**: JSON stringified user object
```json
{
  "id": 1,
  "name": "Ahmed Student",
  "email": "ahmed@student.msku.edu.tr",
  "coursesRecentlyViewed": [...],
  "coursesMostViewed": [...],
  "coursesLiked": [...],
  "coursesDisliked": [...]
}
```

**Cookie Settings**:
- **Expiration**: 7 days
- **Path**: `/` (available site-wide)
- **SameSite**: `Lax` (CSRF protection)
- **Secure**: Not set (would need HTTPS)

### Cookie Functions

Located in `frontend/js/script.js`:

#### 1. setCookie(name, value, days)

```javascript
function setCookie(name, value, days = 7) {
  const expires = new Date();
  expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
  const cookieString = `${name}=${encodeURIComponent(value)};expires=${expires.toUTCString()};path=/;SameSite=Lax`;
  document.cookie = cookieString;
}
```

**Purpose**: Sets a cookie with expiration

**Usage**:
```javascript
setCookie('studx_user', JSON.stringify(user), 7);
```

#### 2. getCookie(name)

```javascript
function getCookie(name) {
  const nameEQ = name + "=";
  const ca = document.cookie.split(";");
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === " ") c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) === 0) {
      return decodeURIComponent(c.substring(nameEQ.length, c.length));
    }
  }
  return null;
}
```

**Purpose**: Retrieves cookie value

**Usage**:
```javascript
const userStr = getCookie('studx_user');
const user = userStr ? JSON.parse(userStr) : null;
```

#### 3. deleteCookie(name)

```javascript
function deleteCookie(name) {
  document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;`;
}
```

**Purpose**: Deletes a cookie by setting expiration to past date

**Usage**:
```javascript
deleteCookie('studx_user');
```

## 🎨 Frontend Implementation

### Key Functions

#### 1. getCurrentUser()

```javascript
function getCurrentUser() {
  const userStr = getCookie("studx_user");
  return userStr ? JSON.parse(userStr) : null;
}
```

**Purpose**: Get currently logged-in user from cookie

**Returns**: User object or `null`

**Usage**: Called on every page to check authentication status

#### 2. handleLogin(e)

```javascript
async function handleLogin(e) {
  e.preventDefault();
  
  const email = document.getElementById("loginEmail").value;
  const password = document.getElementById("loginPassword").value;
  
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password })
  });
  
  const result = await response.json();
  
  if (!response.ok) {
    // Show error
    return;
  }
  
  // Store user in cookie
  setCookie("studx_user", JSON.stringify(result.user), 7);
  
  // Update UI
  updateAuthUI();
  
  // Redirect
  window.location.href = "../index.html";
}
```

**Flow**:
1. Prevent form submission
2. Get email/password from form
3. Send POST request to backend
4. If successful, store user in cookie
5. Update UI
6. Redirect to home

#### 3. handleRegister(e)

Similar to `handleLogin`, but:
- Sends to `/auth/register`
- Includes `name` field
- Backend creates new user

#### 4. handleLogout()

```javascript
function handleLogout() {
  const confirmMsg = currentLang === "tr" 
    ? "Çıkış yapmak istediğinize emin misiniz?"
    : "Are you sure you want to logout?";
  
  if (confirm(confirmMsg)) {
    deleteCookie("studx_user");
    updateAuthUI();
    
    // Redirect based on current page
    const currentPath = window.location.pathname;
    if (currentPath.includes("/pages/")) {
      window.location.href = "../index.html";
    } else {
      window.location.href = "index.html";
    }
  }
}
```

**Flow**:
1. Show confirmation dialog
2. If confirmed, delete cookie
3. Update UI
4. Redirect to home

#### 5. updateAuthUI()

```javascript
function updateAuthUI() {
  const user = getCurrentUser();
  const loginButton = document.getElementById("navLoginButton");
  
  // Remove existing logout buttons
  document.querySelectorAll(".logout-btn").forEach(btn => btn.remove());
  
  // Show/hide profile link
  const profileLink = document.getElementById("profileLink");
  if (profileLink) {
    profileLink.style.display = user ? "inline-block" : "none";
  }
  
  if (loginButton) {
    if (user) {
      // User logged in - hide login button
      loginButton.style.display = "none";
      
      // Add logout button
      const logoutBtn = document.createElement("a");
      logoutBtn.className = "logout-btn";
      logoutBtn.textContent = t.logout || "Çıkış Yap";
      logoutBtn.onclick = (e) => {
        e.preventDefault();
        handleLogout();
      };
      loginButton.parentElement.appendChild(logoutBtn);
    } else {
      // User not logged in - show login button
      loginButton.style.display = "inline-block";
      loginButton.textContent = t.nav_login || "Giriş Yap";
      loginButton.href = getPagesPath("login.html");
    }
  }
}
```

**Purpose**: Updates navbar based on authentication state

**Called**:
- On page load (`DOMContentLoaded`)
- After login/register
- After logout
- On language change

## 🔧 Backend Implementation

### Login Endpoint

**Route**: `POST /auth/login`

**Location**: `backend/src/index.js`

```javascript
app.post("/auth/login", (req, res) => {
  const { email, password } = req.body;
  
  // Find user by email
  const user = Users.find((u) => u.email === email && u.password === password);
  
  if (!user) {
    return res.status(401).json({ error: "Invalid email or password" });
  }
  
  // Don't send password back
  const { password: _, ...userWithoutPassword } = user;
  res.json({ success: true, user: userWithoutPassword });
});
```

**Validation**:
- Checks if user exists
- Validates password (plain text comparison - insecure!)
- Returns user without password

**Response**:
- Success: `{ success: true, user: {...} }`
- Error: `{ error: "Invalid email or password" }` (401)

### Register Endpoint

**Route**: `POST /auth/register`

```javascript
app.post("/auth/register", (req, res) => {
  const { name, email, password } = req.body;
  
  // Check if user already exists
  const existingUser = Users.find((u) => u.email === email);
  if (existingUser) {
    return res.status(400).json({ error: "User with this email already exists" });
  }
  
  // Create new user
  const newUser = {
    id: Users.length + 1,
    name,
    email,
    password, // In production, hash this!
    coursesRecentlyViewed: [],
    coursesMostViewed: [],
    coursesLiked: [],
    coursesDisliked: [],
  };
  
  Users.push(newUser);
  saveUsers(Users); // Persist to file
  
  // Don't send password back
  const { password: _, ...userWithoutPassword } = newUser;
  res.json({ success: true, user: userWithoutPassword });
});
```

**Validation**:
- Checks if email already exists
- Creates new user with default tracking arrays
- Saves to file
- Returns user without password

**Response**:
- Success: `{ success: true, user: {...} }`
- Error: `{ error: "User with this email already exists" }` (400)

## 🔒 Security Considerations

### Current Implementation (Development)

⚠️ **Security Issues**:

1. **Plain Text Passwords**
   - Passwords stored and compared in plain text
   - **Fix**: Use bcrypt to hash passwords

2. **No Input Validation**
   - No email format validation
   - No password strength requirements
   - **Fix**: Add validation middleware

3. **No Rate Limiting**
   - Unlimited login attempts
   - **Fix**: Add rate limiting

4. **CORS Allows All Origins**
   - `Access-Control-Allow-Origin: *`
   - **Fix**: Restrict to specific domains

5. **No HTTPS Enforcement**
   - Cookies can be intercepted
   - **Fix**: Use `Secure` flag with HTTPS

### Production Recommendations

#### 1. Hash Passwords

```javascript
const bcrypt = require('bcrypt');

// On registration
const hashedPassword = await bcrypt.hash(password, 10);
newUser.password = hashedPassword;

// On login
const user = Users.find(u => u.email === email);
if (!user || !await bcrypt.compare(password, user.password)) {
  return res.status(401).json({ error: "Invalid credentials" });
}
```

#### 2. Input Validation

```javascript
const validator = require('validator');

if (!validator.isEmail(email)) {
  return res.status(400).json({ error: "Invalid email format" });
}

if (password.length < 8) {
  return res.status(400).json({ error: "Password must be at least 8 characters" });
}
```

#### 3. Rate Limiting

```javascript
const rateLimit = require('express-rate-limit');

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5 // 5 attempts
});

app.post("/auth/login", loginLimiter, (req, res) => {
  // ... login logic
});
```

#### 4. Secure Cookies

```javascript
// In production with HTTPS
const cookieString = `${name}=${encodeURIComponent(value)};expires=${expires.toUTCString()};path=/;SameSite=Strict;Secure`;
```

#### 5. JWT Tokens (Advanced)

Instead of storing full user object in cookie, use JWT:

```javascript
const jwt = require('jsonwebtoken');

// On login
const token = jwt.sign({ userId: user.id }, SECRET_KEY, { expiresIn: '7d' });
res.json({ success: true, token });

// On frontend
setCookie('studx_token', token, 7);

// Verify on each request
const token = getCookie('studx_token');
const decoded = jwt.verify(token, SECRET_KEY);
const user = Users.find(u => u.id === decoded.userId);
```

## 📝 Code Walkthrough

### Complete Login Flow Example

**1. User visits login page** (`pages/login.html`)

**2. Form submission**:
```html
<form id="loginForm">
  <input id="loginEmail" type="email">
  <input id="loginPassword" type="password">
  <button type="submit">Login</button>
</form>
```

**3. Event listener** (in `script.js`):
```javascript
const loginForm = document.getElementById("loginForm");
loginForm.addEventListener("submit", handleLogin);
```

**4. handleLogin executes**:
- Gets form values
- Sends POST to backend
- Receives user data
- Stores in cookie
- Updates UI
- Redirects

**5. Next page load**:
- `updateAuthUI()` runs
- Reads cookie
- Shows profile link and logout button
- Hides login button

### Session Persistence Across Pages

**How it works**:
1. Cookie set with `path=/` makes it available on all pages
2. Every page calls `updateAuthUI()` on load
3. `getCurrentUser()` reads cookie
4. UI updates based on user state

**Example navigation**:
```
Home → Materials → Profile → Home
  ↓       ↓         ↓        ↓
All pages check cookie and update UI accordingly
```

## 🐛 Debugging

### Check Cookie

```javascript
// In browser console
document.cookie
// Should show: studx_user=...

// Parse it
JSON.parse(decodeURIComponent(document.cookie.split('studx_user=')[1].split(';')[0]))
```

### Check User State

```javascript
// In browser console
getCurrentUser()
// Should return user object or null
```

### Common Issues

1. **Cookie not set**
   - Check browser console for errors
   - Verify cookie path is `/`
   - Check if cookie size is too large

2. **User not persisting**
   - Cookie might be blocked
   - Check browser privacy settings
   - Verify cookie expiration

3. **UI not updating**
   - Ensure `updateAuthUI()` is called
   - Check if elements exist in DOM
   - Verify cookie is readable

## 📚 Next Steps

1. Read [BACKEND_GUIDE.md](./BACKEND_GUIDE.md) for API details
2. Read [FRONTEND_GUIDE.md](./FRONTEND_GUIDE.md) for frontend architecture
3. Implement security improvements for production

---

**Remember**: This is a development implementation. Always add proper security measures before deploying to production!

