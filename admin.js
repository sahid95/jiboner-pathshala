import { auth } from "./firebase.js";

import {
    signInWithEmailAndPassword,
    onAuthStateChanged,
    signOut
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

const loginSection = document.getElementById("loginSection");
const dashboard = document.getElementById("dashboard");

window.togglePassword = function () {

    const password = document.getElementById("password");
    const eye = document.querySelector(".toggle-password");

    if (password.type === "password") {
        password.type = "text";
        eye.innerHTML = "🙈";
    } else {
        password.type = "password";
        eye.innerHTML = "👁️";
    }
};

window.login = async function () {

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;
    const msg = document.getElementById("loginMessage");

    if (!email || !password) {
        msg.innerHTML = "⚠️ Email এবং Password লিখুন";
        return;
    }

    try {

        await signInWithEmailAndPassword(auth, email, password);

        msg.innerHTML = "✅ Login সফল হয়েছে";

    } catch (error) {

        msg.innerHTML = "❌ " + error.message;

    }

};

onAuthStateChanged(auth, (user) => {

    if (user) {

        loginSection.classList.add("hidden");
        dashboard.classList.remove("hidden");

    } else {

        loginSection.classList.remove("hidden");
        dashboard.classList.add("hidden");

    }

});

window.logout = async function () {

    await signOut(auth);

};
