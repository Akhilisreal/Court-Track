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

// Login
function login() {
  const email = document.getElementById("email").value;
  const pass = document.getElementById("password").value;
  const messageEl = document.getElementById("loginMessage");

  auth.signInWithEmailAndPassword(email, pass)
    .then(() => {
      window.location.href = "index.html";
    })
    .catch(err => {
      let msg = "Something went wrong.";
      if (err.code === "auth/user-not-found") msg = "No account found with that email.";
      else if (err.code === "auth/wrong-password") msg = "Wrong password. Please try again.";
      messageEl.innerText = msg;
      messageEl.className = "message error";
    });
}

// Sign Up
function signup() {
  const email = document.getElementById("signupEmail").value;
  const pass = document.getElementById("signupPassword").value;
  const messageEl = document.getElementById("signupMessage");

  auth.createUserWithEmailAndPassword(email, pass)
    .then(() => {
      messageEl.innerText = "Account created! Redirecting to login...";
      messageEl.className = "message success";
      setTimeout(() => window.location.href = "login.html", 1500);
    })
    .catch(err => {
      let msg = "Could not create account.";
      if (err.code === "auth/email-already-in-use") {
        msg = "That email is already registered. Please use another one.";
      } else if (err.code === "auth/invalid-email") {
        msg = "Please enter a valid email.";
      } else if (err.code === "auth/weak-password") {
        msg = "Password should be at least 6 characters.";
      }
      messageEl.innerText = msg;
      messageEl.className = "message error";
    });
}
