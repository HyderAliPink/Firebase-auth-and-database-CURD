import { getAuth, db, collection, addDoc, getDocs, deleteDoc  } from "./fireBase.js";

const auth = getAuth();



let submitProduct = document.getElementById('submitProduct')
// console.log(productName)


submitProduct.addEventListener('click', async()=> {
let productName = document.getElementById('productName').value
let imageUrl = document.getElementById('imageUrl').value
let ProductPrice = document.getElementById('ProductPrice').value


    if (!productName || !imageUrl || !ProductPrice) {
        console.log("dead");
        return;
        
    }

    try {
  const docRef = await addDoc(collection(db, "Products"), {
    productName,
    imageUrl,
    ProductPrice
  });


  console.log("Document written with ID: ", docRef.id);
   document.getElementById('productName').value = "";
    document.getElementById('imageUrl').value = "";
    document.getElementById('ProductPrice').value = "";
} catch (e) {
    console.error("Error adding document: ", e);
}



})

let CardAdmin = document.getElementById("CardAdmin");



async function renderProducts() {
  const querySnapshot = await getDocs(collection(db, "Products"));

  if (querySnapshot.empty) {
    CardAdmin.innerHTML = `
      <p class="text-center text-gray-600 text-lg">No products available.</p>
    `;
  } else {
    const renderingProducts = [];

    querySnapshot.forEach((doc) => {
      const m = doc.data();
      // console.log(doc.id);

      renderingProducts.push(`
        <div class="bg-white p-4 rounded-lg shadow-md  ">
          <img 
            src="${m.imageUrl}" 
            alt="Product Image" 
            class="w-full h-40 object-fill rounded-md mb-3"
          />
          <h2 class="text-lg font-semibold text-gray-800 mb-2">${m.productName}</h2>
          <p class="text-sm font-medium text-gray-700">Price: $${m.ProductPrice}</p>
          <button onclick="deleteProduct('${doc.id}')" class="w-[90%] bg-blue-500 text-white py-2 px-4 mb-4 rounded hover:bg-blue-600 transition duration-300">
      Delete
    </button>
    <button class="w-[90%] bg-red-500 text-white py-2 px-4 mb-4 rounded hover:bg-red-600 transition duration-300" >Edit</button>
        </div>
         
      `);
    });

    CardAdmin.innerHTML = renderingProducts.join("");
  }
}

async function deleteProduct(e) {
  await deleteDoc(doc(db, "Products", e));
  renderProducts();
}

window.deleteProduct = deleteProduct;


  renderProducts();


