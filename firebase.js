// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import {
  getFirestore,
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  serverTimestamp,
  toDate,
} from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBDJKu4y702sAb47LtFh5iGeV1kMXlHAh4",
  authDomain: "pharmaapp-84b1e.firebaseapp.com",
  projectId: "pharmaapp-84b1e",
  storageBucket: "pharmaapp-84b1e.appspot.com",
  messagingSenderId: "761397624802",
  appId: "1:761397624802:web:c84921767171fbed1303bb",
  measurementId: "G-VKVPRWYMWS",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export {
  auth,
  onAuthStateChanged,
  db,
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  serverTimestamp,
  toDate,
  storage,
  ref,
  uploadBytes,
  getDownloadURL,
};
