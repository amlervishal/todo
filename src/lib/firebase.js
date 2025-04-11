import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';

const firebaseConfig = {
    apiKey: "AIzaSyCICr4wlTpYyG06CN8vutec7gJqfg7Yk9o",
    authDomain: "terminal-todo-14d8c.firebaseapp.com",
    projectId: "terminal-todo-14d8c",
    storageBucket: "terminal-todo-14d8c.appspot.com",
    messagingSenderId: "1000110102900",
    appId: "1:1000110102900:web:ee594c9b5b662c2d87b421",
    measurementId: "G-C26H0P9RM1"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();