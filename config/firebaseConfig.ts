// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: "ferrous-pact-449009-q4.firebaseapp.com",
  projectId: "ferrous-pact-449009-q4",
  storageBucket: "ferrous-pact-449009-q4.firebasestorage.app",
  messagingSenderId: "1072946434783",
  appId: "1:1072946434783:web:d28b8274280c80d74c8f6a",
  measurementId: "G-J6VYXNC9CE",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);
