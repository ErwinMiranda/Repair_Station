// auth.js (MODULAR Firebase 10.12.0)
const SESSION_KEY = "demo_session";

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import {
  getFirestore,
  doc,
  getDoc
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyCUNjFesHA_nMEsULylFlEdNZHy-MlT7_o",
  authDomain: "webmilestoneplan.firebaseapp.com",
  projectId: "webmilestoneplan"
};

// Initialize Firebase (shared across all pages)
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// =================================================
//  REQUIRE LOGIN + REQUIRE ACTIVE SUBSCRIPTION
// =================================================
export async function requireLogin() {
  const sessionData = JSON.parse(
    localStorage.getItem(SESSION_KEY) || sessionStorage.getItem(SESSION_KEY)
  );

  if (!sessionData || !sessionData.username || !sessionData.page) {
    location.href = "/";
    return;
  }

  // ensure user is allowed to access this page
  const currentPage = location.pathname.split("/").pop();
  if (!sessionData.page.includes(currentPage)) {
    location.href = "/";
    return;
  }

  // ⬇ Subscription check in Firestore
  await checkSubscriptionStatus(sessionData.username);
}

// Logout
export function logout() {
  localStorage.removeItem(SESSION_KEY);
  sessionStorage.removeItem(SESSION_KEY);
  location.href = "/";
}

// =================================================
//  FIRESTORE SUBSCRIPTION CHECK (MODULAR)
// =================================================
async function checkSubscriptionStatus(username) {
  const userRef = doc(db, "users", username);
  const snap = await getDoc(userRef);

  if (!snap.exists()) {
    console.warn("User exists in login but no subscription record.");
    window.location.href = "/subscribe.html";
    return;
  }

  const status = snap.data().subscriptionStatus;

  if (status !== "active") {
    console.warn("Subscription INACTIVE for user", username);
    window.location.href = "/subscribe.html";
    return;
  }

  console.log("Subscription ACTIVE for:", username);
}
