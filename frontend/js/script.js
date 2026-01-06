const API_BASE_URL = "http://localhost:3000";

// Helper function to get correct path to pages directory
function getPagesPath(filename) {
    const currentPath = window.location.pathname;
    if (currentPath.includes('/pages/')) {
        // Already in pages directory, just return filename
        return filename;
    } else {
        // In root, need to add pages/ prefix
        return `pages/${filename}`;
    }
}

// 1. Check if user has a saved language, otherwise default to Turkish ('tr')
let currentLang = localStorage.getItem('studx_lang') || 'tr';

document.addEventListener("DOMContentLoaded", () => {
    // Apply the language immediately when page loads
    updatePageLanguage();

    // Fetch the faculty cards from your Node.js server
    const facultyGrid = document.querySelector('.grid');
    if (facultyGrid) {
        fetchFaculties(facultyGrid);
    }

    // Check if we're on departments page
    const departmentsGrid = document.querySelector('#departmentsGrid');
    if (departmentsGrid) {
        const urlParams = new URLSearchParams(window.location.search);
        const facultyId = urlParams.get('facultyId');
        if (facultyId) {
            fetchDepartments(departmentsGrid, facultyId);
        }
    }

    // Check if we're on department detail page
    const coursesGrid = document.querySelector('#coursesGrid');
    if (coursesGrid) {
        const urlParams = new URLSearchParams(window.location.search);
        const departmentId = urlParams.get('departmentId');
        if (departmentId) {
            fetchDepartmentCourses(coursesGrid, departmentId);
        }
    }
});

// --- Language Switching Logic ---
function toggleLanguage() {
    // If it's TR, switch to EN. If EN, switch to TR.
    currentLang = currentLang === 'tr' ? 'en' : 'tr';
    
    // SAVE the choice so it remembers next time
    localStorage.setItem('studx_lang', currentLang);
    
    // Update the text on the screen
    updatePageLanguage();
}

function updatePageLanguage() {
    // 1. Update the "EN / TR" Button text
    const langBtn = document.getElementById('langBtn');
    if (langBtn) langBtn.textContent = currentLang === 'tr' ? "EN" : "TR";

    // 2. Find all text that needs translating and replace it
    document.querySelectorAll('[data-i18n]').forEach(element => {
        const key = element.getAttribute('data-i18n');
        // Look up the word in translations.js
        if (translations[currentLang][key]) {
            element.textContent = translations[currentLang][key];
        }
    });
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

        faculties.forEach(faculty => {
            const imageUrl = `${API_BASE_URL}/${faculty.image}`;
            
            const card = `
                <div class="card">
                    <img src="${imageUrl}" alt="${faculty.name}" style="width:100%; height:200px; object-fit:cover;">
                    <div class="card-content">
                        <h3>${faculty.name}</h3>
                        <div class="action-row">
                            <a href="${getPagesPath('departments.html')}?facultyId=${faculty.id}" class="download-link">${t.view_btn}</a>
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
    container.innerHTML = `<p style="text-align:center;">${t.loading_departments || "Loading departments..."}</p>`;

    try {
        const [departmentsRes, facultyRes] = await Promise.all([
            fetch(`${API_BASE_URL}/departments?facultyId=${facultyId}`),
            fetch(`${API_BASE_URL}/faculty`)
        ]);

        if (!departmentsRes.ok || !facultyRes.ok) {
            throw new Error(`HTTP error!`);
        }

        const departments = await departmentsRes.json();
        const faculties = await facultyRes.json();
        const faculty = faculties.find(f => f.id === parseInt(facultyId));

        container.innerHTML = "";

        // Show faculty name
        const facultyName = document.querySelector('#facultyName');
        if (facultyName && faculty) {
            facultyName.textContent = faculty.name;
        }

        if (departments.length === 0) {
            container.innerHTML = `<p>${t.empty_departments || "No departments found."}</p>`;
            return;
        }

        departments.forEach(department => {
            const card = `
                <div class="card">
                    <div class="card-content">
                        <h3>${department.name}</h3>
                        <div class="action-row">
                            <a href="${getPagesPath('department.html')}?departmentId=${department.id}" class="download-link">${t.view_courses || "View Courses"}</a>
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
    container.innerHTML = `<p style="text-align:center;">${t.loading_courses || "Loading courses..."}</p>`;

    try {
        const [coursesRes, departmentRes] = await Promise.all([
            fetch(`${API_BASE_URL}/courses?departmentId=${departmentId}`),
            fetch(`${API_BASE_URL}/departments/${departmentId}`)
        ]);

        if (!coursesRes.ok || !departmentRes.ok) {
            throw new Error(`HTTP error!`);
        }

        const courses = await coursesRes.json();
        const department = await departmentRes.json();

        container.innerHTML = "";

        // Show department name
        const departmentName = document.querySelector('#departmentName');
        if (departmentName) {
            departmentName.textContent = department.name;
        }

        if (courses.length === 0) {
            container.innerHTML = `<p>${t.empty_courses || "No courses found."}</p>`;
            return;
        }

        // Separate department-specific and shared courses
        const departmentCourses = courses.filter(c => c.departmentId === parseInt(departmentId));
        const sharedCourses = courses.filter(c => c.departmentId === null);

        let htmlContent = "";

        // Show department-specific courses
        if (departmentCourses.length > 0) {
            htmlContent += `<h3 style="color: var(--accent-main); margin-top: 20px; margin-bottom: 15px; grid-column: 1 / -1;">${t.department_courses || "Department Courses"}</h3>`;

            departmentCourses.forEach(course => {
                htmlContent += `
                    <div class="card">
                        <div class="card-content">
                            <h3>${course.name}</h3>
                        </div>
                    </div>
                `;
            });
        }

        // Show shared courses
        if (sharedCourses.length > 0) {
            htmlContent += `<h3 style="color: var(--accent-main); margin-top: 30px; margin-bottom: 15px; grid-column: 1 / -1;">${t.shared_courses || "Shared Courses"}</h3>`;

            sharedCourses.forEach(course => {
                htmlContent += `
                    <div class="card">
                        <div class="card-content">
                            <h3>${course.name}</h3>
                            <span class="badge" style="background-color: #A3E4D7; color: #444;">${t.shared || "Shared"}</span>
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