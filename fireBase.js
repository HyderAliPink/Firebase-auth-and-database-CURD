// ✅ Modern modular Firebase SDK



import { initializeApp } from "https://www.gstatic.com/firebasejs/11.7.1/firebase-app.js";
  getDocs
import { getFirestore, collection, addDoc, getDocs  } from "https://www.gstatic.com/firebasejs/11.7.1/firebase-firestore.js";

import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  deleteUser,
  reauthenticateWithCredential,
  EmailAuthProvider,
  signOut,
  signInWithPopup,
  updateProfile,
  onAuthStateChanged,
} from "https://www.gstatic.com/firebasejs/11.7.1/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyCxxCKk7VjSRBdSEhjIwb-w0hJQ_y83WeA",
  authDomain: "practices-34642.firebaseapp.com",
  projectId: "practices-34642",
  storageBucket: "practices-34642.firebasestorage.app",
  messagingSenderId: "814415158163",
  appId: "1:814415158163:web:6898ffb8bbc6ada5f62666",
  measurementId: "G-JJ2P5YV301",
};
export const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export {
  db,
  getDocs,
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  deleteUser,
  reauthenticateWithCredential,
  EmailAuthProvider,
  signOut,
  signInWithPopup,
  updateProfile,
  collection, addDoc,
  
};
