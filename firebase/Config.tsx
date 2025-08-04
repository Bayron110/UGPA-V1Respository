// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDozF9_WOIavyn4wDd9PAg_TGJnfWWu0jo",
  authDomain: "ejercicio1-app.firebaseapp.com",
  databaseURL: "https://ejercicio1-app-default-rtdb.firebaseio.com",
  projectId: "ejercicio1-app",
  storageBucket: "ejercicio1-app.firebasestorage.app",
  messagingSenderId: "45243239765",
  appId: "1:45243239765:web:80eadf06ad789b637a33dc"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getDatabase(app)