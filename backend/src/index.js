const express = require("express");
const path = require("path");
const app = express();
const { Faculty, Departments, Courses, Materials } = require("./database");

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

// Vote endpoint
app.post("/materials/:id/vote", (req, res) => {
  const materialId = parseInt(req.params.id);
  const { voteType } = req.body; // "upvote" or "downvote"

  const material = Materials.find((m) => m.id === materialId);
  if (!material) {
    return res.status(404).json({ error: "Material not found" });
  }

  if (voteType === "upvote") {
    material.upvotes += 1;
  } else if (voteType === "downvote") {
    material.downvotes += 1;
  } else {
    return res.status(400).json({ error: "Invalid vote type" });
  }

  res.json({
    success: true,
    material: material,
    upvotes: material.upvotes,
    downvotes: material.downvotes,
  });
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
