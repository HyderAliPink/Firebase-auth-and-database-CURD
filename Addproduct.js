import { getAuth, db, collection, onAuthStateChanged, addDoc, deleteDoc, getDocs, doc, updateDoc, getDoc } from "./fireBase.js";


// const auth = getAuth();

function Admincheck(){

const auth = getAuth();
onAuthStateChanged(auth, (user) => {
  if (user.uid === "ZYVskTQNfghRUCThKC1rfOAVuT22") {
    // const uid = user.uid;
    // console.log( );
    
  } else {
        window.location.href = "index.html"

  }
});
}

Admincheck()




let submitProduct = document.getElementById('submitProduct');
let CardAdmin = document.getElementById("CardAdmin");

// Track edit state
let currentEditId = null;

submitProduct.addEventListener('click', async () => {
  let productName = document.getElementById('productName').value;
  let imageUrl = document.getElementById('imageUrl').value;
  let ProductPrice = document.getElementById('ProductPrice').value;

  if (!productName || !imageUrl || !ProductPrice) {
    console.log("dead");
    return;
  }

  if (currentEditId) {
    // Update existing product
    await updateDoc(doc(db, "Products", currentEditId), {
      productName,
      imageUrl,
      ProductPrice
    });
    currentEditId = null;
  } else {
    // Add new product
    await addDoc(collection(db, "Products"), {
      productName,
      imageUrl,
      ProductPrice
    });
  }

  // Reset form
  document.getElementById('productName').value = "";
  document.getElementById('imageUrl').value = "";
  document.getElementById('ProductPrice').value = "";

  renderProducts();
});

async function renderProducts() {
  const querySnapshot = await getDocs(collection(db, "Products"));

  if (querySnapshot.empty) {
    CardAdmin.innerHTML = `<p class="text-center text-gray-600 text-lg">No products available.</p>`;
    return;
  }

  const renderingProducts = [];
  querySnapshot.forEach((docSnap) => {
    const m = docSnap.data();
    renderingProducts.push(`
      <div class="bg-white p-4 rounded-lg shadow-md">
        <img src="${m.imageUrl}" alt="Product Image" class="w-full h-40 object-fill rounded-md mb-3" />
        <h2 class="text-lg font-semibold text-gray-800 mb-2">${m.productName}</h2>
        <p class="text-sm font-medium text-gray-700">Price: $${m.ProductPrice}</p>
        <button onclick="deleteProduct('${docSnap.id}')" class="w-[90%] bg-blue-500 text-white py-2 px-4 mb-4 rounded hover:bg-blue-600 transition duration-300">Delete</button>
        <button onclick="editProduct('${docSnap.id}')" class="w-[90%] bg-red-500 text-white py-2 px-4 mb-4 rounded hover:bg-red-600 transition duration-300">Edit</button>
      </div>
    `);
  });

  CardAdmin.innerHTML = renderingProducts.join("");
}

async function deleteProduct(id) {
  await deleteDoc(doc(db, "Products", id));
  renderProducts();
}

async function editProduct(id) {
  const productRef = doc(db, "Products", id);
  const productinst = await getDoc(productRef);

  if (productinst.exists()) {
    const data = productinst.data();
    document.getElementById('productName').value = data.productName;
    document.getElementById('imageUrl').value = data.imageUrl;
    document.getElementById('ProductPrice').value = data.ProductPrice;

    // Switch to edit mode
    currentEditId = id;
  }
}

window.deleteProduct = deleteProduct;
window.editProduct = editProduct;

renderProducts();
