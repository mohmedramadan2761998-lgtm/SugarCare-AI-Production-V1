import { initializeApp, getApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyA740OvKjSQ5lEWz58GiB_pS6CA8OoyChE",
  authDomain: "sugarcare-ai-production.firebaseapp.com",
  projectId: "sugarcare-ai-production",
  storageBucket: "sugarcare-ai-production.firebasestorage.app",
  messagingSenderId: "971251469381",
  appId: "1:971251469381:web:75c5d474592969cadb672c",
  measurementId: "G-YMD5KKHM08"
};

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);

export default app;