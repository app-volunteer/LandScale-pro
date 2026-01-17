
import { initializeApp } from "firebase/app";
// Use namespace import to bypass resolution errors for specific auth members in strict environments
import * as firebaseAuth from "firebase/auth";
import { 
  getFirestore, 
  collection, 
  getDocs, 
  setDoc, 
  doc, 
  serverTimestamp, 
  query, 
  where, 
  orderBy,
  deleteDoc
} from "firebase/firestore";

// Extracting members from the namespace to ensure compatibility with modern modular SDK patterns
const { getAuth, onAuthStateChanged, signOut, signInWithPopup, GoogleAuthProvider } = firebaseAuth;

// Configuration for Firebase connected to environment variables
const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY,
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VITE_FIREBASE_APP_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { 
  auth, 
  db, 
  collection, 
  getDocs, 
  setDoc, 
  doc, 
  serverTimestamp, 
  query, 
  where, 
  orderBy,
  deleteDoc,
  onAuthStateChanged,
  signOut,
  signInWithPopup,
  GoogleAuthProvider
};
