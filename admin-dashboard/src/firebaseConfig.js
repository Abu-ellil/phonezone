// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
export const firebaseConfig = {
  apiKey: "AIzaSyCjFvOlDVmZze-1tjRN4hNyUJctFLmYHHA",
  authDomain: "phone-store-3eeb4.firebaseapp.com",
  projectId: "phone-store-3eeb4",
  storageBucket: "phone-store-3eeb4.firebasestorage.app",
  messagingSenderId: "685771928609",
  appId: "1:685771928609:web:8904d4fc9aaf5d51b15f60",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
const db = getFirestore(app);

// Initialize Storage with custom settings to handle CORS
const storage = getStorage(app);

// Set CORS configuration for Firebase Storage
const storageRef = storage.ref;
if (storageRef && storageRef._service) {
  storageRef._service.customDomain = null; // Use default Firebase domain
}

const auth = getAuth(app);

export { db, storage, auth };
