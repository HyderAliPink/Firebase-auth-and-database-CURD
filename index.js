import { getAuth, signOut, db, collection,  getDocs, onAuthStateChanged  } from "./fireBase.js";
const auth = getAuth();


async function displayName(){
  
onAuthStateChanged(auth, (user) => {
  // console.log(user.displayName);
  
  if (user) {
    const uid = user.uid;
    Dashboard.innerText = `Welcome, ${user.displayName}`
    console.log(user);
    
  } else {
    window.location.href = "register.html"
  }
});



}

displayName()





// let PopupAddProductDiv = document.getElementById('PopupAddProductDiv')
let logoutBtn = document.getElementById("logoutBtn")


const addProductBtn = document.getElementById("addProductBtn");
// const PopupAddProduct = document.getElementById("PopupAddProduct");
// const CloseBTN = document.getElementById("CloseBTN");
const Dashboard = document.getElementById("Dashboard")

addProductBtn.addEventListener('click', () => {
  
 let timerInterval;
Swal.fire({
  title: "REDIRECT",
  html: "Redirecting in <b></b> milliseconds.",
  timer: 1000,
  timerProgressBar: true,
  didOpen: () => {
    Swal.showLoading();
    const timer = Swal.getPopup().querySelector("b");
    timerInterval = setInterval(() => {
      timer.textContent = `${Swal.getTimerLeft()}`;
    }, 100);
  },
  willClose: () => {
    clearInterval(timerInterval);
  }
}).then((result) => {
  /* Read more about handling dismissals below */
  if (result.dismiss === Swal.DismissReason.timer) {
    window.location.href = 'Addproduct.html'
  }
});



});







logoutBtn.addEventListener("click", () => {
     signOut(auth)
    .then(() => {
      // Show a success message
      Swal.fire({
        icon: "success",
        title: "Logged Out",
        text: "Logging out in",
        timer: 1000,
        showConfirmButton: false
      }).then(() => {
        window.location.href = "login.html";
      });
    })
}  )
let Allproducts = [];
 let CardDiv = document.getElementById('CardDiv')

async function renderProducts() {
  const querySnapshot = await getDocs(collection(db, "Products"));

  if (querySnapshot.empty) {
    CardDiv.innerHTML = `
      <p class="text-center text-gray-600 text-lg">No products available. </p>
    `;
  } else {
    const renderingProducts = [];

    querySnapshot.forEach((doc) => {
      const m = doc.data();

      renderingProducts.push(`
        <div class="bg-white p-4 rounded-lg shadow-md w-72">
          <img 
            src="${m.imageUrl}" 
            alt="Product Image" 
            class="w-full h-40 object-cover rounded-md mb-3"
          />
          <h2 class="text-lg font-semibold text-gray-800 mb-2">${m.productName}</h2>
          <p class="text-sm font-medium text-gray-700">Price: $${m.ProductPrice}</p>
        </div>
      `);
    });

    CardDiv.innerHTML = renderingProducts.join("");
  }
}

renderProducts();





