// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyA8ViCdX6-QNLKzHI9RJ_mgowTU_uNzcU0",
  authDomain: "test-d93aa.firebaseapp.com",
  projectId: "test-d93aa",
  storageBucket: "test-d93aa.appspot.com",
  messagingSenderId: "614483181917",
  appId: "1:614483181917:web:e880112ec7ce091118e8b4",
  measurementId: "G-28166X7YF5"
};

export const app = initializeApp(firebaseConfig)
//firestone reference
export const db = getFirestore(app)

// Get a reference to the Firebase auth object
export const Auth = getAuth();

