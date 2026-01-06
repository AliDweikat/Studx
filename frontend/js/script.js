const API_BASE_URL = "http://localhost:3000";

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
                            <a href="#" class="download-link">${t.view_btn}</a>
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