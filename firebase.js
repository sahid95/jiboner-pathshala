// ==============================
// Firebase Configuration
// জীবনের পাঠশালা
// ==============================

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";

import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

import { getStorage } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-storage.js";

// ==============================
// Firebase Config
// ==============================

const firebaseConfig = {

    apiKey: "AIzaSyDsvvY7diXkCl1UHaZ9IEc2D0U1AkAxd8U",

    authDomain: "jiboner-pathshala.firebaseapp.com",

    projectId: "jiboner-pathshala",

    storageBucket: "jiboner-pathshala.firebasestorage.app",

    messagingSenderId: "964876959034",

    appId: "1:964876959034:web:ec0c7d3f2f7ebdc8ade403"

};

// ==============================
// Initialize Firebase
// ==============================

const app = initializeApp(firebaseConfig);

// ==============================
// Services
// ==============================

const auth = getAuth(app);

const db = getFirestore(app);

const storage = getStorage(app);

// ==============================
// Export
// ==============================

export {

    auth,

    db,

    storage

};
