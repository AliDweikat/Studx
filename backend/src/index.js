const express = require("express");
const path = require("path");
const app = express();
const { Faculty, Courses } = require("./database");

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

app.get("/courses", (req, res) => {
  res.json(Courses);
});
app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
