import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCeUy3L1Ins9bhGiVTb1gaIQBQMjb7XjmQ",
  authDomain: "forum-ensa.firebaseapp.com",
  projectId: "forum-ensa",
  storageBucket: "forum-ensa.firebasestorage.app",
  messagingSenderId: "729367323764",
  appId: "1:729367323764:web:4debc2ea32928495f8dd21"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
