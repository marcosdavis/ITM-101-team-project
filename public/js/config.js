import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyCJ4BVyZM3BaFVpVBCjt0Caz2KlbD9hQBA",
  authDomain: "itm101-final-project.firebaseapp.com",
  projectId: "itm101-final-project",
  storageBucket: "itm101-final-project.firebasestorage.app",
  messagingSenderId: "1075254824578",
  appId: "1:1075254824578:web:8b3b7fbbc80b052a3b2e9b"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app); // Note the 'export' keyword here


