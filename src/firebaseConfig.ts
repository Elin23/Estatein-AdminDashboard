// src/firebaseConfig.ts
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyB-W2YDyoYT3NDGBBGI400NJv3xGPitRjA",
  authDomain: "estatein-1050f.firebaseapp.com",
  projectId: "estatein-1050f",
  storageBucket: "estatein-1050f.appspot.com",
  messagingSenderId: "902297151784",
  appId: "1:902297151784:web:aa9dfcf2c074a943d8081d",
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

export const db = getDatabase(app);
export const storage = getStorage(app);
