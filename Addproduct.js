import { getAuth, db, collection, addDoc  } from "./fireBase.js";

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

