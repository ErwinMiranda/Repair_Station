// Same session key for the whole site
const SESSION_KEY = "demo_session";

/**
 * Checks if user is logged in.
 * If not, redirect to login page.
 */
function requireLogin() {
  const sessionData = localStorage.getItem(SESSION_KEY) || sessionStorage.getItem(SESSION_KEY);

  if (!sessionData) {
    location.href = "index.html"; // login page filename
    return;
  }

  try {
    const session = JSON.parse(sessionData);
    if (!session.username) {
      // invalid or tampered session
      logout();
    }
    // ✅ session.username available if you need role-based logic
  } catch {
    logout(); // corrupted session data
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
