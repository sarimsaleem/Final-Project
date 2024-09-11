import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore"; // Import Firestore
import { getStorage } from "firebase/storage"

const firebaseConfig = {
  apiKey: "AIzaSyAqdWbfza7X8BOYiIT28VbWIivkALLr1iM",
  authDomain: "final-92f81.firebaseapp.com",
  projectId: "final-92f81",
  storageBucket: "final-92f81.appspot.com",
  messagingSenderId: "154061622213",
  appId: "1:154061622213:web:adc9b38f1a664fd32559ac",
  measurementId: "G-5K5GLZHCJK",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const imgDB = getStorage(app)
