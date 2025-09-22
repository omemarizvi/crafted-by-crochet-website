// Firebase Configuration using traditional script approach
// This will work with your current HTML setup

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

// Initialize Firebase (this will be called after Firebase scripts are loaded)
function initializeFirebase() {
    try {
        // Check if Firebase is available
        if (typeof firebase !== 'undefined' && firebase.apps.length === 0) {
            firebase.initializeApp(firebaseConfig);
            
            // Initialize Firestore
            const db = firebase.firestore();
            
            // Make Firebase available globally
            window.firebase = {
                app: firebase.app(),
                db: db,
                auth: firebase.auth(),
                storage: firebase.storage()
            };
            
            console.log('Firebase initialized successfully!');
            return true;
        } else if (typeof firebase !== 'undefined') {
            console.log('Firebase already initialized');
            return true;
        } else {
            console.error('Firebase not loaded');
            return false;
        }
    } catch (error) {
        console.error('Error initializing Firebase:', error);
        return false;
    }
}

// Auto-initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Wait a bit for Firebase scripts to load
    setTimeout(initializeFirebase, 100);
});