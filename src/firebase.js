// Import the functions you need from the SDKs you need
import { getStorage } from "firebase/storage";
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  // apiKey: "AIzaSyDwtgjLZVcBhb6BKQTUv04KE6DtpxMcBZ4",
  // authDomain: "schooldashboard-6301b.firebaseapp.com",
  // projectId: "schooldashboard-6301b",
  // storageBucket: "schooldashboard-6301b.appspot.com",
  // messagingSenderId: "485907534465",
  // appId: "1:485907534465:web:6ab28bea8107ffebe8f380",
  // measurementId: "G-RDQ7E7VDCZ",
  // databaseURL:"https://schooldashboard-6301b-default-rtdb.firebaseio.com/"
  apiKey: "AIzaSyAXnBS-nChlksJZrbd5ai3kx-OTdTFUzWk",
  authDomain: "medreach365schools.firebaseapp.com",
  projectId: "medreach365schools",
  storageBucket: "medreach365schools.appspot.com",
  messagingSenderId: "550350857047",
  appId: "1:550350857047:web:618b660620da33c3135412",
  measurementId: "G-0ZQ931DM1J",
  databaseURL:"https://medreach365schools-default-rtdb.firebaseio.com"
};

export const app = initializeApp(firebaseConfig);
export const database = getDatabase(app);
export const storage = getStorage();