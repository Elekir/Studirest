import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";




// web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDPiLswNIw2dn8wlmyGbTk5OQ_VVVfddfw",
  authDomain: "studirest.firebaseapp.com",
  projectId: "studirest",
  storageBucket: "studirest.firebasestorage.app",
  messagingSenderId: "510633980920",
  appId: "1:510633980920:web:04c379073d73adbde79c0d"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);