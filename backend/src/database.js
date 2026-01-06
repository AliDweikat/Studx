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

const Courses = [
  {
    id: 1,
    name: "Computer Science",
    facultyId: 1,
  },
  {
    id: 2,
    name: "Medicine Basic Sciences",
    facultyId: 2,
  },
  {
    id: 3,
    name: "Art History",
    facultyId: 3,
  },
];

module.exports = { Faculty, Courses };
