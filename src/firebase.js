// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyDwtgjLZVcBhb6BKQTUv04KE6DtpxMcBZ4",
  authDomain: "schooldashboard-6301b.firebaseapp.com",
  projectId: "schooldashboard-6301b",
  storageBucket: "schooldashboard-6301b.appspot.com",
  messagingSenderId: "485907534465",
  appId: "1:485907534465:web:6ab28bea8107ffebe8f380",
  measurementId: "G-RDQ7E7VDCZ",
  databaseURL:"https://schooldashboard-6301b-default-rtdb.firebaseio.com/"
};

export const app = initializeApp(firebaseConfig);
export const database = getDatabase(app);