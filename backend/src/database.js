const Faculty = [
  {
    id: 1,
    name: "Engineering Faculty",
    image: "eng.jpg",
  },
  {
    id: 2,
    name: "Medicine Faculty",
    image: "medicine.jpg",
  },
  {
    id: 3,
    name: "Art Faculty",
    image: "art.jpg",
  },
];

const Departments = [
  // Engineering Faculty Departments
  { id: 1, name: "Computer Engineering", facultyId: 1 },
  { id: 2, name: "Electrical Engineering", facultyId: 1 },
  { id: 3, name: "Mechanical Engineering", facultyId: 1 },
  { id: 4, name: "Civil Engineering", facultyId: 1 },
  { id: 5, name: "Industrial Engineering", facultyId: 1 },
  
  // Medicine Faculty Departments
  { id: 6, name: "General Medicine", facultyId: 2 },
  { id: 7, name: "Dentistry", facultyId: 2 },
  { id: 8, name: "Pharmacy", facultyId: 2 },
  { id: 9, name: "Nursing", facultyId: 2 },
  { id: 10, name: "Physiotherapy", facultyId: 2 },
  
  // Art Faculty Departments
  { id: 11, name: "Fine Arts", facultyId: 3 },
  { id: 12, name: "Graphic Design", facultyId: 3 },
  { id: 13, name: "Music", facultyId: 3 },
  { id: 14, name: "Theater", facultyId: 3 },
];

const Courses = [
  // Computer Engineering Courses
  { id: 1, name: "Data Structures", facultyId: 1, departmentId: 1 },
  { id: 2, name: "Algorithms", facultyId: 1, departmentId: 1 },
  { id: 3, name: "Database Systems", facultyId: 1, departmentId: 1 },
  { id: 4, name: "Web Development", facultyId: 1, departmentId: 1 },
  
  // Electrical Engineering Courses
  { id: 5, name: "Circuit Analysis", facultyId: 1, departmentId: 2 },
  { id: 6, name: "Digital Electronics", facultyId: 1, departmentId: 2 },
  { id: 7, name: "Power Systems", facultyId: 1, departmentId: 2 },
  
  // Mechanical Engineering Courses
  { id: 8, name: "Thermodynamics", facultyId: 1, departmentId: 3 },
  { id: 9, name: "Mechanics of Materials", facultyId: 1, departmentId: 3 },
  { id: 10, name: "Machine Design", facultyId: 1, departmentId: 3 },
  
  // Civil Engineering Courses
  { id: 11, name: "Structural Analysis", facultyId: 1, departmentId: 4 },
  { id: 12, name: "Construction Materials", facultyId: 1, departmentId: 4 },
  
  // Industrial Engineering Courses
  { id: 13, name: "Operations Research", facultyId: 1, departmentId: 5 },
  { id: 14, name: "Production Planning", facultyId: 1, departmentId: 5 },
  
  // Shared Engineering Courses (null departmentId means shared within faculty)
  { id: 15, name: "Calculus I", facultyId: 1, departmentId: null },
  { id: 16, name: "Calculus II", facultyId: 1, departmentId: null },
  { id: 17, name: "Physics I", facultyId: 1, departmentId: null },
  { id: 18, name: "Physics II", facultyId: 1, departmentId: null },
  { id: 19, name: "Linear Algebra", facultyId: 1, departmentId: null },
  
  // General Medicine Courses
  { id: 20, name: "Anatomy", facultyId: 2, departmentId: 6 },
  { id: 21, name: "Physiology", facultyId: 2, departmentId: 6 },
  { id: 22, name: "Pathology", facultyId: 2, departmentId: 6 },
  { id: 23, name: "Internal Medicine", facultyId: 2, departmentId: 6 },
  
  // Dentistry Courses
  { id: 24, name: "Oral Anatomy", facultyId: 2, departmentId: 7 },
  { id: 25, name: "Dental Materials", facultyId: 2, departmentId: 7 },
  { id: 26, name: "Oral Surgery", facultyId: 2, departmentId: 7 },
  
  // Pharmacy Courses
  { id: 27, name: "Pharmacology", facultyId: 2, departmentId: 8 },
  { id: 28, name: "Pharmaceutical Chemistry", facultyId: 2, departmentId: 8 },
  { id: 29, name: "Pharmacy Practice", facultyId: 2, departmentId: 8 },
  
  // Nursing Courses
  { id: 30, name: "Nursing Fundamentals", facultyId: 2, departmentId: 9 },
  { id: 31, name: "Clinical Nursing", facultyId: 2, departmentId: 9 },
  
  // Physiotherapy Courses
  { id: 32, name: "Exercise Physiology", facultyId: 2, departmentId: 10 },
  { id: 33, name: "Rehabilitation Techniques", facultyId: 2, departmentId: 10 },
  
  // Shared Medicine Courses
  { id: 34, name: "Medical Ethics", facultyId: 2, departmentId: null },
  { id: 35, name: "Biochemistry", facultyId: 2, departmentId: null },
  { id: 36, name: "Medical Terminology", facultyId: 2, departmentId: null },
  
  // Fine Arts Courses
  { id: 37, name: "Drawing Fundamentals", facultyId: 3, departmentId: 11 },
  { id: 38, name: "Painting Techniques", facultyId: 3, departmentId: 11 },
  { id: 39, name: "Sculpture", facultyId: 3, departmentId: 11 },
  
  // Graphic Design Courses
  { id: 40, name: "Typography", facultyId: 3, departmentId: 12 },
  { id: 41, name: "Digital Design", facultyId: 3, departmentId: 12 },
  { id: 42, name: "Brand Identity", facultyId: 3, departmentId: 12 },
  
  // Music Courses
  { id: 43, name: "Music Theory", facultyId: 3, departmentId: 13 },
  { id: 44, name: "Composition", facultyId: 3, departmentId: 13 },
  { id: 45, name: "Performance", facultyId: 3, departmentId: 13 },
  
  // Theater Courses
  { id: 46, name: "Acting Techniques", facultyId: 3, departmentId: 14 },
  { id: 47, name: "Stage Direction", facultyId: 3, departmentId: 14 },
  
  // Shared Art Courses
  { id: 48, name: "Art History", facultyId: 3, departmentId: null },
  { id: 49, name: "Aesthetics", facultyId: 3, departmentId: null },
  { id: 50, name: "Visual Culture", facultyId: 3, departmentId: null },
];

module.exports = { Faculty, Departments, Courses };
