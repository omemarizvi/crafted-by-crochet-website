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
        console.log('Attempting to initialize Firebase...');
        console.log('Firebase object available:', typeof firebase !== 'undefined');
        
        if (typeof firebase !== 'undefined') {
            // Check if already initialized
            if (firebase.apps && firebase.apps.length > 0) {
                console.log('Firebase already initialized');
                const db = firebase.firestore();
                window.firebase = {
                    app: firebase.app(),
                    db: db,
                    auth: firebase.auth(),
                    storage: firebase.storage()
                };
                return true;
            } else {
                // Initialize Firebase
                console.log('Initializing Firebase with config:', firebaseConfig);
                const app = firebase.initializeApp(firebaseConfig);
                console.log('Firebase app initialized:', app);
                
                // Initialize Firestore
                const db = firebase.firestore();
                console.log('Firestore database initialized:', db);
                
                // Make Firebase available globally
                window.firebase = {
                    app: app,
                    db: db,
                    auth: firebase.auth(),
                    storage: firebase.storage()
                };
                
                console.log('Firebase initialized successfully!');
                console.log('window.firebase object:', window.firebase);
                console.log('Firebase app:', window.firebase.app);
                console.log('Firestore database:', window.firebase.db);
                console.log('Database type:', typeof window.firebase.db);
                return true;
            }
        } else {
            console.error('Firebase SDK not loaded. Make sure Firebase scripts are included in HTML.');
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