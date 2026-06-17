// js/homepage_script.js
import { auth } from './config.js';
import { signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-auth.js";

document.addEventListener('DOMContentLoaded', function() {
    const passwordInput = document.getElementById('password'); //
    const togglePasswordBtn = document.getElementById('togglePassword'); //
    const loginForm = document.getElementById('loginForm'); //

    // Toggle password visibility (Your existing code)
    togglePasswordBtn.addEventListener('click', function() {
        const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password'; //
        passwordInput.setAttribute('type', type); //
        this.textContent = type === 'password' ? 'Show' : 'Hide'; //
    });

    // Handle Login with Firebase
    loginForm.addEventListener('submit', async function(event) {
        event.preventDefault(); // Stop form from doing standard HTML submission redirect immediately
        
        const username = document.getElementById('username').value;
        const password = passwordInput.value;

        try {
            // Authenticate with Firebase
            const userCredential = await signInWithEmailAndPassword(auth, username, password);
            console.log('Logged in successfully:', userCredential.user);
            
            // Redirect to vault upon successful login
            window.location.href = "passwords.html";
        } catch (error) {
            console.error("Login failed: ", error.message);
            alert("Failed to sign in: " + error.message);
        }
    });
});