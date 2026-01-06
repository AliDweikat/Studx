const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();
const PORT = 3000;

// 1. Serve static files (HTML, CSS, Images) from the 'public' folder
app.use(express.static('public'));

// 2. API Route: Get All Materials (with optional Search)
app.get('/api/materials', (req, res) => {
    // Read the database file
    fs.readFile(path.join(__dirname, 'data', 'materials.json'), 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: "Failed to load data" });
        }

        let materials = JSON.parse(data);
        
        // Check if there is a search query (e.g., ?q=calculus)
        const searchQuery = req.query.q;
        if (searchQuery) {
            const lowerCaseQuery = searchQuery.toLowerCase();
            materials = materials.filter(item => 
                item.title.toLowerCase().includes(lowerCaseQuery) ||
                item.description.toLowerCase().includes(lowerCaseQuery)
            );
        }

        res.json(materials);
    });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});