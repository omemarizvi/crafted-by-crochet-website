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
async function initializeFirebase() {
    try {
        console.log('=== FIREBASE INITIALIZATION ===');
        console.log('Attempting to initialize Firebase...');
        console.log('Firebase object available:', typeof firebase !== 'undefined');
        
        if (typeof firebase === 'undefined') {
            console.error('Firebase SDK not loaded. Make sure Firebase scripts are included in HTML.');
            return false;
        }
        
        // Check if already initialized
        if (firebase.apps && firebase.apps.length > 0) {
            console.log('Firebase already initialized, setting up global object...');
            const app = firebase.app();
            const db = firebase.firestore();
            const auth = firebase.auth();
            const storage = firebase.storage();
            
            window.firebase = {
                app: app,
                db: db,
                auth: auth,
                storage: storage
            };
            
            console.log('Firebase global object set up successfully!');
            console.log('window.firebase.db exists:', !!window.firebase.db);
            console.log('window.firebase.db type:', typeof window.firebase.db);
            return true;
        } else {
            // Initialize Firebase for the first time
            console.log('Initializing Firebase for the first time...');
            console.log('Config:', firebaseConfig);
            
            try {
                console.log('About to call firebase.initializeApp...');
                console.log('Firebase object:', typeof firebase);
                console.log('Firebase.initializeApp:', typeof firebase.initializeApp);
                console.log('Firebase config:', firebaseConfig);
                
                const app = firebase.initializeApp(firebaseConfig);
                console.log('Firebase app initialized successfully:', app);
                console.log('App name:', app.name);
                console.log('App options:', app.options);
                
                // Verify the app was created
                console.log('Firebase apps after initialization:', firebase.apps.length);
                console.log('Firebase apps:', firebase.apps);
                
                // Wait a moment for the app to be fully initialized
                await new Promise(resolve => setTimeout(resolve, 100));
                
                // Initialize Firestore
                console.log('Initializing Firestore...');
                const db = firebase.firestore();
                console.log('Firestore database initialized:', db);
                
                // Initialize other services
                const auth = firebase.auth();
                const storage = firebase.storage();
                
                // Make Firebase available globally
                window.firebase = {
                    app: app,
                    db: db,
                    auth: auth,
                    storage: storage
                };
                
                console.log('Firebase initialized successfully!');
                console.log('window.firebase object created:', !!window.firebase);
                console.log('window.firebase.db exists:', !!window.firebase.db);
                console.log('window.firebase.db type:', typeof window.firebase.db);
                console.log('Firebase app name:', window.firebase.app.name);
                console.log('Firebase apps count:', firebase.apps.length);
                return true;
            } catch (initError) {
                console.error('Error during Firebase app initialization:', initError);
                console.error('Error name:', initError.name);
                console.error('Error message:', initError.message);
                console.error('Error code:', initError.code);
                console.error('Error stack:', initError.stack);
                throw initError;
            }
        }
    } catch (error) {
        console.error('Error initializing Firebase:', error);
        console.error('Error details:', error.message);
        console.error('Error stack:', error.stack);
        return false;
    }
}

// Auto-initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', async function() {
    // Wait a bit for Firebase scripts to load
    setTimeout(async () => {
        await initializeFirebase();
    }, 100);
});

// Also make the function globally available
window.initializeFirebase = initializeFirebase;