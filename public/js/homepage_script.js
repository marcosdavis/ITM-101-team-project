// Wait for the DOM to fully load before running scripts
document.addEventListener('DOMContentLoaded', function() {
    
    // Select the password input and the toggle button
    const passwordInput = document.getElementById('password');
    const togglePasswordBtn = document.getElementById('togglePassword');
    const loginForm = document.getElementById('loginForm');

    // Toggle password visibility
    togglePasswordBtn.addEventListener('click', function() {
        // Check the current type of the password input
        const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
        
        // Update the type
        passwordInput.setAttribute('type', type);
        
        // Update the button text
        this.textContent = type === 'password' ? 'Show' : 'Hide';
    });

    // Optional: Add basic client-side submit handling for demonstration
    loginForm.addEventListener('submit', function(event) {
        // For demonstration purposes, we are just logging the submission.
        // If you want to stop the page from refreshing, uncomment the line below:
        // event.preventDefault();
        console.log('Form submission intercepted. Ready to send data to backend.');
    });
});
