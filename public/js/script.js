let passwords = JSON.parse(localStorage.getItem('myPasswords')) || [];

// Initial render
renderPasswords();

function addPassword() {
    const site = document.getElementById('siteInput');
    const pass = document.getElementById('passInput');

    if (site.value && pass.value) {
        passwords.push({ site: site.value, pass: pass.value });
        saveAndRender();
        site.value = '';
        pass.value = '';
    } else {
        alert("Please fill in both fields");
    }
}

function deletePassword(index) {
    passwords.splice(index, 1);
    saveAndRender();
}

function copyPassword(text) {
    navigator.clipboard.writeText(text).then(() => {
        alert("Password copied to clipboard!");
    });
}

function editPassword(index) {
    const newPass = prompt("Enter new password:", passwords[index].pass);
    if (newPass !== null) {
        passwords[index].pass = newPass;
        saveAndRender();
    }
}

function saveAndRender() {
    localStorage.setItem('myPasswords', JSON.stringify(passwords));
    renderPasswords();
}

function renderPasswords() {
    const container = document.getElementById('passwordContainer');
    container.innerHTML = '';

    passwords.forEach((item, index) => {
        const card = `
            <div class="password-card">
                <div class="card-title">${item.site}</div>
                <div class="card-pass">••••••••</div>
                <div class="card-actions">
                    <button class="copy-btn" onclick="copyPassword('${item.pass}')">Copy</button>
                    <button class="edit-btn" onclick="editPassword(${index})">Edit</button>
                    <button class="delete-btn" onclick="deletePassword(${index})">Delete</button>
                </div>
            </div>
        `;
        container.innerHTML += card;
    });
}
let currentQuizIndex = 0;

function toggleQuiz() {
    const quizDiv = document.getElementById('quizContainer');
    const btn = document.getElementById('startQuizBtn');
    
    if (quizDiv.style.display === 'none') {
        if (passwords.length === 0) {
            alert("Add some passwords first!");
            return;
        }
        quizDiv.style.display = 'block';
        btn.innerText = "Close Quiz";
        nextCard(); // Load first card
    } else {
        quizDiv.style.display = 'none';
        btn.innerText = "Start Flashcard Quiz";
    }
}

function flipCard() {
    document.getElementById('flashcard').classList.toggle('is-flipped');
}

function nextCard() {
    // Ensure card is face-front before changing data
    document.getElementById('flashcard').classList.remove('is-flipped');
    
    // Pick a random password
    currentQuizIndex = Math.floor(Math.random() * passwords.length);
    
    // Set a slight timeout so the text changes while the card is face-down/moving
    setTimeout(() => {
        document.getElementById('quizSite').innerText = passwords[currentQuizIndex].site;
        document.getElementById('quizPass').innerText = passwords[currentQuizIndex].pass;
    }, 150);
}