import {
  getAuth,
  signOut,
  db,
  collection,
  getDocs,
  onAuthStateChanged,
  deleteDoc,
  doc,
} from "./fireBase.js";

let product = {};

const auth = getAuth();
document.getElementById("page").classList.remove("hidden");
document.getElementById("page").classList.add("flex");
async function displayName() {
  onAuthStateChanged(auth, (user) => {
    // console.log(user.displayName);
    setTimeout(() => {
      if (user) {
        document.getElementById("page").classList.remove("flex");

        document.getElementById("page").classList.add("hidden");
        const uid = user.uid;
        Dashboard.innerText = `Hi!, ${user.displayName}`;
        // console.log(user);
      } else {
        Swal.fire({
          icon: "success",
          title: "Logged Out",
          text: "Logging out in",
          timer: 1000,
          showConfirmButton: false,
        });
        setTimeout(() => {
          window.location.href = "register.html";
        }, 1200);
      }
    }, 500);
  });
}

displayName();

let logoutBtn = document.getElementById("logoutBtn");
const addProductBtn = document.getElementById("addProductBtn");
const Dashboard = document.getElementById("Dashboard");

// let Admin;
// let user = true;
//         }})
let passkey = "123456";
async function deleteProduct(e) {
  await deleteDoc(doc(db, "Products", e));
  renderProducts();
}
addProductBtn.addEventListener("click", () => {
  let timerInterval;
  
  Swal.fire({
    title: "Enter Passkey",
    input: "password",
    inputLabel: "Passkey",
    inputPlaceholder: "••••••••",
    showCancelButton: true,
    confirmButtonText: "Submit",
  }).then((result) => {
    if (result.isConfirmed && result.value === passkey) {
      console.log("success");

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
        },
      }).then((res) => {
        if (res.dismiss === Swal.DismissReason.timer) {
          window.location.href = "Addproduct.html";
          Admin = true;
          user = false;
        }
      });

      console.log("Passkey entered:", result.value);
    } else if (result.isConfirmed && result.value !== passkey) {
      console.log("Invalid passkey");
      Swal.fire({
        icon: "error",
        title: "Incorrect passkey",
        text: "Please try again.",
      });
    }
  });
});

logoutBtn.addEventListener("click", () => {
  signOut(auth).then(() => {
    Swal.fire({
      icon: "success",
      title: "Logged Out",
      text: "Sad to see you go.",
      timer: 1000,
      showConfirmButton: false,
    });
  });
});

let CardDiv = document.getElementById("CardDiv");

async function renderProducts() {
  const querySnapshot = await getDocs(collection(db, "Products"));

  if (querySnapshot.empty) {
    CardDiv.innerHTML = `
      <p class="text-center text-gray-600 text-lg">No products available.</p>
    `;
  } else {
    const renderingProducts = [];

    querySnapshot.forEach((doc) => {
      const m = doc.data();

      product = doc.data();

      renderingProducts.push(`
  <div class="bg-white p-4 rounded-lg shadow-md">
    <img 
      src="${m.imageUrl}" 
      alt="Product Image" 
      class="w-full h-40 object-fill rounded-md mb-3"
    />
    <h2 class="text-lg font-semibold text-gray-800 mb-2">${m.productName}</h2>
    <p class="text-sm font-medium text-gray-700">Price: $${m.ProductPrice}</p>
    <button 
      onclick="addToCart('${doc.id}', '${m.productName}', ${m.ProductPrice})" 
      class="bg-blue-500 text-white px-3 py-1 rounded">
      Add to Cart
    </button>
  </div>
`);
    });

    CardDiv.innerHTML = renderingProducts.join("");
  }
}

window.deleteProduct = deleteProduct;
window.addToCart = addToCart;

renderProducts();



async function getProducts() {
  const querySnapshot = await getDocs(collection(db, "Products"));
  let product = [];
  querySnapshot.forEach((doc) => {
    product.push({ id: doc.id, ...doc.data() });
  });
  console.table(product);
}
let cart = [];

function addToCart(productId, productName, productPrice) {
  console.table(cart);
  
   let existingProduct = cart.find(item => item.id === productId);
      console.log(existingProduct);
      // at first this will be undefine which is falsy value so if nhi chaly ga else chaly ga
      // jab else chaly ga to exsisting product main cart.find( item.id ===prodcut id ko)
      // compare kare ga to object return hogi which is truthty value, to quantity jo k humne 
      // cart.push se add ki this quantity wo ab if waly block main plus ho jaye gi.
      // object update ho jaye gi
      // 

      //  console.log(existingProduct.quantity);

  

  if (existingProduct) {

    existingProduct.quantity += 1;

  } else {
    cart.push({
      id: productId,
      name: productName,
      price: productPrice,
      quantity: 1
    });
  }

  updateCart();
}

function updateCart() {
  const cartItems = document.getElementById("cartItems");
  const cartSidebar = document.getElementById("cartSidebar");
  cartItems.innerHTML = ""; 

  let totalPrice = 0;

  cart.forEach(item => {
    totalPrice += item.price * item.quantity;

    cartItems.innerHTML += `
      <div class="mb-4 border-b pb-2">
        <p class="font-semibold">${item.name}</p>
        <p class="text-sm text-gray-600">Price: $${item.price.toFixed(2)}</p>
        <p class="text-sm text-gray-600">Quantity: ${item.quantity}</p>
        <button id="${item.id}">🗑️</button>
      </div>
    `;
  });

  const totalPriceDiv = cartSidebar.querySelector("h2.text-lg.font-bold.mt-4");
  if (totalPriceDiv) {
    totalPriceDiv.textContent = `Total: $${totalPrice.toFixed(2)}`;
  }
  
  if(window.cartCount) {
    cartCount.textContent = cart.length;
  }
}

// when i wrote the code only i and god knew what i wrote. now only god knows what i wrote.

