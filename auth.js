// auth.js

// Same session key for the whole site
const SESSION_KEY = "demo_session";

/**
 * Checks if user is logged in.
 * If not, redirect to login page.
 */
function requireLogin() {
  const loggedIn = localStorage.getItem(SESSION_KEY) || sessionStorage.getItem(SESSION_KEY);
  if (!loggedIn) {
    location.href = "index.html"; // login page filename
  }
}

/**
 * Logs out the user and redirects to login page.
 */
function logout() {
  localStorage.removeItem(SESSION_KEY);
  sessionStorage.removeItem(SESSION_KEY);
  location.href = "index.html";
}
