// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyA5nHV8br7EsOcleTXaguyMat0m4QYn80A",
  authDomain: "mockterview-554c7.firebaseapp.com",
  projectId: "mockterview-554c7",
  storageBucket: "mockterview-554c7.firebasestorage.app",
  messagingSenderId: "471332453079",
  appId: "1:471332453079:web:3376dac2f73a5bc7d48e92",
  measurementId: "G-KQZDGBLKV1"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const analytics = getAnalytics(app);

export { db }