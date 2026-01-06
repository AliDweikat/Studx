const API_BASE_URL = "https://studx-backend.onrender.com";

// Helper function to get correct path to pages directory
function getPagesPath(filename) {
  const currentPath = window.location.pathname;
  if (currentPath.includes("/pages/")) {
    // Already in pages directory, just return filename
    return filename;
  } else {
    // In root, need to add pages/ prefix
    return `pages/${filename}`;
  }
}

// Cookie helper functions for session management
function setCookie(name, value, days = 7) {
  const expires = new Date();
  expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
  // Use path=/ to ensure cookie is available across all pages
  // SameSite=Lax for security, works with localhost
  const cookieString = `${name}=${encodeURIComponent(
    value
  )};expires=${expires.toUTCString()};path=/;SameSite=Lax`;
  document.cookie = cookieString;
  // Verify cookie was set
  if (!getCookie(name)) {
    console.warn(`Failed to set cookie: ${name}`);
  }
}

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

function deleteCookie(name) {
  document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;`;
}

// 1. Check if user has a saved language, otherwise default to Turkish ('tr')
let currentLang = localStorage.getItem("studx_lang") || "tr";

document.addEventListener("DOMContentLoaded", () => {
  // Check and update user authentication state
  updateAuthUI();

  // Apply the language immediately when page loads
  updatePageLanguage();

  // Fetch the faculty cards from your Node.js server
  const facultyGrid =
    document.querySelector("#facultiesGrid") || document.querySelector(".grid");
  if (facultyGrid) {
    fetchFaculties(facultyGrid);
  }

  // Check if user is logged in and load user courses
  const user = getCurrentUser();
  if (user) {
    loadUserCoursesOnHomepage();
  }

  // Check if we're on departments page
  const departmentsGrid = document.querySelector("#departmentsGrid");
  if (departmentsGrid) {
    const urlParams = new URLSearchParams(window.location.search);
    const facultyId = urlParams.get("facultyId");
    if (facultyId) {
      fetchDepartments(departmentsGrid, facultyId);
    }
  }

  // Check if we're on department detail page
  const coursesGrid = document.querySelector("#coursesGrid");
  if (coursesGrid) {
    const urlParams = new URLSearchParams(window.location.search);
    const departmentId = urlParams.get("departmentId");
    if (departmentId) {
      fetchDepartmentCourses(coursesGrid, departmentId);
    }
  }

  // Check if we're on login page
  const loginForm = document.getElementById("loginForm");
  if (loginForm) {
    loginForm.addEventListener("submit", handleLogin);
  }

  // Check if we're on register page
  const registerForm = document.getElementById("registerForm");
  if (registerForm) {
    registerForm.addEventListener("submit", handleRegister);
  }

  // Check if we're on profile page
  const profileContent = document.getElementById("profileContent");
  if (profileContent) {
    loadUserProfile();
  }

  // Check if we're on materials page
  const materialGrid = document.querySelector("#materialGrid");
  if (materialGrid) {
    // Check if courseId is in URL
    const urlParams = new URLSearchParams(window.location.search);
    const courseId = urlParams.get("courseId");

    // Populate course filter first, then set the value if courseId exists
    populateCourseFilter().then(() => {
      if (courseId) {
        // Set the course filter to the courseId from URL
        const courseFilter = document.getElementById("courseFilter");
        if (courseFilter) {
          courseFilter.value = courseId;
          // Fetch course name for display
          fetchCourseName(courseId);
        }
      }
      // Fetch materials after filter is set
      fetchMaterials();
    });

    // Add event listeners for search and filters
    const searchInput = document.getElementById("searchInput");
    const typeFilter = document.getElementById("typeFilter");
    const courseFilter = document.getElementById("courseFilter");

    if (searchInput) {
      searchInput.addEventListener("input", debounce(fetchMaterials, 300));
    }
    if (typeFilter) {
      typeFilter.addEventListener("change", fetchMaterials);
    }
    if (courseFilter) {
      courseFilter.addEventListener("change", fetchMaterials);
    }
  }
});

// Debounce helper function
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// --- Language Switching Logic ---
function toggleLanguage() {
  // If it's TR, switch to EN. If EN, switch to TR.
  currentLang = currentLang === "tr" ? "en" : "tr";

  // SAVE the choice so it remembers next time
  localStorage.setItem("studx_lang", currentLang);

  // Update the text on the screen
  updatePageLanguage();
}

function updatePageLanguage() {
  // 1. Update the "EN / TR" Button text
  const langBtn = document.getElementById("langBtn");
  if (langBtn) langBtn.textContent = currentLang === "tr" ? "EN" : "TR";

  // 2. Find all text that needs translating and replace it
  document.querySelectorAll("[data-i18n]").forEach((element) => {
    const key = element.getAttribute("data-i18n");
    // Look up the word in translations.js
    if (translations[currentLang][key]) {
      element.textContent = translations[currentLang][key];
    }
  });

  // 3. Update auth UI after language change
  updateAuthUI();

  // 4. Update translations for user courses if on homepage (without reloading data)
  const recentGrid = document.getElementById("recentCoursesGrid");
  const mostViewedGrid = document.getElementById("mostViewedCoursesGrid");
  if (recentGrid && mostViewedGrid) {
    // Just update the translations for existing elements, don't reload data
    document.querySelectorAll("[data-i18n]").forEach((element) => {
      const key = element.getAttribute("data-i18n");
      if (translations[currentLang] && translations[currentLang][key]) {
        element.textContent = translations[currentLang][key];
      }
    });
  }
}

// --- Fetch Logic (Your Node.js Backend) ---
async function fetchFaculties(container) {
  const t = translations[currentLang]; // Get current dictionary words
  container.innerHTML = `<p style="text-align:center;">${t.loading}</p>`;

  try {
    const response = await fetch(`${API_BASE_URL}/faculty`);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const faculties = await response.json();

    container.innerHTML = ""; // Clear loading message

    if (faculties.length === 0) {
      container.innerHTML = `<p>${t.empty_list}</p>`;
      return;
    }

    faculties.forEach((faculty) => {
      const imageUrl = `${API_BASE_URL}/${faculty.image}`;

      const card = `
                <div class="card">
                    <img src="${imageUrl}" alt="${
        faculty.name
      }" style="width:100%; height:200px; object-fit:cover;">
                    <div class="card-content">
                        <h3>${faculty.name}</h3>
                        <div class="action-row">
                            <a href="${getPagesPath(
                              "departments.html"
                            )}?facultyId=${faculty.id}" class="download-link">${
        t.view_btn
      }</a>
                        </div>
                    </div>
                </div>
            `;
      container.innerHTML += card;
    });
  } catch (error) {
    console.error("Fetch error:", error);
    container.innerHTML = `<p style="color:red; text-align:center;">${t.error_fetch}</p>`;
  }
}

// --- Fetch Departments for a Faculty ---
async function fetchDepartments(container, facultyId) {
  const t = translations[currentLang];
  container.innerHTML = `<p style="text-align:center;">${
    t.loading_departments || "Loading departments..."
  }</p>`;

  try {
    const [departmentsRes, facultyRes] = await Promise.all([
      fetch(`${API_BASE_URL}/departments?facultyId=${facultyId}`),
      fetch(`${API_BASE_URL}/faculty`),
    ]);

    if (!departmentsRes.ok || !facultyRes.ok) {
      throw new Error(`HTTP error!`);
    }

    const departments = await departmentsRes.json();
    const faculties = await facultyRes.json();
    const faculty = faculties.find((f) => f.id === parseInt(facultyId));

    container.innerHTML = "";

    // Show faculty name
    const facultyName = document.querySelector("#facultyName");
    if (facultyName && faculty) {
      facultyName.textContent = faculty.name;
    }

    if (departments.length === 0) {
      container.innerHTML = `<p>${
        t.empty_departments || "No departments found."
      }</p>`;
      return;
    }

    departments.forEach((department) => {
      const card = `
                <div class="card">
                    <div class="card-content">
                        <h3>${department.name}</h3>
                        <div class="action-row">
                            <a href="${getPagesPath(
                              "department.html"
                            )}?departmentId=${
        department.id
      }" class="download-link">${t.view_courses || "View Courses"}</a>
                        </div>
                    </div>
                </div>
            `;
      container.innerHTML += card;
    });
  } catch (error) {
    console.error("Fetch error:", error);
    container.innerHTML = `<p style="color:red; text-align:center;">${t.error_fetch}</p>`;
  }
}

// --- Fetch Courses for a Department (including shared) ---
async function fetchDepartmentCourses(container, departmentId) {
  const t = translations[currentLang];
  container.innerHTML = `<p style="text-align:center;">${
    t.loading_courses || "Loading courses..."
  }</p>`;

  try {
    const [coursesRes, departmentRes] = await Promise.all([
      fetch(`${API_BASE_URL}/courses?departmentId=${departmentId}`),
      fetch(`${API_BASE_URL}/departments/${departmentId}`),
    ]);

    if (!coursesRes.ok || !departmentRes.ok) {
      throw new Error(`HTTP error!`);
    }

    const courses = await coursesRes.json();
    const department = await departmentRes.json();

    container.innerHTML = "";

    // Show department name
    const departmentName = document.querySelector("#departmentName");
    if (departmentName) {
      departmentName.textContent = department.name;
    }

    if (courses.length === 0) {
      container.innerHTML = `<p>${t.empty_courses || "No courses found."}</p>`;
      return;
    }

    // Separate department-specific and shared courses
    const departmentCourses = courses.filter(
      (c) => c.departmentId === parseInt(departmentId)
    );
    const sharedCourses = courses.filter((c) => c.departmentId === null);

    let htmlContent = "";

    // Show department-specific courses
    if (departmentCourses.length > 0) {
      htmlContent += `<h3 style="color: var(--accent-main); margin-top: 20px; margin-bottom: 15px; grid-column: 1 / -1;">${
        t.department_courses || "Department Courses"
      }</h3>`;

      departmentCourses.forEach((course) => {
        htmlContent += `
                    <div class="card" style="cursor: pointer;" onclick="trackCourseView(${
                      course.id
                    }); window.location.href='${getPagesPath(
          "materials.html"
        )}?courseId=${course.id}'">
                        <div class="card-content">
                            <h3>${course.name}</h3>
                            <div class="action-row">
                                <a href="${getPagesPath(
                                  "materials.html"
                                )}?courseId=${
          course.id
        }" class="download-link" onclick="event.stopPropagation(); trackCourseView(${
          course.id
        });">${t.view_materials || "View Materials"} →</a>
                            </div>
                        </div>
                    </div>
                `;
      });
    }

    // Show shared courses
    if (sharedCourses.length > 0) {
      htmlContent += `<h3 style="color: var(--accent-main); margin-top: 30px; margin-bottom: 15px; grid-column: 1 / -1;">${
        t.shared_courses || "Shared Courses"
      }</h3>`;

      sharedCourses.forEach((course) => {
        htmlContent += `
                    <div class="card" style="cursor: pointer;" onclick="trackCourseView(${
                      course.id
                    }); window.location.href='${getPagesPath(
          "materials.html"
        )}?courseId=${course.id}'">
                        <div class="card-content">
                            <h3>${course.name}</h3>
                            <span class="badge" style="background-color: #A3E4D7; color: #444;">${
                              t.shared || "Shared"
                            }</span>
                            <div class="action-row">
                                <a href="${getPagesPath(
                                  "materials.html"
                                )}?courseId=${
          course.id
        }" class="download-link" onclick="event.stopPropagation(); trackCourseView(${
          course.id
        });">${t.view_materials || "View Materials"} →</a>
                            </div>
                        </div>
                    </div>
                `;
      });
    }

    container.innerHTML = htmlContent;
  } catch (error) {
    console.error("Fetch error:", error);
    container.innerHTML = `<p style="color:red; text-align:center;">${t.error_fetch}</p>`;
  }
}

// --- Materials Functions ---
async function populateCourseFilter() {
  try {
    const response = await fetch(`${API_BASE_URL}/courses`);
    if (!response.ok) throw new Error("Failed to fetch courses");

    const courses = await response.json();
    const courseFilter = document.getElementById("courseFilter");

    if (courseFilter) {
      const t = translations[currentLang];
      courseFilter.innerHTML = `<option value="">${
        t.all_courses || "All Courses"
      }</option>`;
      courses.forEach((course) => {
        const option = document.createElement("option");
        option.value = course.id;
        option.textContent = course.name;
        courseFilter.appendChild(option);
      });
    }
    return Promise.resolve();
  } catch (error) {
    console.error("Error populating course filter:", error);
    return Promise.reject(error);
  }
}

async function fetchCourseName(courseId) {
  try {
    const response = await fetch(`${API_BASE_URL}/courses/${courseId}`);
    if (!response.ok) throw new Error("Failed to fetch course");

    const course = await response.json();
    const materialsTitle = document.querySelector(
      '[data-i18n="materials_title"]'
    );

    if (materialsTitle && course) {
      const t = translations[currentLang];
      materialsTitle.textContent = `${course.name} - ${
        t.materials_title || "Course Materials"
      }`;
    }
  } catch (error) {
    console.error("Error fetching course name:", error);
  }
}

async function fetchMaterials() {
  const container = document.querySelector("#materialGrid");
  if (!container) return;

  const t = translations[currentLang];
  container.innerHTML = `<p style="text-align:center;">${
    t.loading_materials || "Loading materials..."
  }</p>`;

  try {
    const searchInput = document.getElementById("searchInput");
    const typeFilter = document.getElementById("typeFilter");
    const courseFilter = document.getElementById("courseFilter");

    let url = `${API_BASE_URL}/materials?`;
    const params = [];

    if (searchInput && searchInput.value.trim()) {
      params.push(`search=${encodeURIComponent(searchInput.value.trim())}`);
    }
    if (typeFilter && typeFilter.value) {
      params.push(`type=${encodeURIComponent(typeFilter.value)}`);
    }
    if (courseFilter && courseFilter.value) {
      params.push(`courseId=${encodeURIComponent(courseFilter.value)}`);
    }

    url += params.join("&");

    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const materials = await response.json();
    container.innerHTML = "";

    if (materials.length === 0) {
      container.innerHTML = `<p style="text-align:center; color: var(--text-dark);">${
        t.empty_materials || "No materials found."
      }</p>`;
      return;
    }

    // Get user vote status if logged in
    const user = getCurrentUser();
    let voteStatus = {};
    if (user) {
      try {
        const voteStatusRes = await fetch(
          `${API_BASE_URL}/materials/vote-status/${user.id}`
        );
        if (voteStatusRes.ok) {
          voteStatus = await voteStatusRes.json();
        }
      } catch (error) {
        console.error("Error fetching vote status:", error);
      }
    }

    materials.forEach((material) => {
      const typeColors = {
        LINK: "#A3E4D7",
        LECTURE: "#D4A5A0",
        SLIDES: "#E8D4D2",
        EXAM: "#C4A5D4",
      };

      const typeIcons = {
        LINK: "🔗",
        LECTURE: "📹",
        SLIDES: "📊",
        EXAM: "📝",
      };

      const typeColor = typeColors[material.type] || "#D4A5A0";
      const typeIcon = typeIcons[material.type] || "📄";

      // Check vote status for this material
      const materialVoteStatus = voteStatus[material.id] || {
        hasLiked: false,
        hasDisliked: false,
      };
      const upvoteStyle = materialVoteStatus.hasLiked
        ? "background-color: #4CAF50; color: white;"
        : "";
      const downvoteStyle = materialVoteStatus.hasDisliked
        ? "background-color: #F44336; color: white;"
        : "";

      const card = `
                <div class="card material-card">
                    <div class="card-content">
                        <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 10px;">
                            <span class="badge" style="background-color: ${typeColor}; color: #444;">${typeIcon} ${
        material.type
      }</span>
                            <div class="vote-container">
                                <button id="upvote-btn-${
                                  material.id
                                }" class="vote-btn upvote" onclick="voteMaterial(${
        material.id
      }, 'upvote', event)" title="Upvote" style="${upvoteStyle}">
                                    👍 <span id="upvotes-${material.id}">${
        material.upvotes
      }</span>
                                </button>
                                <button id="downvote-btn-${
                                  material.id
                                }" class="vote-btn downvote" onclick="voteMaterial(${
        material.id
      }, 'downvote', event)" title="Downvote" style="${downvoteStyle}">
                                    👎 <span id="downvotes-${material.id}">${
        material.downvotes
      }</span>
                                </button>
                            </div>
                        </div>
                        <h3 style="margin-top: 0;">${material.title}</h3>
                        <p style="color: #666; margin-bottom: 15px;">${
                          material.description
                        }</p>
                        <a href="${
                          material.url
                        }" target="_blank" class="download-link" style="display: inline-block; margin-top: 10px;">
                            ${t.view_material || "View Material"} →
                        </a>
                    </div>
                </div>
            `;
      container.innerHTML += card;
    });
  } catch (error) {
    console.error("Fetch error:", error);
    container.innerHTML = `<p style="color:red; text-align:center;">${t.error_fetch}</p>`;
  }
}

async function voteMaterial(materialId, voteType, event) {
  const user = getCurrentUser();
  if (!user) {
    alert("Please log in to vote");
    window.location.href = getPagesPath("login.html");
    return;
  }

  try {
    const response = await fetch(
      `${API_BASE_URL}/materials/${materialId}/vote`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ voteType: voteType, userId: user.id }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to vote");
    }

    const result = await response.json();

    // Update the vote counts in the UI
    const upvotesElement = document.getElementById(`upvotes-${materialId}`);
    const downvotesElement = document.getElementById(`downvotes-${materialId}`);

    if (upvotesElement) {
      upvotesElement.textContent = result.upvotes;
    }
    if (downvotesElement) {
      downvotesElement.textContent = result.downvotes;
    }

    // Update button styles based on vote state
    const upvoteBtn = document.querySelector(`#upvote-btn-${materialId}`);
    const downvoteBtn = document.querySelector(`#downvote-btn-${materialId}`);

    if (upvoteBtn) {
      if (result.hasLiked) {
        upvoteBtn.style.backgroundColor = "#4CAF50";
        upvoteBtn.style.color = "white";
      } else {
        upvoteBtn.style.backgroundColor = "var(--white)";
        upvoteBtn.style.color = "var(--text-dark)";
      }
    }

    if (downvoteBtn) {
      if (result.hasDisliked) {
        downvoteBtn.style.backgroundColor = "#F44336";
        downvoteBtn.style.color = "white";
      } else {
        downvoteBtn.style.backgroundColor = "var(--white)";
        downvoteBtn.style.color = "var(--text-dark)";
      }
    }

    // Visual feedback
    if (event && event.target) {
      const button = event.target.closest(".vote-btn");
      if (button) {
        button.style.transform = "scale(1.2)";
        setTimeout(() => {
          button.style.transform = "scale(1)";
        }, 200);
      }
    }
  } catch (error) {
    console.error("Vote error:", error);
    alert(error.message || "Failed to submit vote. Please try again.");
  }
}

// --- Authentication Functions ---
async function handleLogin(e) {
  e.preventDefault();

  const email = document.getElementById("loginEmail").value;
  const password = document.getElementById("loginPassword").value;
  const errorDiv = document.getElementById("loginError");

  try {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    const result = await response.json();

    if (!response.ok) {
      errorDiv.textContent = result.error || "Login failed";
      errorDiv.style.display = "block";
      return;
    }

    // Store user data in cookie
    setCookie("studx_user", JSON.stringify(result.user), 7);

    // Update auth UI
    updateAuthUI();

    // Redirect to home
    window.location.href = "../index.html";
  } catch (error) {
    console.error("Login error:", error);
    errorDiv.textContent = "An error occurred. Please try again.";
    errorDiv.style.display = "block";
  }
}

async function handleRegister(e) {
  e.preventDefault();

  const name = document.getElementById("registerName").value;
  const email = document.getElementById("registerEmail").value;
  const password = document.getElementById("registerPassword").value;
  const errorDiv = document.getElementById("registerError");

  try {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, email, password }),
    });

    const result = await response.json();

    if (!response.ok) {
      errorDiv.textContent = result.error || "Registration failed";
      errorDiv.style.display = "block";
      return;
    }

    // Store user data in cookie
    setCookie("studx_user", JSON.stringify(result.user), 7);

    // Update auth UI
    updateAuthUI();

    // Redirect to home
    window.location.href = "../index.html";
  } catch (error) {
    console.error("Register error:", error);
    errorDiv.textContent = "An error occurred. Please try again.";
    errorDiv.style.display = "block";
  }
}

// Helper function to get current user from cookie
function getCurrentUser() {
  const userStr = getCookie("studx_user");
  return userStr ? JSON.parse(userStr) : null;
}

// Update authentication UI across all pages
function updateAuthUI() {
  const user = getCurrentUser();
  // Use ID selector first, fallback to nav-links selector to avoid hero button
  const loginButton =
    document.getElementById("navLoginButton") ||
    document.querySelector(".nav-links .btn-login") ||
    document.querySelector(".btn-login");
  const t = translations[currentLang] || translations.tr;

  // Remove ALL existing logout buttons first
  document.querySelectorAll(".logout-btn").forEach((btn) => btn.remove());

  // Show/hide profile link
  const profileLink = document.getElementById("profileLink");
  if (profileLink) {
    if (user) {
      profileLink.style.display = "inline-block";
    } else {
      profileLink.style.display = "none";
    }
  }

  if (loginButton) {
    if (user) {
      // User is logged in - HIDE login button
      loginButton.style.display = "none";

      // Add logout button
      const logoutBtn = document.createElement("a");
      logoutBtn.href = "#";
      logoutBtn.className = "logout-btn";
      logoutBtn.textContent = t.logout || "Çıkış Yap";
      logoutBtn.style.marginLeft = "15px";
      logoutBtn.style.color = "var(--accent-main)";
      logoutBtn.style.textDecoration = "none";
      logoutBtn.style.fontWeight = "600";
      logoutBtn.style.fontSize = "0.95rem";
      logoutBtn.style.cursor = "pointer";
      logoutBtn.onclick = (e) => {
        e.preventDefault();
        handleLogout();
      };

      if (loginButton.parentElement) {
        loginButton.parentElement.appendChild(logoutBtn);
      }
    } else {
      // User is not logged in - SHOW login button
      loginButton.style.display = "inline-block";
      loginButton.textContent = t.nav_login || "Giriş Yap";
      loginButton.href = getPagesPath("login.html");
      loginButton.style.cursor = "pointer";
      loginButton.onclick = null;
      loginButton.className = "btn-login";
    }
  }
}

// Handle user logout
function handleLogout() {
  const t = translations[currentLang] || translations.tr;
  const confirmMsg =
    currentLang === "tr"
      ? "Çıkış yapmak istediğinize emin misiniz?"
      : "Are you sure you want to logout?";

  if (confirm(confirmMsg)) {
    deleteCookie("studx_user");

    // Update UI immediately
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

// Helper function to track course view
async function trackCourseView(courseId) {
  const user = getCurrentUser();
  if (!user) return;

  try {
    await fetch(`${API_BASE_URL}/users/${user.id}/courses/${courseId}/view`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("Error tracking course view:", error);
  }
}

// Load user courses on homepage
async function loadUserCoursesOnHomepage() {
  const user = getCurrentUser();
  if (!user) return;

  const userSections = document.getElementById("userSections");
  const recentGrid = document.getElementById("recentCoursesGrid");
  const mostViewedGrid = document.getElementById("mostViewedCoursesGrid");

  if (!userSections || !recentGrid || !mostViewedGrid) return;

  try {
    // Fetch fresh user data
    const userRes = await fetch(`${API_BASE_URL}/users/${user.id}`);
    if (!userRes.ok) return;

    const userData = await userRes.json();

    // Fetch all courses for names
    const coursesRes = await fetch(`${API_BASE_URL}/courses`);
    const allCourses = coursesRes.ok ? await coursesRes.json() : [];

    // Show user sections
    userSections.style.display = "block";

    // Display recently viewed courses (limit to 6)
    const recentCourses = userData.coursesRecentlyViewed || [];
    if (recentCourses.length > 0) {
      recentGrid.innerHTML = "";
      recentCourses.slice(0, 6).forEach((view) => {
        const course = allCourses.find((c) => c.id === view.courseId);
        if (course) {
          const t = translations[currentLang] || translations.tr;
          const viewedDate = new Date(view.viewedAt).toLocaleDateString();
          const card = `
                        <div class="card" style="cursor: pointer;" onclick="trackCourseView(${
                          course.id
                        }); window.location.href='${getPagesPath(
            "materials.html"
          )}?courseId=${course.id}'">
                            <div class="card-content">
                                <h3>${course.name}</h3>
                                <p style="color: #666; font-size: 0.9rem;">${
                                  t.viewed_on || "Viewed on"
                                }: ${viewedDate}</p>
                                <div class="action-row">
                                    <a href="${getPagesPath(
                                      "materials.html"
                                    )}?courseId=${
            course.id
          }" class="download-link" onclick="event.stopPropagation(); trackCourseView(${
            course.id
          });">${t.view_materials || "View Materials"} →</a>
                                </div>
                            </div>
                        </div>
                    `;
          recentGrid.innerHTML += card;
        }
      });
    } else {
      const t = translations[currentLang] || translations.tr;
      recentGrid.innerHTML = `<p style="text-align:center; color: #666;" data-i18n="no_recent_courses">${
        t.no_recent_courses || "No recently viewed courses."
      }</p>`;
    }

    // Display most viewed courses (limit to 6)
    const mostViewed = userData.coursesMostViewed || [];
    if (mostViewed.length > 0) {
      mostViewedGrid.innerHTML = "";
      mostViewed.slice(0, 6).forEach((view) => {
        const course = allCourses.find((c) => c.id === view.courseId);
        if (course) {
          const t = translations[currentLang] || translations.tr;
          const card = `
                        <div class="card" style="cursor: pointer;" onclick="trackCourseView(${
                          course.id
                        }); window.location.href='${getPagesPath(
            "materials.html"
          )}?courseId=${course.id}'">
                            <div class="card-content">
                                <h3>${course.name}</h3>
                                <p style="color: var(--accent-main); font-weight: bold; font-size: 1.1rem;">
                                    ${view.viewCount} ${
            view.viewCount === 1 ? t.view || "view" : t.views || "views"
          }
                                </p>
                                <div class="action-row">
                                    <a href="${getPagesPath(
                                      "materials.html"
                                    )}?courseId=${
            course.id
          }" class="download-link" onclick="event.stopPropagation(); trackCourseView(${
            course.id
          });">${t.view_materials || "View Materials"} →</a>
                                </div>
                            </div>
                        </div>
                    `;
          mostViewedGrid.innerHTML += card;
        }
      });
    } else {
      const t = translations[currentLang] || translations.tr;
      mostViewedGrid.innerHTML = `<p style="text-align:center; color: #666;" data-i18n="no_most_viewed_courses">${
        t.no_most_viewed_courses || "No most viewed courses."
      }</p>`;
    }

    // Update translations for dynamically created elements only
    document.querySelectorAll("[data-i18n]").forEach((element) => {
      const key = element.getAttribute("data-i18n");
      if (translations[currentLang] && translations[currentLang][key]) {
        element.textContent = translations[currentLang][key];
      }
    });
  } catch (error) {
    console.error("Error loading user courses:", error);
  }
}

// Load user profile page
async function loadUserProfile() {
  const user = getCurrentUser();
  const profileContent = document.getElementById("profileContent");
  const notLoggedIn = document.getElementById("notLoggedIn");
  const t = translations[currentLang] || translations.tr;

  if (!user) {
    if (notLoggedIn) {
      notLoggedIn.style.display = "block";
      notLoggedIn.textContent =
        t.login_required || "Please log in to view your profile.";
    }
    if (profileContent) {
      profileContent.innerHTML = `<p style="text-align:center;"><a href="login.html" style="color: var(--accent-main);">${
        t.login_link || "Log In"
      }</a></p>`;
    }
    return;
  }

  try {
    // Fetch fresh user data
    const response = await fetch(`${API_BASE_URL}/users/${user.id}`);
    if (!response.ok) throw new Error("Failed to fetch user data");

    const userData = await response.json();

    // Fetch all courses for names
    const coursesRes = await fetch(`${API_BASE_URL}/courses`);
    const allCourses = coursesRes.ok ? await coursesRes.json() : [];

    let html = `
            <div style="text-align: center; margin-bottom: 40px;">
                <h2 style="color: var(--accent-main);">${userData.name}</h2>
                <p style="color: #666;">${userData.email}</p>
            </div>
        `;

    // Recently viewed courses
    if (
      userData.coursesRecentlyViewed &&
      userData.coursesRecentlyViewed.length > 0
    ) {
      html += `<h3 style="color: var(--accent-main); margin-top: 30px; margin-bottom: 20px;" data-i18n="recent_courses">Recently Viewed Courses</h3>`;
      html += `<div class="grid">`;

      userData.coursesRecentlyViewed.forEach((view) => {
        const course = allCourses.find((c) => c.id === view.courseId);
        if (course) {
          const viewedDate = new Date(view.viewedAt).toLocaleDateString();
          html += `
                        <div class="card">
                            <div class="card-content">
                                <h3>${course.name}</h3>
                                <p style="color: #666; font-size: 0.9rem;">${
                                  t.viewed_on || "Viewed on"
                                }: ${viewedDate}</p>
                                <div class="action-row">
                                    <a href="${getPagesPath(
                                      "materials.html"
                                    )}?courseId=${
            course.id
          }" class="download-link">${t.view_materials || "View Materials"} →</a>
                                </div>
                            </div>
                        </div>
                    `;
        }
      });
      html += `</div>`;
    } else {
      html += `<p style="text-align:center; color: #666;" data-i18n="no_recent_courses">No recently viewed courses.</p>`;
    }

    // Most viewed courses
    if (userData.coursesMostViewed && userData.coursesMostViewed.length > 0) {
      html += `<h3 style="color: var(--accent-main); margin-top: 40px; margin-bottom: 20px;" data-i18n="most_viewed_courses">Most Viewed Courses</h3>`;
      html += `<div class="grid">`;

      userData.coursesMostViewed.forEach((view) => {
        const course = allCourses.find((c) => c.id === view.courseId);
        if (course) {
          html += `
                        <div class="card">
                            <div class="card-content">
                                <h3>${course.name}</h3>
                                <p style="color: var(--accent-main); font-weight: bold; font-size: 1.1rem;">
                                    ${view.viewCount} ${
            view.viewCount === 1 ? t.view || "view" : t.views || "views"
          }
                                </p>
                                <div class="action-row">
                                    <a href="${getPagesPath(
                                      "materials.html"
                                    )}?courseId=${
            course.id
          }" class="download-link">${t.view_materials || "View Materials"} →</a>
                                </div>
                            </div>
                        </div>
                    `;
        }
      });
      html += `</div>`;
    } else {
      html += `<p style="text-align:center; color: #666;" data-i18n="no_most_viewed_courses">No most viewed courses yet.</p>`;
    }

    if (profileContent) {
      profileContent.innerHTML = html;
      updatePageLanguage(); // Update translations
    }
  } catch (error) {
    console.error("Error loading profile:", error);
    if (profileContent) {
      profileContent.innerHTML = `<p style="text-align:center; color: red;">${
        t.error_fetch || "Error loading profile"
      }</p>`;
    }
  }
}
