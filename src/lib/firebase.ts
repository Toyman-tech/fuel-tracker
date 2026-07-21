import { initializeApp, getApps, getApp } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";
import { getDatabase, ref, onValue, set, remove } from "firebase/database";
import { getFirestore } from "firebase/firestore";
import { FillUpRecord, FuelStation, Vehicle } from "../types";

// Firebase web application configuration using environment variables
export const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyAs37T_VRMNtsFc92Va5Yh3N57F_gdjriE",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "fuel-tracker-4dac1.firebaseapp.com",
  databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL || "https://fuel-tracker-4dac1-default-rtdb.firebaseio.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "fuel-tracker-4dac1",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "fuel-tracker-4dac1.firebasestorage.app",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "153130475922",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:153130475922:web:63b65669458ef8a245a14b",
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || "G-F3692BTTJ1"
};

// Initialize Firebase App singleton safely
export const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
export const rtdb = getDatabase(app);
export const db = getFirestore(app);

// Initialize Analytics safely on client side
export let analytics: unknown = null;
if (typeof window !== "undefined") {
  isSupported().then((supported) => {
    if (supported) {
      analytics = getAnalytics(app);
    }
  }).catch(() => {});
}

// 1. Subscribe to Live Fuel Stations
export const subscribeToStations = (callback: (stations: FuelStation[]) => void) => {
  if (typeof window === "undefined") return () => {};
  try {
    const stationsRef = ref(rtdb, "stations");
    return onValue(stationsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const stationList: FuelStation[] = Array.isArray(data) 
          ? data 
          : Object.keys(data).map(key => ({ id: key, ...data[key] }));
        callback(stationList);
      }
    }, (error) => {
      console.warn("Firebase stations subscription note:", error);
    });
  } catch (err) {
    console.warn("Firebase Realtime DB connection skipped on SSR:", err);
    return () => {};
  }
};

// Seed initial stations to database if empty
export const seedInitialStations = async (initialData: FuelStation[]) => {
  try {
    const stationsRef = ref(rtdb, "stations");
    await set(stationsRef, initialData);
  } catch (err) {
    console.warn("Firebase seed error:", err);
  }
};

// 2. Subscribe to Fuel Fill-Up Logs
export const subscribeToLogs = (callback: (logs: FillUpRecord[]) => void) => {
  if (typeof window === "undefined") return () => {};
  try {
    const logsRef = ref(rtdb, "fillUpLogs");
    return onValue(logsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const logList: FillUpRecord[] = Object.keys(data).map(key => ({
          id: key,
          ...data[key],
        }));
        logList.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        callback(logList);
      }
    }, (error) => {
      console.warn("Firebase logs subscription note:", error);
    });
  } catch (err) {
    console.warn("Firebase Realtime DB logs skipped on SSR:", err);
    return () => {};
  }
};

// Save a new log entry to Firebase
export const saveLogToDb = async (log: FillUpRecord) => {
  try {
    const logsRef = ref(rtdb, `fillUpLogs/${log.id}`);
    await set(logsRef, log);
  } catch (err) {
    console.warn("Failed to save log to Firebase:", err);
  }
};

// Remove a log entry from Firebase
export const removeLogFromDb = async (id: string) => {
  try {
    const logRef = ref(rtdb, `fillUpLogs/${id}`);
    await remove(logRef);
  } catch (err) {
    console.warn("Failed to delete log from Firebase:", err);
  }
};

// 3. Vehicles Sync
export const subscribeToVehicles = (callback: (vehicles: Vehicle[]) => void) => {
  if (typeof window === "undefined") return () => {};
  try {
    const vehRef = ref(rtdb, "vehicles");
    return onValue(vehRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const list: Vehicle[] = Object.keys(data).map(key => ({ id: key, ...data[key] }));
        callback(list);
      }
    }, (error) => {
      console.warn("Firebase vehicles subscription note:", error);
    });
  } catch (err) {
    console.warn("Firebase Realtime DB vehicles skipped on SSR:", err);
    return () => {};
  }
};

export const saveVehicleToDb = async (vehicle: Vehicle) => {
  try {
    const vehRef = ref(rtdb, `vehicles/${vehicle.id}`);
    await set(vehRef, vehicle);
  } catch (err) {
    console.warn("Failed to save vehicle to Firebase:", err);
  }
};

export const removeVehicleFromDb = async (id: string) => {
  try {
    const vehRef = ref(rtdb, `vehicles/${id}`);
    await remove(vehRef);
  } catch (err) {
    console.warn("Failed to delete vehicle from Firebase:", err);
  }
};
