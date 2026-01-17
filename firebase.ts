
import { initializeApp } from "firebase/app";
// Fix: Consolidating Firebase Auth imports to a single line can help resolve member export errors in certain build environments.
import { getAuth, onAuthStateChanged, signOut, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
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

// Configuration for Firebase using provided values to ensure reliability.
// Note: process.env.API_KEY is reserved for Gemini; Firebase keys are hardcoded here 
// to prevent 'auth/invalid-api-key' errors in environments where VITE_ prefixes are not processed.
const firebaseConfig = {
  apiKey: "AIzaSyBsDwsrl4f866azToJWTu_vj4JBMpQXe_c",
  authDomain: "landreportapp.firebaseapp.com",
  projectId: "landreportapp",
  storageBucket: "landreportapp.appspot.com",
  messagingSenderId: "743751569926",
  appId: "1:743751569926:web:a9d6d39872a6c20599e987",
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
