// 1. Initialize data structures from LocalStorage
let reminderSettings = JSON.parse(localStorage.getItem('reminderSettings')) || {
    duration: 90,
    unit: 'days'
};

// Replace this with your actual local storage password array variable if named differently
let passwordVault = JSON.parse(localStorage.getItem('passwords')) || [];

// 2. Automatically check limits when the page loads
document.addEventListener("DOMContentLoaded", () => {
    initReminderUI();
    checkPasswordExpirations();
});

// Populates inputs with the user's saved configurations
function initReminderUI() {
    const intervalInput = document.getElementById('reminderInterval');
    const unitInput = document.getElementById('reminderUnit');
    if (intervalInput && unitInput) {
        intervalInput.value = reminderSettings.duration;
        unitInput.value = reminderSettings.unit;
    }
}

// Saves user preferences locally
function saveReminderSettings() {
    const duration = parseInt(document.getElementById('reminderInterval').value);
    const unit = document.getElementById('reminderUnit').value;
    
    reminderSettings = { duration, unit };
    localStorage.setItem('reminderSettings', JSON.stringify(reminderSettings));
    
    alert("Rotation settings updated successfully!");
    checkPasswordExpirations(); // Instantly update warnings on screen
}

// MODIFIED: Ensure your existing password adding function maps a creation date
function addPassword() {
    const site = document.getElementById('siteInput').value;
    const pass = document.getElementById('passInput').value;
    
    if(!site || !pass) return alert("Please fill out both fields");

    const newPasswordEntry = {
        id: Date.now(), 
        site: site,
        pass: pass,
        createdAt: Date.now() // <-- CRITICAL: Timestamp captures exactly when it was generated
    };

    passwordVault.push(newPasswordEntry);
    localStorage.setItem('passwords', JSON.stringify(passwordVault));
    
    // Clear input fields
    document.getElementById('siteInput').value = '';
    document.getElementById('passInput').value = '';
    
    // Refresh your UI view and verify expiration statuses
    // if you have a render function (like renderPasswords()), call it here!
    checkPasswordExpirations();
}

// Scans vault records to compute age differences
function checkPasswordExpirations() {
    const alertContainer = document.getElementById('reminderAlerts');
    if (!alertContainer) return;
    
    alertContainer.innerHTML = ''; // Wipe existing alerts clean
    if (passwordVault.length === 0) return;

    // Default: calculate expiration time bounds based on Days
    let durationInMs = reminderSettings.duration * 24 * 60 * 60 * 1000; 
    
    // Alternate: Calculate using minutes (handy for testing your code in real-time)
    if (reminderSettings.unit === 'minutes') {
        durationInMs = reminderSettings.duration * 60 * 1000;
    }

    const now = Date.now();
    let expiredSites = [];

    passwordVault.forEach(item => {
        // Fallback constraint: if old data doesn't have a date, assume it's safe (now)
        const dateCreated = item.createdAt || now; 
        
        if (now - dateCreated > durationInMs) {
            expiredSites.push(item.site);
        }
    });

    // Alert layout logic
    if (expiredSites.length > 0) {
        alertContainer.innerHTML = `⚠️ Attention: It's time to rotate your passwords for: <span style="text-decoration: underline;">${expiredSites.join(', ')}</span>.`;
    }
}