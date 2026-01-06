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

// Materials: LINK, LECTURE, SLIDES, EXAM
const Materials = [
  // Data Structures / Algorithms basics (Course 1)
  {
    id: 1,
    courseId: 1,
    type: "SLIDES",
    title: "MIT 6.006 — Lecture Notes (PDFs)",
    description:
      "Full set of lecture + recitation notes covering core data structures and algorithms.",
    url: "https://ocw.mit.edu/courses/6-006-introduction-to-algorithms-spring-2020/pages/lecture-notes/",
    upvotes: 12,
    downvotes: 1,
    likedBy: [], // Array of user IDs who liked this material
    dislikedBy: [], // Array of user IDs who disliked this material
  },
  {
    id: 2,
    courseId: 1,
    type: "LECTURE",
    title: "MIT 6.006 — Resource Index (includes links to course materials)",
    description: "Central index for notes, quizzes, problem sets, and more.",
    url: "https://ocw.mit.edu/courses/6-006-introduction-to-algorithms-spring-2020/pages/resource-index/",
    upvotes: 8,
    downvotes: 0,
    likedBy: [], // Array of user IDs who liked
    dislikedBy: [], // Array of user IDs who disliked
  },
  {
    id: 3,
    courseId: 1,
    type: "EXAM",
    title: "MSKÜ note: Exams are usually in DYS (login required)",
    description:
      "MSKÜ course exams/materials are typically delivered through the university's Ders Yönetim Sistemi (not fully public).",
    url: "https://uzem.mu.edu.tr/tr/ders-yonetim-sistemi-kullanimi-4086",
    upvotes: 15,
    downvotes: 2,
    likedBy: [], // Array of user IDs who liked
    dislikedBy: [], // Array of user IDs who disliked
  },
  {
    id: 4,
    courseId: 1,
    type: "LINK",
    title: "MSKÜ Library — Açık Ders (Open Course Links)",
    description:
      "MSKÜ library-curated page pointing to open course platforms and learning resources.",
    url: "https://library.mu.edu.tr/tr-TR/AcikDers/List",
    upvotes: 20,
    downvotes: 1,
    likedBy: [], // Array of user IDs who liked
    dislikedBy: [], // Array of user IDs who disliked
  },
  // Algorithms (Course 2)
  {
    id: 5,
    courseId: 2,
    type: "SLIDES",
    title: "MIT 6.046J — Course Resources (notes + problem sets)",
    description:
      "Algorithm design/analysis with lecture notes and assignments (many with solutions).",
    url: "https://ocw.mit.edu/courses/6-046j-design-and-analysis-of-algorithms-spring-2012/resources/",
    upvotes: 18,
    downvotes: 1,
    likedBy: [], // Array of user IDs who liked
    dislikedBy: [], // Array of user IDs who disliked
  },
  {
    id: 6,
    courseId: 2,
    type: "LECTURE",
    title: "MSKÜ UZEM — Official YouTube channel",
    description:
      "MSKÜ UZEM's official channel (webinars/training; sometimes course-related content).",
    url: "https://www.youtube.com/@MSKUUZEM",
    upvotes: 14,
    downvotes: 0,
    likedBy: [], // Array of user IDs who liked
    dislikedBy: [], // Array of user IDs who disliked
  },
  {
    id: 7,
    courseId: 2,
    type: "EXAM",
    title: "MIT 6.046J — Exams (with solutions)",
    description: "Quizzes/final exam materials with solutions.",
    url: "https://ocw.mit.edu/courses/6-046j-design-and-analysis-of-algorithms-spring-2015/pages/exams/",
    upvotes: 22,
    downvotes: 1,
    likedBy: [], // Array of user IDs who liked
    dislikedBy: [], // Array of user IDs who disliked
  },
  {
    id: 8,
    courseId: 2,
    type: "LINK",
    title: "LeetCode — Practice",
    description: "Algorithm practice problems and interview-style exercises.",
    url: "https://leetcode.com",
    upvotes: 25,
    downvotes: 2,
    likedBy: [], // Array of user IDs who liked
    dislikedBy: [], // Array of user IDs who disliked
  },
  // Database Systems (Course 3)
  {
    id: 9,
    courseId: 3,
    type: "SLIDES",
    title: "CMU 15-445 — Assignments (with solutions links)",
    description:
      "Database systems homeworks/projects; many semesters provide solution release links.",
    url: "https://15445.courses.cs.cmu.edu/fall2025/assignments.html",
    upvotes: 16,
    downvotes: 1,
    likedBy: [], // Array of user IDs who liked
    dislikedBy: [], // Array of user IDs who disliked
  },
  {
    id: 10,
    courseId: 3,
    type: "LECTURE",
    title: "CMU 15-445 — Lecture Videos (YouTube playlist)",
    description: "Full lecture playlist for Intro to Database Systems.",
    url: "https://www.youtube.com/playlist?list=PLSE8ODhjZXjYDBpQnSymaectKjxCy6BYq",
    upvotes: 11,
    downvotes: 0,
    likedBy: [], // Array of user IDs who liked
    dislikedBy: [], // Array of user IDs who disliked
  },
  {
    id: 11,
    courseId: 3,
    type: "EXAM",
    title: "MSKÜ note: DB course exams typically not public",
    description:
      "MSKÜ exams are generally distributed via DYS (requires authentication).",
    url: "https://muweb.mu.edu.tr/Newfiles/44/44/%C3%96%C4%9Frenci%20Kullan%C4%B1m%20K%C4%B1lavuzu%20%281%29.pdf",
    upvotes: 13,
    downvotes: 1,
    likedBy: [], // Array of user IDs who liked
    dislikedBy: [], // Array of user IDs who disliked
  },
  {
    id: 12,
    courseId: 3,
    type: "LINK",
    title: "SQL Fiddle — Online SQL playground",
    description: "Quickly test SQL queries in-browser.",
    url: "https://sqlfiddle.com",
    upvotes: 9,
    downvotes: 0,
    likedBy: [], // Array of user IDs who liked
    dislikedBy: [], // Array of user IDs who disliked
  },
  // Web Development (Course 4)
  {
    id: 13,
    courseId: 4,
    type: "SLIDES",
    title: "MDN — Learn Web Development",
    description:
      "Structured tutorials for HTML/CSS/JS and modern web development fundamentals.",
    url: "https://developer.mozilla.org/en-US/docs/Learn_web_development",
    upvotes: 19,
    downvotes: 1,
    likedBy: [], // Array of user IDs who liked
    dislikedBy: [], // Array of user IDs who disliked
  },
  {
    id: 14,
    courseId: 4,
    type: "LECTURE",
    title: "freeCodeCamp — Responsive Web Design (interactive course)",
    description: "Hands-on HTML/CSS curriculum with projects.",
    url: "https://www.freecodecamp.org/learn/responsive-web-design-v9/",
    upvotes: 17,
    downvotes: 1,
    likedBy: [], // Array of user IDs who liked
    dislikedBy: [], // Array of user IDs who disliked
  },
  {
    id: 15,
    courseId: 4,
    type: "EXAM",
    title: "freeCodeCamp — Certification projects (acts like an exam)",
    description: "Completing the required projects is the assessment path.",
    url: "https://www.freecodecamp.org/learn/responsive-web-design-v9/",
    upvotes: 10,
    downvotes: 0,
    likedBy: [], // Array of user IDs who liked
    dislikedBy: [], // Array of user IDs who disliked
  },
  {
    id: 16,
    courseId: 4,
    type: "LINK",
    title: "MDN Web Docs",
    description: "Reference for HTML/CSS/JS and web APIs.",
    url: "https://developer.mozilla.org/en-US/",
    upvotes: 28,
    downvotes: 1,
    likedBy: [], // Array of user IDs who liked
    dislikedBy: [], // Array of user IDs who disliked
  },
  // Circuit Analysis (Course 5)
  {
    id: 17,
    courseId: 5,
    type: "SLIDES",
    title: "MIT 6.002 — Course Page (materials hub)",
    description:
      "Circuit fundamentals; course page links to notes/assignments/exams.",
    url: "https://ocw.mit.edu/courses/6-002-circuits-and-electronics-spring-2007/",
    upvotes: 14,
    downvotes: 1,
    likedBy: [], // Array of user IDs who liked
    dislikedBy: [], // Array of user IDs who disliked
  },
  {
    id: 18,
    courseId: 5,
    type: "LECTURE",
    title: "MIT 6.002 — MIT Learn listing (includes video playlist link)",
    description:
      "MIT's aggregation page linking to OCW materials and video playlist.",
    url: "https://learn.mit.edu/search?resource=4717",
    upvotes: 12,
    downvotes: 0,
    likedBy: [], // Array of user IDs who liked
    dislikedBy: [], // Array of user IDs who disliked
  },
  {
    id: 19,
    courseId: 5,
    type: "EXAM",
    title: "MIT 6.002 — Exams",
    description: "Exams and practice exams for Circuits and Electronics.",
    url: "https://ocw.mit.edu/courses/6-002-circuits-and-electronics-spring-2007/pages/exams/",
    upvotes: 11,
    downvotes: 1,
    likedBy: [], // Array of user IDs who liked
    dislikedBy: [], // Array of user IDs who disliked
  },
  {
    id: 20,
    courseId: 5,
    type: "LINK",
    title: "CircuitLab — Circuit Simulator",
    description: "Interactive circuit simulation tool.",
    url: "https://www.circuitlab.com",
    upvotes: 15,
    downvotes: 0,
    likedBy: [], // Array of user IDs who liked
    dislikedBy: [], // Array of user IDs who disliked
  },
  // Calculus I (Course 15)
  {
    id: 21,
    courseId: 15,
    type: "SLIDES",
    title: "MIT 18.01 — Exams page (also links to problem sets)",
    description:
      "Single Variable Calculus exams + solutions and related practice materials.",
    url: "https://ocw.mit.edu/courses/18-01-single-variable-calculus-fall-2006/pages/exams/",
    upvotes: 21,
    downvotes: 2,
    likedBy: [], // Array of user IDs who liked
    dislikedBy: [], // Array of user IDs who disliked
  },
  {
    id: 22,
    courseId: 15,
    type: "LECTURE",
    title: "Khan Academy — Calculus",
    description: "Free calculus lessons + practice exercises.",
    url: "https://www.khanacademy.org/math/calculus-1",
    upvotes: 19,
    downvotes: 1,
    likedBy: [], // Array of user IDs who liked
    dislikedBy: [], // Array of user IDs who disliked
  },
  {
    id: 23,
    courseId: 15,
    type: "EXAM",
    title: "MIT 18.01 — Exams + solutions",
    description: "Practice exams and official exams with solutions.",
    url: "https://ocw.mit.edu/courses/18-01-single-variable-calculus-fall-2006/pages/exams/",
    upvotes: 24,
    downvotes: 1,
    likedBy: [], // Array of user IDs who liked
    dislikedBy: [], // Array of user IDs who disliked
  },
  {
    id: 24,
    courseId: 15,
    type: "LINK",
    title: "MSKÜ Library — Open course portals list",
    description:
      "MSKÜ library page pointing to multiple open course providers.",
    url: "https://library.mu.edu.tr/tr-TR/AcikDers/List",
    upvotes: 30,
    downvotes: 2,
    likedBy: [], // Array of user IDs who liked
    dislikedBy: [], // Array of user IDs who disliked
  },
  // Physics I (Course 17)
  {
    id: 25,
    courseId: 17,
    type: "SLIDES",
    title: "MIT 8.01L — Lecture Notes (PDFs)",
    description: "Classical mechanics notes across the full intro sequence.",
    url: "https://ocw.mit.edu/courses/8-01l-physics-i-classical-mechanics-fall-2005/pages/lecture-notes/",
    upvotes: 16,
    downvotes: 1,
    likedBy: [], // Array of user IDs who liked
    dislikedBy: [], // Array of user IDs who disliked
  },
  {
    id: 26,
    courseId: 17,
    type: "LECTURE",
    title: "MIT OCW 8.01SC — Online textbook (with PDFs)",
    description: "Structured classical mechanics text (updated notes).",
    url: "https://ocw.mit.edu/courses/8-01sc-classical-mechanics-fall-2016/pages/online-textbook/",
    upvotes: 13,
    downvotes: 0,
    likedBy: [], // Array of user IDs who liked
    dislikedBy: [], // Array of user IDs who disliked
  },
  {
    id: 27,
    courseId: 17,
    type: "EXAM",
    title: "MIT 8.01SC — Use OCW course materials for practice",
    description:
      "OCW provides problems and structured study materials (varies by version).",
    url: "https://ocw.mit.edu/courses/8-01sc-classical-mechanics-fall-2016/",
    upvotes: 17,
    downvotes: 1,
    likedBy: [], // Array of user IDs who liked
    dislikedBy: [], // Array of user IDs who disliked
  },
  {
    id: 28,
    courseId: 17,
    type: "LINK",
    title: "Physics Classroom",
    description: "Interactive physics tutorials and problem help.",
    url: "https://www.physicsclassroom.com",
    upvotes: 20,
    downvotes: 1,
    likedBy: [], // Array of user IDs who liked
    dislikedBy: [], // Array of user IDs who disliked
  },
  // Anatomy (Course 20)
  {
    id: 29,
    courseId: 20,
    type: "SLIDES",
    title: "OpenStax — Anatomy & Physiology 2e (free textbook)",
    description: "High-quality, openly licensed A&P text (downloadable).",
    url: "https://openstax.org/details/books/anatomy-and-physiology-2e/",
    upvotes: 15,
    downvotes: 1,
    likedBy: [], // Array of user IDs who liked
    dislikedBy: [], // Array of user IDs who disliked
  },
  {
    id: 30,
    courseId: 20,
    type: "LECTURE",
    title: "Crash Course — Anatomy & Physiology (playlist)",
    description: "47-episode intro sequence to anatomy and physiology.",
    url: "https://www.youtube.com/playlist?list=PL5dA4PjS9Jy4eewMbinO0hNZd3uS2LF2h",
    upvotes: 12,
    downvotes: 0,
    likedBy: [], // Array of user IDs who liked
    dislikedBy: [], // Array of user IDs who disliked
  },
  {
    id: 31,
    courseId: 20,
    type: "EXAM",
    title: "MSKÜ note: Lab practicals/exams usually not public",
    description:
      "Typically distributed through DYS/Moodle for enrolled students.",
    url: "https://uzem.mu.edu.tr/Newfiles/1541/dokuman/dys-kilavuz_pdf.pdf",
    upvotes: 18,
    downvotes: 1,
    likedBy: [], // Array of user IDs who liked
    dislikedBy: [], // Array of user IDs who disliked
  },
  {
    id: 32,
    courseId: 20,
    type: "LINK",
    title: "Visible Body",
    description:
      "3D anatomy visualization (some content may require subscription).",
    url: "https://www.visiblebody.com",
    upvotes: 22,
    downvotes: 1,
    likedBy: [], // Array of user IDs who liked
    dislikedBy: [], // Array of user IDs who disliked
  },
  // Physiology (Course 21)
  {
    id: 33,
    courseId: 21,
    type: "SLIDES",
    title: "OpenStax — Anatomy & Physiology 2e (Physiology chapters)",
    description: "Physiology content organized by system (open textbook).",
    url: "https://openstax.org/details/books/anatomy-and-physiology-2e/",
    upvotes: 14,
    downvotes: 1,
    likedBy: [], // Array of user IDs who liked
    dislikedBy: [], // Array of user IDs who disliked
  },
  {
    id: 34,
    courseId: 21,
    type: "LECTURE",
    title: "Crash Course — Anatomy & Physiology (playlist)",
    description:
      "Strong physiology coverage (nervous, cardio, endocrine, etc.).",
    url: "https://www.youtube.com/playlist?list=PL5dA4PjS9Jy4eewMbinO0hNZd3uS2LF2h",
    upvotes: 11,
    downvotes: 0,
    likedBy: [], // Array of user IDs who liked
    dislikedBy: [], // Array of user IDs who disliked
  },
  {
    id: 35,
    courseId: 21,
    type: "EXAM",
    title: "MSKÜ note: Review sheets/exams usually in DYS",
    description:
      "Most official exam/review documents are typically behind login in the university LMS.",
    url: "https://muweb.mu.edu.tr/Newfiles/44/44/%C3%96%C4%9Frenci%20Kullan%C4%B1m%20K%C4%B1lavuzu%20%281%29.pdf",
    upvotes: 16,
    downvotes: 1,
    likedBy: [], // Array of user IDs who liked
    dislikedBy: [], // Array of user IDs who disliked
  },
  {
    id: 36,
    courseId: 21,
    type: "LINK",
    title: "MSKÜ Library — Açık Ders (Open Course Links)",
    description:
      "Directory of open learning portals (useful for physiology MOOCs/resources).",
    url: "https://library.mu.edu.tr/tr-TR/AcikDers/List",
    upvotes: 13,
    downvotes: 0,
    likedBy: [], // Array of user IDs who liked
    dislikedBy: [], // Array of user IDs who disliked
  },
  // Biochemistry (Course 35)
  {
    id: 37,
    courseId: 35,
    type: "SLIDES",
    title: "MIT 7.05 — Downloadable course package (includes PDFs)",
    description:
      "Download full course materials package (except A/V; those are linked separately).",
    url: "https://ocw.mit.edu/courses/7-05-general-biochemistry-spring-2020/download/",
    upvotes: 17,
    downvotes: 1,
    likedBy: [], // Array of user IDs who liked
    dislikedBy: [], // Array of user IDs who disliked
  },
  {
    id: 38,
    courseId: 35,
    type: "LECTURE",
    title: "MIT 7.05 — Selected Lectures (YouTube playlist)",
    description: "Biochemistry lecture playlist from MIT OCW.",
    url: "https://www.youtube.com/playlist?list=PLUl4u3cNGP62wNcIMfinU64CAfreShjpt",
    upvotes: 14,
    downvotes: 0,
    likedBy: [], // Array of user IDs who liked
    dislikedBy: [], // Array of user IDs who disliked
  },
  {
    id: 39,
    courseId: 35,
    type: "EXAM",
    title: "MIT 7.05 — Exams with solutions",
    description: "Exam solution PDFs for the course.",
    url: "https://ocw.mit.edu/courses/7-05-general-biochemistry-spring-2020/resources/exams-with-solutions/",
    upvotes: 19,
    downvotes: 1,
    likedBy: [], // Array of user IDs who liked
    dislikedBy: [], // Array of user IDs who disliked
  },
  {
    id: 40,
    courseId: 35,
    type: "LINK",
    title: "MSKÜ Library — Açık Ders (Open Course Links)",
    description:
      "Open platforms directory for additional biochem courses/resources.",
    url: "https://library.mu.edu.tr/tr-TR/AcikDers/List",
    upvotes: 15,
    downvotes: 1,
    likedBy: [], // Array of user IDs who liked
    dislikedBy: [], // Array of user IDs who disliked
  },
  // Drawing Fundamentals (Course 37)
  {
    id: 41,
    courseId: 37,
    type: "SLIDES",
    title: "Drawabox — Lessons",
    description:
      "Structured drawing fundamentals (lines, perspective, construction).",
    url: "https://drawabox.com",
    upvotes: 10,
    downvotes: 0,
    likedBy: [], // Array of user IDs who liked
    dislikedBy: [], // Array of user IDs who disliked
  },
  {
    id: 42,
    courseId: 37,
    type: "LECTURE",
    title: "Drawabox — Video/lesson-based practice flow",
    description: "Lesson-driven learning path (text + embedded media).",
    url: "https://drawabox.com/lesson/0",
    upvotes: 9,
    downvotes: 0,
    likedBy: [], // Array of user IDs who liked
    dislikedBy: [], // Array of user IDs who disliked
  },
  {
    id: 43,
    courseId: 37,
    type: "EXAM",
    title: "Drawabox — Homework/assignments per lesson",
    description:
      "Each lesson contains required exercises (acts like graded practice).",
    url: "https://drawabox.com",
    upvotes: 8,
    downvotes: 0,
    likedBy: [], // Array of user IDs who liked
    dislikedBy: [], // Array of user IDs who disliked
  },
  {
    id: 44,
    courseId: 37,
    type: "LINK",
    title: "Drawabox",
    description: "Free drawing course and exercises.",
    url: "https://drawabox.com",
    upvotes: 12,
    downvotes: 0,
    likedBy: [], // Array of user IDs who liked
    dislikedBy: [], // Array of user IDs who disliked
  },
  // Music Theory (Course 43)
  {
    id: 45,
    courseId: 43,
    type: "SLIDES",
    title: "MusicTheory.net — Lessons",
    description: "Interactive lessons on notation, rhythm, intervals, chords.",
    url: "https://www.musictheory.net/lessons",
    upvotes: 11,
    downvotes: 0,
    likedBy: [], // Array of user IDs who liked
    dislikedBy: [], // Array of user IDs who disliked
  },
  {
    id: 46,
    courseId: 43,
    type: "LECTURE",
    title: "MusicTheory.net — Exercises",
    description: "Practice drills for ear training and theory skills.",
    url: "https://www.musictheory.net/exercises",
    upvotes: 10,
    downvotes: 0,
    likedBy: [], // Array of user IDs who liked
    dislikedBy: [], // Array of user IDs who disliked
  },
  {
    id: 47,
    courseId: 43,
    type: "EXAM",
    title: "MusicTheory.net — Exercise sets (acts like exams)",
    description: "Timed practice sets for intervals, chords, notes, etc.",
    url: "https://www.musictheory.net/exercises",
    upvotes: 9,
    downvotes: 0,
    likedBy: [], // Array of user IDs who liked
    dislikedBy: [], // Array of user IDs who disliked
  },
  {
    id: 48,
    courseId: 43,
    type: "LINK",
    title: "MusicTheory.net",
    description: "Interactive music theory lessons.",
    url: "https://www.musictheory.net",
    upvotes: 14,
    downvotes: 0,
    likedBy: [], // Array of user IDs who liked
    dislikedBy: [], // Array of user IDs who disliked
  },
  // Art History (Course 48)
  {
    id: 49,
    courseId: 48,
    type: "SLIDES",
    title: "Google Arts & Culture — Collections",
    description:
      "Curated collections and virtual exhibitions useful as art history study material.",
    url: "https://artsandculture.google.com",
    upvotes: 13,
    downvotes: 1,
    likedBy: [], // Array of user IDs who liked
    dislikedBy: [], // Array of user IDs who disliked
  },
  {
    id: 50,
    courseId: 48,
    type: "LECTURE",
    title: "Crash Course — Art History (playlists hub)",
    description: "Crash Course playlists include Art History content.",
    url: "https://www.youtube.com/@crashcourse/playlists",
    upvotes: 11,
    downvotes: 0,
    likedBy: [], // Array of user IDs who liked
    dislikedBy: [], // Array of user IDs who disliked
  },
  {
    id: 51,
    courseId: 48,
    type: "EXAM",
    title: "MSKÜ note: essay guides/exams typically in DYS",
    description:
      "MSKÜ course-specific exam guides are usually inside the LMS for enrolled students.",
    url: "https://uzem.mu.edu.tr/tr/sik-sorulan-sorular-8424",
    upvotes: 12,
    downvotes: 0,
    likedBy: [], // Array of user IDs who liked
    dislikedBy: [], // Array of user IDs who disliked
  },
  {
    id: 52,
    courseId: 48,
    type: "LINK",
    title: "MSKÜ Library — Açık Ders (Open Course Links)",
    description:
      "Directory of open course portals useful for humanities/art history learning.",
    url: "https://library.mu.edu.tr/tr-TR/AcikDers/List",
    upvotes: 18,
    downvotes: 1,
    likedBy: [], // Array of user IDs who liked
    dislikedBy: [], // Array of user IDs who disliked
  },
];

// Users with tracking data
const Users = [
  {
    id: 1,
    name: "Ahmed Student",
    email: "ahmed@student.msku.edu.tr",
    password: "password123", // In production, this should be hashed
    coursesRecentlyViewed: [
      { courseId: 1, viewedAt: new Date("2026-01-05T10:00:00").toISOString() },
      { courseId: 2, viewedAt: new Date("2026-01-05T14:30:00").toISOString() },
      { courseId: 15, viewedAt: new Date("2026-01-06T09:15:00").toISOString() },
    ],
    coursesMostViewed: [
      { courseId: 1, viewCount: 15 },
      { courseId: 2, viewCount: 12 },
      { courseId: 15, viewCount: 8 },
      { courseId: 17, viewCount: 5 },
    ],
    coursesLiked: [1, 2, 15],
    coursesDisliked: [20],
  },
  {
    id: 2,
    name: "Ayşe Student",
    email: "ayse@student.msku.edu.tr",
    password: "password123",
    coursesRecentlyViewed: [
      { courseId: 20, viewedAt: new Date("2026-01-05T11:00:00").toISOString() },
      { courseId: 21, viewedAt: new Date("2026-01-05T15:00:00").toISOString() },
    ],
    coursesMostViewed: [
      { courseId: 20, viewCount: 20 },
      { courseId: 21, viewCount: 18 },
      { courseId: 35, viewCount: 10 },
    ],
    coursesLiked: [20, 21, 35],
    coursesDisliked: [1],
  },
];

module.exports = { Faculty, Departments, Courses, Materials, Users };
