// js/script.js
import { db, auth } from './config.js'; // Import auth
import { collection, addDoc, deleteDoc, doc, onSnapshot, query, where } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-firestore.js";
// Import auth methods
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-auth.js";

let passwords = []; //
let unsubscribeSnapshot = null; // To safely handle changes
let currentUser = null;

// 1. Observe Authentication State Changes
onAuthStateChanged(auth, (user) => {
    if (user) {
        // User is logged in
        currentUser = user;
        console.log("Logged in as:", user.email);
        
        // 2. Scrape data specific to this user only
        const passwordsRef = collection(db, 'passwords');
        const userPasswordsQuery = query(passwordsRef, where("userId", "==", user.uid));

        // Unsubscribe from previous snapshot if any exists
        if(unsubscribeSnapshot) unsubscribeSnapshot();

        unsubscribeSnapshot = onSnapshot(userPasswordsQuery, (snapshot) => {
            passwords = []; //
            snapshot.forEach((doc) => {
                passwords.push({ id: doc.id, ...doc.data() }); //
            });
            renderPasswords(); //
        });
    } else {
        // User is logged out -> Redirect to Login Page
        window.location.href = "index.html";
    }
});

// Update addPassword to link entries with user's unique identifier
window.addPassword = async function() {
    const site = document.getElementById('siteInput'); //
    const pass = document.getElementById('passInput'); //

    if (site.value && pass.value) {
        if (!currentUser) return alert("You must be logged in to save passwords!");
        try {
            await addDoc(collection(db, 'passwords'), { 
                site: site.value, //
                pass: pass.value, //
                userId: currentUser.uid // Storing user ID alongside entry
            });
            site.value = ''; //
            pass.value = ''; //
        } catch (e) {
            console.error("Error adding password: ", e); //
            alert("Failed to add password."); //
        }
    } else {
        alert("Please fill in both fields"); //
    }
};

// Global Logout function
window.logoutUser = async function() {
    try {
        await signOut(auth);
    } catch (e) {
        console.error("Logout Error: ", e);
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