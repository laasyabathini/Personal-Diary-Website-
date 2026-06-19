import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";

import {
getAuth,
createUserWithEmailAndPassword,
signInWithEmailAndPassword,
signOut,

} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

import {
getFirestore,
collection,
addDoc,
getDocs,
query,
where
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const firebaseConfig = {
apiKey: "AIzaSyBqirqxt5-XYq6eLwLzCcoXHtVwsiI80zU",
authDomain: "dairy-be2a4.firebaseapp.com",
projectId: "dairy-be2a4",
storageBucket: "dairy-be2a4.firebasestorage.app",
messagingSenderId: "661914828098",
appId: "1:661914828098:web:0fe11330a39480dd2b5cdb"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

let currentDate = new Date();

/* ------------------- DATE ------------------- */

const months = [
"January","February","March","April",
"May","June","July","August",
"September","October","November","December"
];

function fillDateDropdowns(){

const daySelect = document.getElementById("daySelect");
const monthSelect = document.getElementById("monthSelect");
const yearSelect = document.getElementById("yearSelect");

daySelect.innerHTML="";
monthSelect.innerHTML="";
yearSelect.innerHTML="";

for(let i=1;i<=31;i++){
daySelect.innerHTML += `<option value="${i}">${i}</option>`;
}

months.forEach((month,index)=>{
monthSelect.innerHTML +=
`<option value="${index}">${month}</option>`;
});

for(let y=2024;y<=2050;y++){
yearSelect.innerHTML +=
`<option value="${y}">${y}</option>`;
}

daySelect.value=currentDate.getDate();
monthSelect.value=currentDate.getMonth();
yearSelect.value=currentDate.getFullYear();

updateDateText();
}

function updateDateText(){

const options={
weekday:"long",
year:"numeric",
month:"long",
day:"numeric"
};

document.getElementById("currentDate").innerText =
currentDate.toLocaleDateString("en-US",options);
}

function getDateKey(){

const d=currentDate.getDate();
const m=currentDate.getMonth()+1;
const y=currentDate.getFullYear();

return `${d}-${m}-${y}`;
}

/* ------------------- REGISTER ------------------- */

window.register = async()=>{

const email =
document.getElementById("email").value;

const password =
document.getElementById("password").value;

try{

await createUserWithEmailAndPassword(
auth,
email,
password
);

alert("Registration Success");

}catch(err){

alert(err.message);

}
};
window.searchNotes = async()=>{

const search =
document.getElementById("searchInput")
.value
.toLowerCase();

const user = auth.currentUser;

if(!user) return;

const q = query(
collection(db,"notes"),
where("uid","==",user.uid)
);

const snapshot = await getDocs(q);

let html = "";

snapshot.forEach(doc=>{

const note = doc.data();

if(
note.text.toLowerCase().includes(search)
){

html += `
<div class="note">
<b>📅 ${note.date}</b><br><br>
${note.text}
</div>
`;

}

});

document.getElementById("notes").innerHTML =
html;

}


/* ------------------- LOGIN ------------------- */



window.login = async()=>{

const email =
document.getElementById("email").value;

const password =
document.getElementById("password").value;

try{

await signInWithEmailAndPassword(
auth,
email,
password
);

document
.getElementById("authBox")
.classList.add("hidden");

document
.getElementById("diaryBox")
.classList.remove("hidden");

fillDateDropdowns();

loadNote();

}catch(err){

alert(err.message);

}
};

/* ------------------- SAVE ------------------- */

window.saveNote = async()=>{

const user = auth.currentUser;

if(!user){

alert("Please login first");

return;

}

const text =

document.getElementById("noteText")

.value

.trim();

if(text===""){

alert("Write something first");

return;

}

try{

await addDoc(

collection(db,"notes"),

{

uid:user.uid,

date:getDateKey(),

text:text,

createdAt:new Date()

}

);

showMessage("Diary Saved ❤️");

}

catch(error){

alert(error.message);

}

};



/* ------------------- LOAD ------------------- */

async function loadNote(){

const user = auth.currentUser;

if(!user) return;

const q = query(
collection(db,"notes"),
where("uid","==",user.uid),
where("date","==",getDateKey())
);

const snapshot = await getDocs(q);

let latest="";

snapshot.forEach(doc=>{

latest = doc.data().text;

});

document.getElementById("noteText").value =
latest;

}

/* ------------------- PREVIOUS ------------------- */

document.addEventListener("DOMContentLoaded",()=>{

const prevBtn =
document.getElementById("prevBtn");

const nextBtn =
document.getElementById("nextBtn");

const daySelect =
document.getElementById("daySelect");

const monthSelect =
document.getElementById("monthSelect");

const yearSelect =
document.getElementById("yearSelect");

if(prevBtn){

prevBtn.addEventListener("click",()=>{

currentDate.setDate(
currentDate.getDate()-1
);

syncDate();
});

}

if(nextBtn){

nextBtn.addEventListener("click",()=>{

currentDate.setDate(
currentDate.getDate()+1
);

syncDate();
});

}

function syncDate(){

daySelect.value=currentDate.getDate();
monthSelect.value=currentDate.getMonth();
yearSelect.value=currentDate.getFullYear();

updateDateText();

if(auth.currentUser){
loadNote();
}
}

daySelect?.addEventListener("change",changeDate);
monthSelect?.addEventListener("change",changeDate);
yearSelect?.addEventListener("change",changeDate);

function changeDate(){

currentDate = new Date(
yearSelect.value,
monthSelect.value,
daySelect.value
);

updateDateText();

if(auth.currentUser){
loadNote();
}
}

});

/* ------------------- LOGOUT ------------------- */

window.logout = async()=>{

await signOut(auth);

document
.getElementById("diaryBox")
.classList.add("hidden");

document
.getElementById("authBox")
.classList.remove("hidden");

};
window.addEventListener("load", () => {

document.getElementById("email").value = "";
document.getElementById("password").value = "";

});
document
.getElementById("darkBtn")
.addEventListener(

"click",

()=>{

document.body
.classList
.toggle("dark");

});


function showMessage(text){

const box =

document.getElementById("messageBox");

box.innerText=text;

box.style.display="block";

setTimeout(()=>{

box.style.display="none";

},2000);

}
