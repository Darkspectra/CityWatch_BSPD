import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Same config as your Android app's Firebase project
const firebaseConfig = {
  apiKey: "AIzaSyDy2A6mNpOLzelTN5JGSh-AEhVJFClZDpc",
  authDomain: "task-management-d6dee.firebaseapp.com",
  projectId: "task-management-d6dee",
  storageBucket: "task-management-d6dee.firebasestorage.app",
  messagingSenderId: "499709773107",
  appId: "1:499709773107:web:91f9d41488767dfffe2a46"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);