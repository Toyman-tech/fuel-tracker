// Firebase Configuration for Smart Fuel Platform
import { initializeApp, getApps, getApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyAs37T_VRMNtsFc92Va5Yh3N57F_gdjriE",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "fuel-tracker-4dac1.firebaseapp.com",
  databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL || "https://fuel-tracker-4dac1-default-rtdb.firebaseio.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "fuel-tracker-4dac1",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "fuel-tracker-4dac1.firebasestorage.app",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "153130475922",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:153130475922:web:63b65669458ef8a245a14b",
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || "G-F3692BTTJ1"
};

// Initialize Firebase app safely (prevent duplicate initialization)
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
const rtdb = getDatabase(app);
const db = getFirestore(app);

export { app, rtdb, db, firebaseConfig };
