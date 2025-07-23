// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyARveu7BVuMIYqwFnm49RtRvwVeVyu7Oj0",
  authDomain: "missile-commander-ad0e9.firebaseapp.com",
  projectId: "missile-commander-ad0e9",
  storageBucket: "missile-commander-ad0e9.firebasestorage.app",
  messagingSenderId: "880301186134",
  appId: "1:880301186134:web:1666a8f09c64b60c186ff7",
  measurementId: "G-BEZSNV69VC"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore Database
export const db = getFirestore(app);

// Initialize Analytics (optional, only in browser)
let analytics;
if (typeof window !== 'undefined') {
  analytics = getAnalytics(app);
}

export { analytics };
export default app; 