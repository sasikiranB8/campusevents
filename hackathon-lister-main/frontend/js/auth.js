// --- START OF FILE js/auth.js ---

// --- Login ---
const loginForm = document.getElementById('login-form');
if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('login-email').value;
        const password = document.getElementById('login-password').value;
        const messageEl = document.getElementById('login-message');
        if (messageEl) messageEl.textContent = '';

        if (!email || !password) {
             showMessage('login-message', 'Please provide email and password.', true);
             return;
        }

        try {
            const data = await fetchAPI('/auth/login', {
                method: 'POST',
                body: JSON.stringify({ email, password }),
            });

            if (data.token) {
                localStorage.setItem('token', data.token);
                localStorage.setItem('user', JSON.stringify({
                    id: data._id,
                    username: data.username,
                    email: data.email
                }));
                // showMessage('login-message', 'Login successful! Redirecting...', false); // Optional: maybe remove msg before redirect
                // *** REDIRECT TO HOME ***
                window.location.href = 'index.html'; // Redirect to home page
            } else {
                 throw new Error(data.message || 'Login failed. No token received.');
            }
        } catch (error) {
            console.error('Login Error:', error);
            showMessage('login-message', error.message || 'Login failed. Please try again.', true);
        }
    });
}

// --- Signup ---
const signupForm = document.getElementById('signup-form');
if (signupForm) {
    signupForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const username = document.getElementById('signup-username').value;
        const email = document.getElementById('signup-email').value;
        const password = document.getElementById('signup-password').value;
        const messageEl = document.getElementById('signup-message');
        if(messageEl) messageEl.textContent = '';

        if (!username || !email || !password) {
             showMessage('signup-message', 'Please fill in username, email, and password.', true);
             return;
        }
        if (password.length < 6) {
             showMessage('signup-message', 'Password must be at least 6 characters long.', true);
             return;
        }

        try {
             const registrationData = { username, email, password };
             const data = await fetchAPI('/auth/register', {
                method: 'POST',
                body: JSON.stringify(registrationData),
            });

             if (data.token) {
                localStorage.setItem('token', data.token);
                localStorage.setItem('user', JSON.stringify({
                    id: data._id,
                    username: data.username,
                    email: data.email
                }));
                 // showMessage('signup-message', 'Registration successful! Redirecting...', false); // Optional
                // *** REDIRECT TO HOME ***
                window.location.href = 'index.html'; // Redirect to home page after signup
            } else {
                 throw new Error(data.message || 'Signup failed. No token received.');
            }
        } catch (error) {
             console.error('Signup Error:', error);
            showMessage('signup-message', error.message || 'Signup failed. Please try again.', true);
        }
    });
}

// --- Logout ---
function handleLogout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = 'login.html'; // Redirect to login page after logout
}

// Helper function to get token
function getToken() {
    return localStorage.getItem('token');
}
// --- END OF FILE js/auth.js ---