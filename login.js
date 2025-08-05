import { getAuth, signInWithEmailAndPassword } from "./fireBase.js";

const auth = getAuth();
let loginPassword = document.getElementById("loginPassword");
let loginEmail = document.getElementById("loginEmail");
let loginBtn = document.getElementById("loginBtn");

loginBtn.addEventListener("click", () => {
  if (loginEmail.value === " " || loginPassword.value === "") {
    Swal.fire({
      icon: "error",
      title: ":/",
      text: "fill in all fields, Please",
    });
    return;
  }
  Login();

  function Login() {
    let email = loginEmail.value;
    let password = loginPassword.value;
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        Swal.fire({
          icon: "success",
          title: "Login Successful",
          text: "Welcome back!",
          timer: 1200,
          showConfirmButton: false,
        }).then(() => {
          window.location.href = "index.html";
        });
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        
        loginEmail.value = ""
        loginPassword.value = ""

        console.log(errorCode);
        console.log(errorMessage);
        swal.fire({
          icon: "error",
          title: "Login Failed",
          text: errorMessage,
        });
      });
  }
});
