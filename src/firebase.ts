// This file will contain the firebase configuration.
// Please paste your firebaseConfig object here once you have it.

import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
    apiKey: "AIzaSyA4r-lwKDdnCQ7gsLZUIpRk6tk2IjUDWM8",
    authDomain: "fir-api-ba32e.firebaseapp.com",
    databaseURL: "https://fir-api-ba32e-default-rtdb.firebaseio.com",
    projectId: "fir-api-ba32e",
    storageBucket: "fir-api-ba32e.firebasestorage.app",
    messagingSenderId: "253708853050",
    appId: "1:253708853050:web:e7d42e43bd68d63334ba03",
    measurementId: "G-020XB6K5EW"
  };

export const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);