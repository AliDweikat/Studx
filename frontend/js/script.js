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

    // Check if we're on materials page
    const materialGrid = document.querySelector('#materialGrid');
    if (materialGrid) {
        // Check if courseId is in URL
        const urlParams = new URLSearchParams(window.location.search);
        const courseId = urlParams.get('courseId');
        
        // Populate course filter first, then set the value if courseId exists
        populateCourseFilter().then(() => {
            if (courseId) {
                // Set the course filter to the courseId from URL
                const courseFilter = document.getElementById('courseFilter');
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
        const searchInput = document.getElementById('searchInput');
        const typeFilter = document.getElementById('typeFilter');
        const courseFilter = document.getElementById('courseFilter');
        
        if (searchInput) {
            searchInput.addEventListener('input', debounce(fetchMaterials, 300));
        }
        if (typeFilter) {
            typeFilter.addEventListener('change', fetchMaterials);
        }
        if (courseFilter) {
            courseFilter.addEventListener('change', fetchMaterials);
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
                    <div class="card" style="cursor: pointer;" onclick="window.location.href='${getPagesPath('materials.html')}?courseId=${course.id}'">
                        <div class="card-content">
                            <h3>${course.name}</h3>
                            <div class="action-row">
                                <a href="${getPagesPath('materials.html')}?courseId=${course.id}" class="download-link">${t.view_materials || "View Materials"} →</a>
                            </div>
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
                    <div class="card" style="cursor: pointer;" onclick="window.location.href='${getPagesPath('materials.html')}?courseId=${course.id}'">
                        <div class="card-content">
                            <h3>${course.name}</h3>
                            <span class="badge" style="background-color: #A3E4D7; color: #444;">${t.shared || "Shared"}</span>
                            <div class="action-row">
                                <a href="${getPagesPath('materials.html')}?courseId=${course.id}" class="download-link">${t.view_materials || "View Materials"} →</a>
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
        if (!response.ok) throw new Error('Failed to fetch courses');
        
        const courses = await response.json();
        const courseFilter = document.getElementById('courseFilter');
        
        if (courseFilter) {
            const t = translations[currentLang];
            courseFilter.innerHTML = `<option value="">${t.all_courses || "All Courses"}</option>`;
            courses.forEach(course => {
                const option = document.createElement('option');
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
        if (!response.ok) throw new Error('Failed to fetch course');
        
        const course = await response.json();
        const materialsTitle = document.querySelector('[data-i18n="materials_title"]');
        
        if (materialsTitle && course) {
            const t = translations[currentLang];
            materialsTitle.textContent = `${course.name} - ${t.materials_title || "Course Materials"}`;
        }
    } catch (error) {
        console.error("Error fetching course name:", error);
    }
}

async function fetchMaterials() {
    const container = document.querySelector('#materialGrid');
    if (!container) return;

    const t = translations[currentLang];
    container.innerHTML = `<p style="text-align:center;">${t.loading_materials || "Loading materials..."}</p>`;

    try {
        const searchInput = document.getElementById('searchInput');
        const typeFilter = document.getElementById('typeFilter');
        const courseFilter = document.getElementById('courseFilter');

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

        url += params.join('&');

        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const materials = await response.json();
        container.innerHTML = "";

        if (materials.length === 0) {
            container.innerHTML = `<p style="text-align:center; color: var(--text-dark);">${t.empty_materials || "No materials found."}</p>`;
            return;
        }

        materials.forEach(material => {
            const typeColors = {
                'LINK': '#A3E4D7',
                'LECTURE': '#D4A5A0',
                'SLIDES': '#E8D4D2',
                'EXAM': '#C4A5D4'
            };

            const typeIcons = {
                'LINK': '🔗',
                'LECTURE': '📹',
                'SLIDES': '📊',
                'EXAM': '📝'
            };

            const typeColor = typeColors[material.type] || '#D4A5A0';
            const typeIcon = typeIcons[material.type] || '📄';

            const card = `
                <div class="card material-card">
                    <div class="card-content">
                        <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 10px;">
                            <span class="badge" style="background-color: ${typeColor}; color: #444;">${typeIcon} ${material.type}</span>
                            <div class="vote-container">
                                <button class="vote-btn upvote" onclick="voteMaterial(${material.id}, 'upvote', event)" title="Upvote">
                                    👍 <span id="upvotes-${material.id}">${material.upvotes}</span>
                                </button>
                                <button class="vote-btn downvote" onclick="voteMaterial(${material.id}, 'downvote', event)" title="Downvote">
                                    👎 <span id="downvotes-${material.id}">${material.downvotes}</span>
                                </button>
                            </div>
                        </div>
                        <h3 style="margin-top: 0;">${material.title}</h3>
                        <p style="color: #666; margin-bottom: 15px;">${material.description}</p>
                        <a href="${material.url}" target="_blank" class="download-link" style="display: inline-block; margin-top: 10px;">
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
    try {
        const response = await fetch(`${API_BASE_URL}/materials/${materialId}/vote`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ voteType: voteType })
        });

        if (!response.ok) {
            throw new Error('Failed to vote');
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

        // Visual feedback
        if (event && event.target) {
            const button = event.target.closest('.vote-btn');
            if (button) {
                button.style.transform = 'scale(1.2)';
                setTimeout(() => {
                    button.style.transform = 'scale(1)';
                }, 200);
            }
        }

    } catch (error) {
        console.error("Vote error:", error);
        alert('Failed to submit vote. Please try again.');
    }
}