const express = require("express");
const path = require("path");
const app = express();
const { Faculty, Departments, Courses } = require("./database");

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
app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
