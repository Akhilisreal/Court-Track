const firebaseConfig = {
  apiKey: "AIzaSyCrYV93K7mYvMSmrIwXbq8shrFGR-ISi5k",
  authDomain: "court-track.firebaseapp.com",
  databaseURL: "https://court-track-default-rtdb.firebaseio.com",
  projectId: "court-track",
  storageBucket: "court-track.appspot.com",
  messagingSenderId: "586737413743",
  appId: "1:586737413743:web:94cebccf2e3231cdff679a"
};

firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.database();
const courtRef = db.ref("courtsInUse");
const userCheckinRef = uid => db.ref("checkIns/" + uid);

const totalCourts = 4;
let currentUser = null;

auth.onAuthStateChanged(user => {
  if (user) {
    currentUser = user;
    document.getElementById("userStatus").innerText = `Logged in as: ${user.email}`;
    loadUserCheckins();
  } else {
    alert("You must be logged in.");
    window.location.href = "login.html";
  }
});

courtRef.on("value", snapshot => {
  const used = snapshot.val() || 0;
  const available = totalCourts - used;
  document.getElementById("courtCount").innerHTML =
    `<span class="available">${available} available</span> | <span class="in-use">${used} in use</span>`;
});

function loadUserCheckins() {
  userCheckinRef(currentUser.uid).on("value", snap => {
    const count = snap.val() || 0;
    document.getElementById("userCheckins").innerText = `Your check-ins: ${count}`;
  });
}

window.checkIn = function () {
  if (!currentUser) return;

  courtRef.transaction(global => {
    if ((global || 0) < totalCourts) return (global || 0) + 1;
    alert("All courts are currently in use.");
    return global;
  });

  userCheckinRef(currentUser.uid).transaction(count => (count || 0) + 1);
};

window.checkOut = function () {
  if (!currentUser) return;

  userCheckinRef(currentUser.uid).transaction(userCount => {
    if ((userCount || 0) > 0) {
      courtRef.transaction(global => (global || 0) - 1);
      return userCount - 1;
    } else {
      alert("You can't check out more courts than you checked in.");
      return userCount;
    }
  });
};

window.logout = function () {
  auth.signOut().then(() => {
    window.location.href = "login.html";
  });
};
