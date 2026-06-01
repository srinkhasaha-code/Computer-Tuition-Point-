import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBdihJZ3-EiE6K5FX9GeJ3Z3Ak1tirF1M4",
  authDomain: "computer-tuition-point.firebaseapp.com",
  projectId: "computer-tuition-point",
  storageBucket: "computer-tuition-point.firebasestorage.app",
  messagingSenderId: "1094620486413",
  appId: "1:1094620486413:web:0cb930655d49fdc184ae44"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
