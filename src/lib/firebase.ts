// src/lib/firebase.ts
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  projectId: 'studio-9027818135-c0bc7',
  appId: '1:265937235634:web:ffc4d6fcb95c18379e63ab',
  storageBucket: 'studio-9027818135-c0bc7.firebasestorage.app',
  apiKey: 'AIzaSyAVb1AcK7U5I3wCfbfqwY79t8UHtAQGjFk',
  authDomain: 'studio-9027818135-c0bc7.firebaseapp.com',
  measurementId: '',
  messagingSenderId: '265937235634',
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);

export { app, auth };
