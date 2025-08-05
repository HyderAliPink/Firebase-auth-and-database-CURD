import {
  getAuth,
  createUserWithEmailAndPassword,
  updateProfile,
} from "./fireBase.js";

const auth = getAuth();

let registerEmail = document.getElementById("registerEmail");
let registerName = document.getElementById("registerName");
let registerPassword = document.getElementById("registerPassword");
let registerBtn = document.getElementById("registerBtn");

registerBtn.addEventListener("click", (e) => {
  e.preventDefault();

  let email = registerEmail.value;
  let name = registerName.value;
  let password = registerPassword.value;

  if (email === "" || name === "" || password === "") {
    Swal.fire({
      icon: "warning",
      title: "Missing fields",
      text: "Please fill in all the fields!",
    });
    return;
  }

  createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      const user = userCredential.user;

      return updateProfile(user, { displayName: name });
    })
    .then(() => {
      Swal.fire({
        icon: "success",
        title: "Registration Successful",
        text: "You will now be redirected to the login page...",
        confirmButtonText: "Okay",
      }).then(() => {
        window.location.href = "login.html";
      });
    })
    .catch((error) => {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.message,
      });
    });
});
