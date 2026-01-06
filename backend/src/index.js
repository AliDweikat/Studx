const express = require("express");
const path = require("path");
const app = express();
const { Faculty, Departments, Courses, Materials, Users: defaultUsers } = require("./database");
const { initializeUsers, saveUsers } = require("./persistence");

// Initialize Users with persistence (load from file or use defaults)
let Users = initializeUsers(defaultUsers);

// Middleware to parse JSON bodies
app.use(express.json());

// Enable CORS for all routes
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );

  // Handle preflight requests
  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }

  next();
});

// Serve static files from the public directory (one level up from src)
app.use(express.static(path.join(__dirname, "../public")));

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.get("/faculty", (req, res) => {
  res.json(Faculty);
});

app.get("/departments", (req, res) => {
  const facultyId = req.query.facultyId;
  if (facultyId) {
    const filtered = Departments.filter(
      (d) => d.facultyId === parseInt(facultyId)
    );
    res.json(filtered);
  } else {
    res.json(Departments);
  }
});

app.get("/departments/:id", (req, res) => {
  const department = Departments.find((d) => d.id === parseInt(req.params.id));
  if (!department) {
    return res.status(404).json({ error: "Department not found" });
  }
  res.json(department);
});

app.get("/courses", (req, res) => {
  const departmentId = req.query.departmentId;
  const facultyId = req.query.facultyId;

  let filtered = Courses;

  if (departmentId) {
    // Get courses for a specific department (including shared courses from same faculty)
    const department = Departments.find((d) => d.id === parseInt(departmentId));
    if (department) {
      filtered = Courses.filter(
        (c) =>
          c.departmentId === parseInt(departmentId) ||
          (c.departmentId === null && c.facultyId === department.facultyId)
      );
    }
  } else if (facultyId) {
    filtered = Courses.filter((c) => c.facultyId === parseInt(facultyId));
  }

  res.json(filtered);
});

app.get("/courses/:id", (req, res) => {
  const course = Courses.find((c) => c.id === parseInt(req.params.id));
  if (!course) {
    return res.status(404).json({ error: "Course not found" });
  }
  res.json(course);
});

// Materials endpoints
app.get("/materials", (req, res) => {
  const courseId = req.query.courseId;
  const search = req.query.search;
  const type = req.query.type;

  let filtered = Materials;

  // Filter by course
  if (courseId) {
    filtered = filtered.filter((m) => m.courseId === parseInt(courseId));
  }

  // Filter by type
  if (type) {
    filtered = filtered.filter((m) => m.type === type.toUpperCase());
  }

  // Search in title and description
  if (search) {
    const searchLower = search.toLowerCase();
    filtered = filtered.filter(
      (m) =>
        m.title.toLowerCase().includes(searchLower) ||
        m.description.toLowerCase().includes(searchLower)
    );
  }

  // Sort by upvotes (descending)
  filtered.sort((a, b) => b.upvotes - a.upvotes);

  res.json(filtered);
});

app.get("/materials/:id", (req, res) => {
  const material = Materials.find((m) => m.id === parseInt(req.params.id));
  if (!material) {
    return res.status(404).json({ error: "Material not found" });
  }
  res.json(material);
});

// Vote endpoint - tracks per-user likes/dislikes
app.post("/materials/:id/vote", (req, res) => {
  const materialId = parseInt(req.params.id);
  const { voteType, userId } = req.body; // "upvote" or "downvote", userId required

  if (!userId) {
    return res.status(401).json({ error: "User must be logged in to vote" });
  }

  const material = Materials.find((m) => m.id === materialId);
  if (!material) {
    return res.status(404).json({ error: "Material not found" });
  }

  // Initialize arrays if they don't exist
  if (!material.likedBy) material.likedBy = [];
  if (!material.dislikedBy) material.dislikedBy = [];

  const hasLiked = material.likedBy.includes(userId);
  const hasDisliked = material.dislikedBy.includes(userId);

  if (voteType === "upvote") {
    if (hasLiked) {
      // User already liked - remove like
      material.likedBy = material.likedBy.filter(id => id !== userId);
      material.upvotes = Math.max(0, material.upvotes - 1);
    } else {
      // Remove dislike if exists
      if (hasDisliked) {
        material.dislikedBy = material.dislikedBy.filter(id => id !== userId);
        material.downvotes = Math.max(0, material.downvotes - 1);
      }
      // Add like
      material.likedBy.push(userId);
      material.upvotes += 1;
    }
  } else if (voteType === "downvote") {
    if (hasDisliked) {
      // User already disliked - remove dislike
      material.dislikedBy = material.dislikedBy.filter(id => id !== userId);
      material.downvotes = Math.max(0, material.downvotes - 1);
    } else {
      // Remove like if exists
      if (hasLiked) {
        material.likedBy = material.likedBy.filter(id => id !== userId);
        material.upvotes = Math.max(0, material.upvotes - 1);
      }
      // Add dislike
      material.dislikedBy.push(userId);
      material.downvotes += 1;
    }
  } else {
    return res.status(400).json({ error: "Invalid vote type" });
  }

  res.json({
    success: true,
    material: material,
    upvotes: material.upvotes,
    downvotes: material.downvotes,
    hasLiked: material.likedBy.includes(userId),
    hasDisliked: material.dislikedBy.includes(userId),
  });
});

// Get user's vote status for all materials
app.get("/materials/vote-status/:userId", (req, res) => {
  const userId = parseInt(req.params.userId);
  const statusMap = {};

  Materials.forEach(material => {
    if (!material.likedBy) material.likedBy = [];
    if (!material.dislikedBy) material.dislikedBy = [];
    statusMap[material.id] = {
      hasLiked: material.likedBy.includes(userId),
      hasDisliked: material.dislikedBy.includes(userId),
    };
  });

  res.json(statusMap);
});

// User authentication endpoints
app.post("/auth/login", (req, res) => {
  const { email, password } = req.body;

  const user = Users.find((u) => u.email === email && u.password === password);
  if (!user) {
    return res.status(401).json({ error: "Invalid email or password" });
  }

  // Don't send password back
  const { password: _, ...userWithoutPassword } = user;
  res.json({ success: true, user: userWithoutPassword });
});

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

// User tracking endpoints
app.post("/users/:userId/courses/:courseId/view", (req, res) => {
  const userId = parseInt(req.params.userId);
  const courseId = parseInt(req.params.courseId);

  const user = Users.find((u) => u.id === userId);
  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }

  // Update recently viewed - use map to update existing or add new
  const now = new Date().toISOString();
  const existingIndex = user.coursesRecentlyViewed.findIndex((cv) => cv.courseId === courseId);
  
  if (existingIndex !== -1) {
    // Update existing entry's viewedAt timestamp
    user.coursesRecentlyViewed[existingIndex].viewedAt = now;
    // Move to front
    const updated = user.coursesRecentlyViewed.splice(existingIndex, 1)[0];
    user.coursesRecentlyViewed.unshift(updated);
  } else {
    // Add new entry at the beginning
    user.coursesRecentlyViewed.unshift({ courseId, viewedAt: now });
  }
  
  // Keep only last 10
  if (user.coursesRecentlyViewed.length > 10) {
    user.coursesRecentlyViewed = user.coursesRecentlyViewed.slice(0, 10);
  }

  // Update most viewed
  const mostViewed = user.coursesMostViewed.find((cv) => cv.courseId === courseId);
  if (mostViewed) {
    mostViewed.viewCount += 1;
  } else {
    user.coursesMostViewed.push({ courseId, viewCount: 1 });
  }

  // Sort by view count
  user.coursesMostViewed.sort((a, b) => b.viewCount - a.viewCount);

  saveUsers(Users); // Persist to file
  res.json({ success: true, user });
});

app.post("/users/:userId/courses/:courseId/like", (req, res) => {
  const userId = parseInt(req.params.userId);
  const courseId = parseInt(req.params.courseId);

  const user = Users.find((u) => u.id === userId);
  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }

  // Remove from disliked if exists
  user.coursesDisliked = user.coursesDisliked.filter((id) => id !== courseId);

  // Add to liked if not already there
  if (!user.coursesLiked.includes(courseId)) {
    user.coursesLiked.push(courseId);
  }

  saveUsers(Users); // Persist to file
  res.json({ success: true, user });
});

app.post("/users/:userId/courses/:courseId/dislike", (req, res) => {
  const userId = parseInt(req.params.userId);
  const courseId = parseInt(req.params.courseId);

  const user = Users.find((u) => u.id === userId);
  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }

  // Remove from liked if exists
  user.coursesLiked = user.coursesLiked.filter((id) => id !== courseId);

  // Add to disliked if not already there
  if (!user.coursesDisliked.includes(courseId)) {
    user.coursesDisliked.push(courseId);
  }

  saveUsers(Users); // Persist to file
  res.json({ success: true, user });
});

app.get("/users/:userId", (req, res) => {
  const userId = parseInt(req.params.userId);
  const user = Users.find((u) => u.id === userId);

  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }

  // Don't send password back
  const { password: _, ...userWithoutPassword } = user;
  res.json(userWithoutPassword);
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
