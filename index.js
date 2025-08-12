import {
  getFirestore,
  getDoc,
  getAuth,
  signOut,
  db,
  collection,
  getDocs,
  updateDoc,
  arrayUnion,
  onAuthStateChanged,
  deleteDoc,
  doc,
  setDoc,
} from "./fireBase.js";

let product = {};
let CheckoutName = document.getElementById("CheckoutName");
const auth = getAuth();
async function displayName() {
  onAuthStateChanged(auth, (user) => {
    console.log(user);
    setTimeout(() => {
      if (user) {
        const uid = user.uid;
        Dashboard.innerText = `Hi!, ${user.displayName}`;
        CheckoutName.innerText = `${user.displayName}`;
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

let passkey = "123456";
async function deleteProduct(e) {
  await deleteDoc(doc(db, "Products", e));
  renderProducts();
}

// let Admin = false
addProductBtn.addEventListener("click", () => {
  let timerInterval;

  Swal.fire({
    title: "Enter Admin Password",
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
        title: "Incorrect PassKey",
        text: "Go away!",
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
    cart = [];
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
<div class="card" id="${doc.id}">
  <div class="card__shine"></div>
  <div class="card__glow"></div>
  <div class="card__content">
    
    <!-- Optional Badge (remove if not needed) -->
    <div class="card__badge">NEW</div>
    
    <!-- Product Image -->
    <div class="card__image" style="--bg-color: #a78bfa; background-image: url('${m.imageUrl}'); background-size: cover; background-position: center;"></div>
    
    <!-- Product Info -->
    <div class="card__text">
      <p class="card__title">${m.productName}</p>
      <p class="card__description">Hover to reveal stunning effects</p>
    </div>
    
    <!-- Footer -->
    <div class="card__footer">
      <div class="card__price">$${m.ProductPrice}</div>
      <div class="card__button" onclick="addToCart('${doc.id}', '${m.productName}', '${m.ProductPrice}')">
        <svg height="16" width="16" viewBox="0 0 24 24">
          <path
            stroke-width="2"
            stroke="currentColor"
            d="M4 12H20M12 4V20"
            fill="currentColor"
          ></path>
        </svg>
      </div>
    </div>
    
  </div>
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
}

function updateCart() {
  const cartItems = document.getElementById("cartItems");
  const cartSidebar = document.getElementById("cartSidebar");
  cartItems.innerHTML = "";

  let totalPrice = 0;
  cart.forEach((item) => {
    totalPrice += item.price * item.quantity;
    cartItems.innerHTML += `
      <div class="mb-4 border-b pb-2">
        <p class="font-semibold">${item.name}</p>
        <p class="text-sm text-gray-600">Price: $${item.price}</p>
        <p class="text-sm text-gray-600">Quantity</p>
                <button onclick="minusBtn('${item.id}')" class="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded">-</button>
<span>${item.quantity}</span>
<button onclick="plusBtn('${item.id}')" class="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded">+</button>
        <button onclick="deleteFromCart('${item.id}')" class="bg-gray-300 hover:bg-gray-400 text-black px-3 py-1 rounded"> Delete🗑️</button>

      </div>
    `;
  });
  window.minusBtn = minusBtn;
  window.plusBtn = plusBtn;

  async function minusBtn(itemid) {
    let exists = cart.find((item) => item.id === itemid);
    if (exists) {
      if (exists.quantity > 1) {
        exists.quantity += -1;
      }
    }
    await cartTofireBase();
    updateCart();
  }

  async function plusBtn(itemId) {
    let existingProduct = cart.find((item) => item.id === itemId);

    if (existingProduct) {
      existingProduct.quantity += 1;
      await cartTofireBase();
      updateCart();
    }
  }
  let Subtotal = document.getElementById("Subtotal");
  let finalPrice = document.getElementById("finalPrice");

  let nettotal = document.getElementById("totalPrice");
  let TotalQuanitiy = document.getElementById("TotalQuanitiy");
  nettotal.innerText = `$${totalPrice.toFixed(2)}`;
  if (window.cartCount) {
    let total = 0;
    cart.forEach((element) => {
      total += element.quantity;
    });
    cartCount.textContent = total;

    TotalQuanitiy.innerText = total;
    Subtotal.innerText = `$${totalPrice}`;
    finalPrice.innerText = `$${totalPrice + 12.4}  `;
    // console.log(Subtotal.innerText);
  }
}

auth.onAuthStateChanged((user) => {
  if (user) {
    lodingCart();
  } else {
    updateCart();
  }
});
let cart = [];

auth.onAuthStateChanged(async (user) => {
  if (user) {
    await lodingCart();
  } else {
    cart = [];
    updateCart();
  }
});
console.table(cart);

async function lodingCart() {
  const user = auth.currentUser;
  if (!user) return;

  const cartRef = doc(db, "carts", user.uid);
  const cortsnap = await getDoc(cartRef);

  if (cortsnap.exists()) {
    cart = cortsnap.data().items || [];
  } else {
    cart = [];
  }

  updateCart();
}
// console.log(cart);

async function cartTofireBase() {
  const user = auth.currentUser;
  if (!user) return;

  const cartRef = doc(db, "carts", user.uid);
  await setDoc(cartRef, { items: cart }, { merge: true });
}

let minusBtn = document.getElementById("minusBtn");
let plusBtn = document.getElementById("plusBtn");

async function addToCart(productId, productName, productPrice) {
  const user = auth.currentUser;
  if (!user) {
    alert("Please log in to add to cart");
    return;
  }
  let existingProduct = cart.find((item) => item.id === productId);

  if (existingProduct) {
    existingProduct.quantity += 1;
  } else {
    cart.push({
      id: productId,
      name: productName,
      price: productPrice,
      quantity: 1,
    });
  }

  await cartTofireBase();
  updateCart();
}

let MainBody = document.getElementById("MainBody");
let checkoutdiv = document.getElementById("checkoutdiv");
let Checkout = document.getElementById("Checkout");

let backToPage = document.getElementById("backToPage");

Checkout.addEventListener("click", () => {
  cartSidebar.classList.toggle("-translate-x-full");
  MainBody.classList.toggle("hidden");

  checkoutdiv.classList.toggle("hidden");
});

backToPage.addEventListener("click", () => {
  Swal.fire({
    title: "Thank You",
    text: "Thank you for purchasing Our movie",
    icon: "success",
  }).then(() => {
    checkoutdiv.classList.toggle("hidden");

    MainBody.classList.toggle("hidden");
  });
});

const cartSidebar = document.getElementById("cartSidebar");
const toggleCartBtn = document.getElementById("toggleCartBtn");
const CloseCartBtn = document.getElementById("CloseCartBtn");

toggleCartBtn.addEventListener("click", () => {
  cartSidebar.classList.toggle("-translate-x-full");
});

CloseCartBtn.addEventListener("click", () => {
  cartSidebar.classList.toggle("-translate-x-full");
});
async function deleteFromCart(itemId) {
  const index = cart.findIndex((item) => item.id === itemId);

  if (index !== -1) {
    cart.splice(index, 1);
    await cartTofireBase();
    updateCart();
  }
}

window.deleteFromCart = deleteFromCart;
