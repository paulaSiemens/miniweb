document.addEventListener("DOMContentLoaded", () => {
  CART.init()
  console.log("DOM loaded");

  showProducts(CART.contents)
  updateCartTotal()
  console.log("Showing Products function running")

});

// Updates the cart total by iterating over every element in the cart, summing the price per item (accounting for quantity),
// and writing the total price to the Cart Total field. 
function updateCartTotal() {
  var cartItemContainer = document.getElementsByClassName('cart-items')[0]
  var cartRows = cartItemContainer.getElementsByClassName('cart-row')
  var total = 0
  for (var i = 0; i < cartRows.length; i++) {
    var cartRow = cartRows[i]
    var priceElement = cartRow.getElementsByClassName('cart-price')[0]
    var quantityElement = cartRow.getElementsByClassName('cart-quantity-input')[0]
    var price = parseFloat(priceElement.innerText.replace("$", ""))
    var quantity = quantityElement.value
    quantity = parseInt(quantity)
    console.log(price * quantity)
    total = total + (price * quantity)

  }
  total = Math.round(total * 100) / 100 // round to nearest two decimals
  document.getElementsByClassName("cart-total-price")[0].innerText = "$" + total
}

const CART = {
  KEY: "testKey",
  contents: [],
  idCounter: 0,
  init() {
    console.log("Hello")
    //check localStorage and initialize the contents of CART.contents
    let _contents = localStorage.getItem(CART.KEY);
    let idIncrment = localStorage.getItem("id");
    if (!idIncrment) localStorage.setItem("id", 0);
    console.log(_contents)
    if (_contents) {
      CART.contents = JSON.parse(_contents);
    } else {
      // dummy test data
      CART.contents = [];
      CART.sync();
    }
  },

  addProduct(image, title, quantity, price) {
    let curId = Number.parseInt(localStorage.getItem("id"));
    localStorage.setItem("id", curId + 1)

    let obj = { id: curId, image: image, title: title, qty: quantity, itemPrice: price };
    this.contents.push(obj);
  },

  async sync() {
    let _cart = JSON.stringify(CART.contents);
    await localStorage.setItem(CART.KEY, _cart);
  },

  find(id) {
    //find an item in the cart by its id
    let match = CART.contents.filter(item => {
      if (item.id == id)
        return true;
    });
    if (match && match[0])
      return match[0];
  },

  add(id) {
    //add new item to cart
    // check it's not already in cart
    if (CART.find(id)) {
      CART.increase(id, 1);
    } else {
      let arr = contents.filter(products => {
        if (products.id == id) {
          return true;
        }
      });
      if (arr && arr[0]) {
        let obj = {
          id: arr[0].id,
          title: arr[0].title,
          qty: 1,
          itemPrice: arr[0].price
        };
        CART.contents.push(obj);
        // update localStorage
        CART.sync();
      } else {
        // product id does not exist in products data
        console.error("Invalid product");
      }
    }
  },

  increase(id, qty = 1) {
    // increase item qty of item in cart
    CART.contents = CART.contents.map(item => {
      if (item.id === id)
        item.qty = item.qty + qty;
      return item;
    });
  },

  reduce(id, qty = 1) {
    // increase item qty of item in cart
    CART.contents = CART.contents.map(item => {
      if (item.id === id)
        item.qty = item.qty - qty;
      return item;
    });
    CART.contents.forEach(async, item => {
      if (item.id === id && item.qty === 0)
        CART.remove(id);
    });
    CART.sync()
  },

  remove(id) {
    //remove item entirely from CART.contens based on its id
    CART.contents = CART.contents.filter(item => {
      console.log("Remove was pressed");
      return (item.id === id) ? false : true;

      // if (item.id !== id) {
      //   // console.log(`Compare was: ${item.id !== id}´)
      //   return false;}
    });
    //update localStorage
    CART.sync()
  },
  empty() {
    //empty cart
    CART.contents = [];
    //update localStorage
    CART.sync()
  },
  sort(field = "title") {
    //sort by field - title, price, etc
    //return sorted shallow copy of the CART.contents array
    let sorted = CART.contents.sort((a, b) => {
      if (a[field] > b[field]) {
        return 1;
      } else if (a[field] < a[field]) {
        return -1;
      } else {
        return 0;
      }
    });
    return sorted;
    // no impact on localStorage
  }
};

// function incrementCart(ev){}
// function decrementCart(ev){}


// Show the contents of localStorage on the cart page
function showProducts(contents) {
  console.log(contents)
  let productSection = document.getElementsByClassName("cart-items")[0]
  console.log(productSection)
  productSection.innerHTML = "";
  contents.forEach(product => {
    let row = document.createElement("div");
    row.className = "cart-row";

    let cartCol = document.createElement("span");
    cartCol.className = "cart-item cart-column"
    //add image to the row
    let img = document.createElement("img");
    img.alt = product.title;
    img.src = product.image;
    img.className = "cart-item-img"

    cartCol.appendChild(img)

    //add item name to row
    let title = document.createElement("span");
    title.textContent = product.title;
    title.className = "cart-item-title"
    cartCol.appendChild(title);
    row.appendChild(cartCol);

    //add price
    let price = document.createElement("span")

    price.textContent = product.itemPrice;
    price.className = "cart-price cart-column";
    row.appendChild(price);

    //add quantity
    let quantityCol = document.createElement("div");
    quantityCol.className = "cart-quantity cart-column"

    let quantity = document.createElement("input");
   
    quantity.value = product.qty;
    quantity.className = "cart-quantity-input"
    quantityCol.appendChild(quantity);


    //add remove button
    let btn = document.createElement("button");
    btn.className = "btn btn-danger";
    btn.textContent = "Remove";
    btn.setAttribute("data-id", product.id);
    btn.addEventListener("click", () => {
      CART.remove(product.id);location.reload();
    });
     //make this a removeItem function
    quantityCol.appendChild(btn);
    row.appendChild(quantityCol);

    //add row to the section
    productSection.appendChild(row);
  });
}

function addUserName() {
  const userName = sessionStorage.fname + ' ' + sessionStorage.lname;
  if (userName !== undefined) {
    document.getElementById("message").innerHTML =
      userName;
  }
  console.log('BESKED!')
}

function store() {
  // get first name
  let inputFname = document.getElementById("fname");
  // save first name
  sessionStorage.setItem("fname", inputFname.value);
  // get last name
  let inputLname = document.getElementById("lname");
  // save last name
  sessionStorage.setItem("lname", inputLname.value);
}

function getUserName() {
  return
}