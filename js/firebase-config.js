// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
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
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);