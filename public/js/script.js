// Import your initialized db from config.js
import { db } from './config.js';
import { collection, addDoc, deleteDoc, doc, updateDoc, onSnapshot } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-firestore.js";

let passwords = [];
const passwordsRef = collection(db, 'passwords');

// Listen for real-time updates from Firestore
onSnapshot(passwordsRef, (snapshot) => {
    passwords = [];
    snapshot.forEach((doc) => {
        // Store the Firestore document ID along with the data
        passwords.push({ id: doc.id, ...doc.data() });
    });
    renderPasswords();
});

window.addPassword = async function() {
    const site = document.getElementById('siteInput');
    const pass = document.getElementById('passInput');

    if (site.value && pass.value) {
        try {
            // Add to Firestore database
            await addDoc(passwordsRef, { 
                site: site.value, 
                pass: pass.value 
            });
            site.value = '';
            pass.value = '';
        } catch (e) {
            console.error("Error adding password: ", e);
            alert("Failed to add password.");
        }
    } else {
        alert("Please fill in both fields");
    }
};

window.deletePassword = async function(id) {
    try {
        // Delete from Firestore database using the document ID
        await deleteDoc(doc(db, 'passwords', id));
    } catch (e) {
        console.error("Error deleting password: ", e);
    }
};

window.editPassword = async function(id, currentPass) {
    const newPass = prompt("Enter new password:", currentPass);
    if (newPass !== null) {
        try {
            const docRef = doc(db, 'passwords', id);
            await updateDoc(docRef, { pass: newPass });
        } catch (e) {
            console.error("Error updating password: ", e);
        }
    }
};

window.copyPassword = function(text) {
    navigator.clipboard.writeText(text).then(() => {
        alert("Password copied to clipboard!");
    });
};

function renderPasswords() {
    const container = document.getElementById('passwordContainer');
    container.innerHTML = '';

    // Notice we are passing item.id instead of index now
    passwords.forEach((item) => {
        const card = `
            <div class="password-card">
                <div class="card-title">${item.site}</div>
                <div class="card-pass">••••••••</div>
                <div class="card-actions">
                    <button class="copy-btn" onclick="copyPassword('${item.pass}')">Copy</button>
                    <button class="edit-btn" onclick="editPassword('${item.id}', '${item.pass}')">Edit</button>
                    <button class="delete-btn" onclick="deletePassword('${item.id}')">Delete</button>
                </div>
            </div>
        `;
        container.innerHTML += card;
    });
}

// Quiz functionality remains largely the same
let currentQuizIndex = 0;

window.toggleQuiz = function() {
    const quizDiv = document.getElementById('quizContainer');
    const btn = document.getElementById('startQuizBtn');
    
    if (quizDiv.style.display === 'none') {
        if (passwords.length === 0) {
            alert("Add some passwords first!");
            return;
        }
        quizDiv.style.display = 'block';
        btn.innerText = "Close Quiz";
        window.nextCard(); 
    } else {
        quizDiv.style.display = 'none';
        btn.innerText = "Start Flashcard Quiz";
    }
};

window.flipCard = function() {
    document.getElementById('flashcard').classList.toggle('is-flipped');
};

window.nextCard = function() {
    document.getElementById('flashcard').classList.remove('is-flipped');
    currentQuizIndex = Math.floor(Math.random() * passwords.length);
    
    setTimeout(() => {
        document.getElementById('quizSite').innerText = passwords[currentQuizIndex].site;
        document.getElementById('quizPass').innerText = passwords[currentQuizIndex].pass;
    }, 150);
};