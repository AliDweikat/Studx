const fs = require('fs');
const path = require('path');

const DATA_FILE = path.join(__dirname, 'users-data.json');

// Load users from file, or return default empty array
function loadUsers() {
  try {
    if (fs.existsSync(DATA_FILE)) {
      const data = fs.readFileSync(DATA_FILE, 'utf8');
      return JSON.parse(data);
    }
  } catch (error) {
    console.error('Error loading users data:', error);
  }
  return [];
}

// Save users to file
function saveUsers(users) {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(users, null, 2), 'utf8');
    console.log(`[Persistence] Saved ${users.length} users to ${DATA_FILE}`);
  } catch (error) {
    console.error('Error saving users data:', error);
  }
}

// Initialize: Load existing users or use default
function initializeUsers(defaultUsers) {
  const loadedUsers = loadUsers();
  
  // If file exists and has data, use it; otherwise use defaults
  if (loadedUsers.length > 0) {
    return loadedUsers;
  }
  
  // Save defaults to file
  saveUsers(defaultUsers);
  return defaultUsers;
}

module.exports = { loadUsers, saveUsers, initializeUsers };

