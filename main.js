import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";
import {
  getDatabase,
  ref,
  push,
  onValue,
  remove,
} from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js";

const firebaseConfig = {
  databaseURL:
    "https://addtocart-691b7-default-rtdb.europe-west1.firebasedatabase.app/",
};
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
const cartInDatabase = ref(database, "cartList");

const addButton = document.getElementById("add-cart");
const inputField = document.getElementById("input-field");
const cartUl = document.getElementById("flex-cart-list");

addButton.addEventListener("click", function () {
  let inputValue = inputField.value;
  if (inputValue != "") {
    push(cartInDatabase, inputValue);
    resetInputField();
  }
});
onValue(cartInDatabase, function (snapshot) {
  if (snapshot.exists()) {
    let productArray = Object.entries(snapshot.val());
    clearCart();
    for (let i = 0; i < productArray.length; i++) {
      let currentItem = productArray[i];
      let currentItemID = currentItem[0];
      let currentItemValue = currentItem[1];

      addToCartList(currentItem);
    }
  } else {
    cartUl.innerHTML = "No items here...yet";
  }
});

function addToCartList(item) {
  let itemID = item[0];
  let itemValue = item[1];

  let listElement = document.createElement("li");
  listElement.textContent = itemValue;

  listElement.addEventListener("click", function () {
    let locationOfItem = ref(database, `cartList/${itemID}`);
    remove(locationOfItem);
  });
  cartUl.append(listElement);
}

function resetInputField() {
  inputField.value = "";
}
function clearCart() {
  cartUl.innerHTML = "";
}
