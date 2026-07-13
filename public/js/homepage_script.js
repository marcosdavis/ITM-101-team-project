// js/homepage_script.js
import { auth } from './config.js';
import { signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-auth.js";

document.addEventListener('DOMContentLoaded', function () {
    const loginForm        = document.getElementById('loginForm');
    const usernameInput    = document.getElementById('username');
    const passwordInput    = document.getElementById('password');
    const togglePasswordBtn = document.getElementById('togglePassword');
    const usernameError    = document.getElementById('username-error');
    const passwordError    = document.getElementById('password-error');

    // ─── Helpers ────────────────────────────────────────────────────────────────

    function showError(input, errorEl, message) {
        errorEl.textContent = message;
        errorEl.hidden = false;
        input.setAttribute('aria-invalid', 'true');
        input.focus();
    }

    function clearError(input, errorEl) {
        errorEl.textContent = '';
        errorEl.hidden = true;
        input.removeAttribute('aria-invalid');
    }

    // ─── Clear errors on input so user gets immediate feedback ──────────────────

    usernameInput.addEventListener('input', () => clearError(usernameInput, usernameError));
    passwordInput.addEventListener('input', () => clearError(passwordInput, passwordError));

    // ─── Password toggle ─────────────────────────────────────────────────────────

    togglePasswordBtn.addEventListener('click', function () {
        const isPassword = passwordInput.getAttribute('type') === 'password';
        passwordInput.setAttribute('type', isPassword ? 'text' : 'password');
        this.textContent = isPassword ? 'Hide' : 'Show';
        this.setAttribute('aria-label', isPassword ? 'Hide password' : 'Show password');
        this.setAttribute('aria-pressed', String(isPassword));
    });

    // ─── Client-side validation ──────────────────────────────────────────────────

    function validate() {
        let valid = true;

        if (!usernameInput.value.trim()) {
            showError(usernameInput, usernameError, 'Please enter your username or email.');
            valid = false;
        }

        if (!passwordInput.value) {
            // Only show password error if username already passed (focus goes to first error)
            if (valid) showError(passwordInput, passwordError, 'Please enter your password.');
            valid = false;
        }

        return valid;
    }

    // ─── Login ───────────────────────────────────────────────────────────────────

    loginForm.addEventListener('submit', async function (event) {
        event.preventDefault();

        // Clear any stale errors first
        clearError(usernameInput, usernameError);
        clearError(passwordInput, passwordError);

        if (!validate()) return;

        const submitBtn = loginForm.querySelector('.btn-submit');
        submitBtn.disabled = true;
        submitBtn.textContent = 'Signing in…';

        try {
            const userCredential = await signInWithEmailAndPassword(
                auth,
                usernameInput.value.trim(),
                passwordInput.value
            );
            console.log('Logged in:', userCredential.user);
            window.location.href = 'passwords.html';

        } catch (error) {
            console.error('Login failed:', error.code, error.message);

            // Map Firebase error codes to plain user-facing messages
            const errorMap = {
                'auth/user-not-found':    'No account found with that username or email.',
                'auth/wrong-password':    'Incorrect password. Please try again.',
                'auth/invalid-email':     'Please enter a valid email address.',
                'auth/too-many-requests': 'Too many attempts. Please wait a moment and try again.',
                'auth/network-request-failed': 'Network error. Check your connection and try again.',
            };

            const message = errorMap[error.code] ?? 'Sign-in failed. Please try again.';

            // Show error on username field as the general auth failure anchor
            showError(usernameInput, usernameError, message);

        } finally {
            submitBtn.disabled = false;
            submitBtn.textContent = 'Sign In';
        }
    });
});