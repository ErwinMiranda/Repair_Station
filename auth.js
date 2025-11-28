// auth.js
const SESSION_KEY = "demo_session";

/**
 * Main login requirement + subscription requirement
 */
async function requireLogin() {
  // 1. Check your existing session login
  const sessionData =
    JSON.parse(localStorage.getItem(SESSION_KEY) || sessionStorage.getItem(SESSION_KEY));

  if (!sessionData || !sessionData.username || !sessionData.page) {
    location.href = "/";
    return;
  }

  // Validate page is correct
  const currentPage = location.pathname.split("/").pop();
  if (sessionData.page && !sessionData.page.includes(currentPage)) {
    location.href = "/";
    return;
  }

  // 2. Check subscription status in Firestore
  await checkSubscriptionStatus(sessionData.username);
}

function logout() {
  localStorage.removeItem(SESSION_KEY);
  sessionStorage.removeItem(SESSION_KEY);
  location.href = "/";
}

/* ---------------------------
    SUBSCRIPTION CHECK
---------------------------- */

async function checkSubscriptionStatus(username) {
  const db = firebase.firestore();

  const ref = db.collection("users").doc(username);
  const snap = await ref.get();

  if (!snap.exists) {
    // user exists but no subscription record
    window.location.href = "/subscribe";
    return;
  }

  const status = snap.data().subscriptionStatus;

  if (status !== "active") {
    window.location.href = "/subscribe";
    return;
  }

  console.log("Subscription ACTIVE for:", username);
}
