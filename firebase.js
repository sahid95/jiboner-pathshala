import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";

import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

const firebaseConfig = {
    apiKey: "AIzaSyDsvvY7diXkCl1UHaZ9IEc2D0U1AkAxd8U",
    authDomain: "jiboner-pathshala.firebaseapp.com",
    projectId: "jiboner-pathshala",
    storageBucket: "jiboner-pathshala.firebasestorage.app",
    messagingSenderId: "964876959034",
    appId: "1:964876959034:web:ec0c7d3f2f7ebdc8ade403"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);
