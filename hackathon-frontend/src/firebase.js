import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAokVe8b-28mqaxm9ZLAZZZxQrKIgqx0Rg",
  authDomain: "attendanceapp-18217.firebaseapp.com",
  projectId: "attendanceapp-18217",
  storageBucket: "attendanceapp-18217.appspot.com",
  messagingSenderId: "51493395927",
  appId: "1:51493395927:web:b217c72a76ed80103fff92",
  measurementId: "G-2TQ1HMLQKH"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);