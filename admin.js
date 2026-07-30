import { auth, db } from "./firebase.js";

import {
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

import {
  collection,
  addDoc,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
  serverTimestamp,
  query,
  orderBy
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

/* ==========================
   DOM
========================== */

const loginSection = document.getElementById("loginSection");
const dashboard = document.getElementById("dashboard");

const email = document.getElementById("email");
const password = document.getElementById("password");
const loginMessage = document.getElementById("loginMessage");

const title = document.getElementById("title");
const category = document.getElementById("category");
const content = document.getElementById("content");
const status = document.getElementById("status");
const featured = document.getElementById("featured");

const publishBtn = document.getElementById("publishBtn");

const postsContainer = document.getElementById("postsContainer");

let posts = [];

/* ==========================
   PASSWORD SHOW/HIDE
========================== */

window.togglePassword = function () {

    if (password.type === "password") {

        password.type = "text";

        document.querySelector(".password-box button").textContent = "🙈";

    } else {

        password.type = "password";

        document.querySelector(".password-box button").textContent = "👁️";

    }

};

/* ==========================
   LOGIN
========================== */

window.login = async function () {

    loginMessage.innerHTML = "";

    try {

        await signInWithEmailAndPassword(

            auth,
            email.value.trim(),
            password.value

        );

    }

    catch (error) {

        loginMessage.innerHTML = error.message;

    }

};

/* ==========================
   AUTO LOGIN
========================== */

onAuthStateChanged(auth, (user) => {

    if (user) {

        loginSection.classList.add("hidden");

        dashboard.classList.remove("hidden");

        loadPosts();

    } else {

        dashboard.classList.add("hidden");

        loginSection.classList.remove("hidden");

    }

});

/* ==========================
   LOGOUT
========================== */

window.logout = async function () {

    await signOut(auth);

};
/* ==========================
   PUBLISH POST
========================== */

publishBtn.addEventListener("click", publishPost);

async function publishPost() {

    const postTitle = title.value.trim();
    const postCategory = category.value;
    const postContent = content.value.trim();
    const postStatus = status.value;
    const isFeatured = featured.checked;

    if (!postTitle || !postContent) {

        alert("শিরোনাম এবং পোস্ট লিখুন");
        return;

    }

    publishBtn.disabled = true;
    publishBtn.textContent = "Publishing...";

    try {

        await addDoc(collection(db, "posts"), {

            title: postTitle,
            category: postCategory,
            content: postContent,
            status: postStatus,
            featured: isFeatured,
            createdAt: serverTimestamp()

        });

        alert("✅ পোস্ট সফলভাবে প্রকাশ হয়েছে");

        title.value = "";
        content.value = "";
        featured.checked = false;
        status.value = "published";

        loadPosts();

    } catch (error) {

        console.error(error);
        alert("❌ পোস্ট প্রকাশ করা যায়নি");

    }

    publishBtn.disabled = false;
    publishBtn.textContent = "🚀 Publish Post";

}

/* ==========================
   LOAD POSTS
========================== */

async function loadPosts() {

    posts = [];

    const q = query(
        collection(db, "posts"),
        orderBy("createdAt", "desc")
    );

    const snapshot = await getDocs(q);

    snapshot.forEach((docItem) => {

        posts.push({

            id: docItem.id,
            ...docItem.data()

        });

    });

    renderPosts();
    updateStatistics();

}
/* ==========================
   RENDER POSTS
========================== */

function renderPosts() {

    if (posts.length === 0) {

        postsContainer.innerHTML = `
        <div class="empty">
            কোনো পোস্ট পাওয়া যায়নি
        </div>`;
        return;
    }

    postsContainer.innerHTML = "";

    posts.forEach(post => {

        const card = document.createElement("div");

        card.className = "post";

        card.innerHTML = `

            <span class="tag">${post.category}</span>

            ${post.featured ?
            `<span class="featured">⭐ Featured</span>` : ""}

            <h3>${post.title}</h3>

            <p>${post.content}</p>

            <div class="date">

                ${post.status}

            </div>

            <div class="post-actions">

                <button
                    class="btn-edit"
                    onclick="editPost('${post.id}')">

                    ✏️ Edit

                </button>

                <button
                    class="btn-delete"
                    onclick="removePost('${post.id}')">

                    🗑 Delete

                </button>

            </div>

        `;

        postsContainer.appendChild(card);

    });

}

/* ==========================
   SEARCH POST
========================== */

const searchInput =
document.getElementById("searchPost");

searchInput.addEventListener(

    "input",

    function(){

        const keyword =
        this.value.toLowerCase();

        const filtered =

        posts.filter(post=>{

            return (

            post.title
            .toLowerCase()
            .includes(keyword)

            ||

            post.content
            .toLowerCase()
            .includes(keyword)

            ||

            post.category
            .toLowerCase()
            .includes(keyword)

            );

        });

        renderFiltered(filtered);

    }

);

function renderFiltered(list){

    if(list.length===0){

        postsContainer.innerHTML=`

        <div class="empty">

        কোনো পোস্ট পাওয়া যায়নি

        </div>

        `;

        return;

    }

    postsContainer.innerHTML="";

    list.forEach(post=>{

        const card=document.createElement("div");

        card.className="post";

        card.innerHTML=`

        <span class="tag">

        ${post.category}

        </span>

        <h3>

        ${post.title}

        </h3>

        <p>

        ${post.content}

        </p>

        <div class="post-actions">

        <button
        class="btn-edit"
        onclick="editPost('${post.id}')">

        ✏️ Edit

        </button>

        <button
        class="btn-delete"
        onclick="removePost('${post.id}')">

        🗑 Delete

        </button>

        </div>

        `;

        postsContainer.appendChild(card);

    });

}

/* ==========================
   UPDATE STATISTICS
========================== */

function updateStatistics(){

    document.getElementById(

    "totalPosts"

    ).textContent=

    posts.length;

    document.getElementById(

    "publishedPosts"

    ).textContent=

    posts.filter(

    p=>p.status==="published"

    ).length;

    document.getElementById(

    "draftPosts"

    ).textContent=

    posts.filter(

    p=>p.status==="draft"

    ).length;

        }
/* ==========================
   EDIT POST
========================== */

const editModal = document.getElementById("editModal");

window.editPost = function(id){

    const post = posts.find(p => p.id === id);

    if(!post) return;

    document.getElementById("editId").value = post.id;
    document.getElementById("editTitle").value = post.title || "";
    document.getElementById("editCategory").value = post.category || "";
    document.getElementById("editContent").value = post.content || "";
    document.getElementById("editStatus").value = post.status || "published";
    document.getElementById("editFeatured").checked = !!post.featured;

    editModal.classList.remove("hidden");

};

/* ==========================
   CANCEL EDIT
========================== */

document
.getElementById("cancelBtn")
.addEventListener("click",()=>{

    editModal.classList.add("hidden");

});

/* ==========================
   UPDATE POST
========================== */

document
.getElementById("updateBtn")
.addEventListener("click",updatePost);

async function updatePost(){

    const id =
    document.getElementById("editId").value;

    try{

        await updateDoc(

            doc(db,"posts",id),

            {

                title:
                document.getElementById("editTitle").value.trim(),

                category:
                document.getElementById("editCategory").value,

                content:
                document.getElementById("editContent").value.trim(),

                status:
                document.getElementById("editStatus").value,

                featured:
                document.getElementById("editFeatured").checked

            }

        );

        alert("✅ পোস্ট আপডেট হয়েছে");

        editModal.classList.add("hidden");

        loadPosts();

    }

    catch(error){

        console.error(error);

        alert("❌ Update Failed");

    }

}

/* ==========================
   DELETE POST
========================== */

window.removePost = async function(id){

    const ok = confirm(

        "এই পোস্টটি Delete করতে চান?"

    );

    if(!ok) return;

    try{

        await deleteDoc(

            doc(db,"posts",id)

        );

        alert("🗑 পোস্ট Delete হয়েছে");

        loadPosts();

    }

    catch(error){

        console.error(error);

        alert("❌ Delete Failed");

    }

};

/* ==========================
   CLOSE MODAL
========================== */

window.addEventListener("click",(e)=>{

    if(e.target===editModal){

        editModal.classList.add("hidden");

    }

});
/* ==========================
   DARK MODE
========================== */

const darkBtn = document.getElementById("darkModeBtn");

if (darkBtn) {

    if (localStorage.getItem("theme") === "dark") {

        document.body.classList.add("dark");

    }

    darkBtn.onclick = () => {

        document.body.classList.toggle("dark");

        localStorage.setItem(

            "theme",

            document.body.classList.contains("dark")
                ? "dark"
                : "light"

        );

    };

}

/* ==========================
   CHANGE PASSWORD
========================== */

import {
    updatePassword
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

const changePasswordBtn =
document.getElementById("changePasswordBtn");

if (changePasswordBtn) {

    changePasswordBtn.onclick = async () => {

        const newPassword = prompt("নতুন Password লিখুন");

        if (!newPassword) return;

        try {

            await updatePassword(

                auth.currentUser,
                newPassword

            );

            alert("✅ Password সফলভাবে পরিবর্তন হয়েছে");

        }

        catch (error) {

            alert(error.message);

        }

    };

}

/* ==========================
   VISITOR COUNT
========================== */

const visitor =
Number(localStorage.getItem("visitorCount") || 0) + 1;

localStorage.setItem(

    "visitorCount",

    visitor

);

const visitorBox =
document.getElementById("visitorCount");

if (visitorBox) {

    visitorBox.textContent = visitor;

}

/* ==========================
   BACKUP DATABASE
========================== */

const backupBtn =
document.getElementById("backupBtn");

if (backupBtn) {

    backupBtn.onclick = () => {

        const json = JSON.stringify(posts, null, 2);

        const blob = new Blob([json], {

            type: "application/json"

        });

        const url = URL.createObjectURL(blob);

        const a = document.createElement("a");

        a.href = url;

        a.download = "posts-backup.json";

        a.click();

        URL.revokeObjectURL(url);

    };

}

/* ==========================
   RESTORE
========================== */

const restoreBtn =
document.getElementById("restoreBtn");

if (restoreBtn) {

    restoreBtn.onclick = () => {

        alert(

            "Restore Feature পরবর্তী আপডেটে যুক্ত হবে"

        );

    };

}

/* ==========================
   TOAST
========================== */

window.showToast = function(message){

    let toast = document.getElementById("toast");

    if(!toast) return;

    toast.innerHTML = message;

    toast.classList.remove("hidden");

    setTimeout(()=>{

        toast.classList.add("hidden");

    },3000);

};

console.log("✅ Admin Dashboard Ready");
