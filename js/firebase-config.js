// Firebase Configuration
// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA_9k2e6vfL7vsDQKWCkkLQkgxZGHhq9AU",
  authDomain: "crafted-by-crochet.firebaseapp.com",
  projectId: "crafted-by-crochet",
  storageBucket: "crafted-by-crochet.firebasestorage.app",
  messagingSenderId: "95807589273",
  appId: "1:95807589273:web:e5582bc1aeb000b986a108",
  measurementId: "G-JD0XZWXH7X"
};

// Initialize Firebase
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js';
import { getFirestore } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js';

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
const db = getFirestore(app);

// Make Firebase available globally
window.firebase = {
  app,
  db
};

console.log('Firebase initialized successfully!');