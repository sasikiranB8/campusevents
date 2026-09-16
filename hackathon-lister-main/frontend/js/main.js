// --- START OF FILE js/main.js ---

// fetchAPI, showMessage, getToken functions remain the same as in the previous version
// --- START OF js/main.js ---

// fetchAPI, getToken, checkLoginStatus functions remain the same...

async function fetchAPI(endpoint, options = {}) { // Check function definition
    // Check if API_BASE_URL is defined and accessible here
    if (typeof API_BASE_URL === 'undefined') {
        console.error("API_BASE_URL is not defined! Check config.js loading.");
        throw new Error("API configuration is missing.");
    }
    const url = API_BASE_URL + endpoint;
    // ... rest of the fetchAPI function definition ...
    const headers = {
        'Content-Type': 'application/json',
        ...options.headers,
    };
    // ... code to add Authorization header ...
    const token = localStorage.getItem('token');
    if (token) {
         headers['Authorization'] = `Bearer ${token}`;
    }
    // ... try/catch block for fetch ...
    try {
        const response = await fetch(url, {
            ...options,
            headers: headers,
        });
        // ... response handling ...
        let data;
        const contentType = response.headers.get("content-type");
        if (contentType && contentType.indexOf("application/json") !== -1) {
             data = await response.json();
        } else {
             // Treat non-JSON as text within a message object
             const text = await response.text();
             data = { message: text };
        }

        if (!response.ok) {
             const errorMessage = data?.message || response.statusText || `HTTP error! status: ${response.status}`;
             const error = new Error(errorMessage);
             error.status = response.status;
             throw error;
        }
        return data;
    } catch (error) {
         console.error(`fetchAPI Error: ${error.status || 'Network/CORS'} calling ${endpoint}:`, error.message);
         // Add specific CORS check hint
         if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
             console.warn("Fetch Error Hint: This might be a CORS issue. Check the browser console and ensure the backend server (localhost:5000) allows requests from the origin you are running the frontend on (e.g., file:// or another localhost port). The backend's `cors()` middleware should be configured correctly.");
         }
         throw error;
    }
}
// --- fetchAPI function definition ends here ---

console.log('main.js parsed, fetchAPI type:', typeof fetchAPI); 
// Function to display messages (UPDATED to handle initial display)
function showMessage(elementId, text, isError = false) {
    const element = document.getElementById(elementId);
    if (element) {
        element.textContent = text;
        element.className = isError ? 'message error' : 'message success';
        element.style.display = 'block'; // *** Make the element visible ***

        // Clear message after 5 seconds
        setTimeout(() => {
             if (element.textContent === text) {
                element.textContent = '';
                element.className = 'message';
                element.style.display = 'none'; // *** Hide the element again ***
             }
        }, 5000);
    } else {
        console.warn(`showMessage: Element with ID "${elementId}" not found.`);
    }
}

// ... rest of main.js (checkLoginStatus, Initialization) ...

// --- END OF js/main.js ---
// Check login status on page load (UPDATED for conditional UI elements)
function checkLoginStatus() {
    const token = getToken();
    const userGreetingEl = document.getElementById('user-greeting');
    const logoutButton = document.getElementById('logout-button');
    // Nav Links
    const navDashboardLink = document.getElementById('nav-dashboard-link');
    const navOrganizeLink = document.getElementById('nav-organize-link');
    // Hero Button
    const heroDashboardBtn = document.getElementById('hero-dashboard-btn');
    // Footer Organize CTA Button
    const footerOrganizeBtn = document.getElementById('footer-organize-btn');
    // Footer Dashboard Link
    const footerDashboardLink = document.getElementById('footer-dashboard-link');


    if (token) {
        // --- LOGGED IN ---
        if (userGreetingEl) { // Fetch username only if greeting element exists
             fetchAPI('/auth/me')
                 .then(user => {
                      if (userGreetingEl && user?.username) {
                         userGreetingEl.textContent = `Welcome, ${user.username}!`;
                      } else if (userGreetingEl) {
                         userGreetingEl.textContent = 'Welcome!';
                      }
                 })
                 .catch(err => {
                      console.error("Failed to fetch user details:", err);
                      if (err.status === 401) {
                          console.log("Token invalid/expired, logging out.");
                          handleLogout();
                      } else if (userGreetingEl) {
                          userGreetingEl.textContent = 'Welcome!';
                      }
                 });
        }

        // Show elements for logged-in users
        if (logoutButton) logoutButton.style.display = 'inline-block';
        if (navDashboardLink) navDashboardLink.style.display = 'inline-block';
        if (navOrganizeLink) navOrganizeLink.style.display = 'inline-block';
        if (heroDashboardBtn) heroDashboardBtn.style.display = 'inline-block';
        if (footerOrganizeBtn) footerOrganizeBtn.style.display = 'inline-block';
        if (footerDashboardLink) footerDashboardLink.style.display = 'inline-block';


    } else {
        // --- NOT LOGGED IN ---
        if (userGreetingEl) userGreetingEl.textContent = ''; // Clear greeting

        // Hide elements for logged-in users
        if (logoutButton) logoutButton.style.display = 'none';
        if (navDashboardLink) navDashboardLink.style.display = 'none';
        if (navOrganizeLink) navOrganizeLink.style.display = 'none';
        if (heroDashboardBtn) heroDashboardBtn.style.display = 'none';
        if (footerOrganizeBtn) footerOrganizeBtn.style.display = 'none';
        if (footerDashboardLink) footerDashboardLink.style.display = 'none';


        // Redirect non-logged-in users from protected pages
        const protectedPages = ['/organize.html', '/dashboard.html', '/edit-profile.html']; // Add any other protected pages
        const currentPath = window.location.pathname;
        if (protectedPages.some(page => currentPath.endsWith(page))) {
            console.log(`Not logged in on protected page (${currentPath}). Redirecting to login.`);
            window.location.href = 'login.html';
        }
    }
}


// --- Initialization ---
document.addEventListener('DOMContentLoaded', () => {
    checkLoginStatus(); // Check login status and update UI visibility

    const logoutButton = document.getElementById('logout-button');
    if (logoutButton && typeof handleLogout === 'function') {
        logoutButton.addEventListener('click', handleLogout);
    } else if (logoutButton) {
         console.warn("handleLogout function not found when attaching listener.");
    }

    // Organize page specific setup (Mode/Location toggle) - Keep this
    if (window.location.pathname.endsWith('/organize.html')) {
        const modeSelect = document.getElementById('event-mode');
        const locationGroup = document.getElementById('location-group');
        const locationInput = document.getElementById('location');
        if (modeSelect && locationGroup && locationInput) {
             const toggleLocationVisibility = () => { /* ... same toggle logic ... */
                 const isOffline = modeSelect.value === 'Offline';
                 locationGroup.style.display = isOffline ? 'block' : 'none';
                 locationInput.required = isOffline;
                 if (!isOffline) locationInput.value = '';
              };
             modeSelect.addEventListener('change', toggleLocationVisibility);
             toggleLocationVisibility();
        }
    }
});

// --- END OF FILE js/main.js ---