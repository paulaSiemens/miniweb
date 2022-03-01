document.addEventListener("DOMContentLoaded", ()=>{
  CART.init()
  console.log("DOM loaded");
  
  document.getElementById("cart").addEventListener("click", addToStorage);

});

const CART = {
    KEY: "testKey",
    contents: [], 
    idCounter: 10,
    init() {
      //check localStorage and initialize the contents of CART.contents
     
      let _contents = localStorage.getItem(CART.KEY);
      let idIncrment = localStorage.getItem("id");
      if (!idIncrment) localStorage.setItem("id",0); 
      if(_contents) { 
        CART.contents = JSON.parse(_contents); 
      } else {
        // dummy test data
        CART.contents = [];
        CART.sync();
      }
    },
  
    addProduct(image, title, quantity, price) {
      let curId = Number.parseInt(localStorage.getItem("id"));
      localStorage.setItem("id",curId+1)
  
      let obj = { id: curId, image: image, title: title, qty: quantity, itemPrice: price };
      this.contents.push(obj);
    },
  
    async sync(){
      let _cart = JSON.stringify(CART.contents);
      await localStorage.setItem(CART.KEY, _cart);
    },
  
    find (id) {
      //find an item in the cart by its id
      let match = CART.contents.filter(item=>{
        if(item.id == id)
          return true;
      });
      if(match && match[0])
        return match[0];
    },
    
    add(id) {
      //add new item to cart
      // check it's not already in cart
      if(CART.find(id)){
        CART.increase(id,1);
      } else{
        let arr = PRODUCTS.filter(products=>{
          if(products.id == id){
            return true;
          }
        });
        if(arr && arr[0]){
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
    
    increase(id, qty=1){
      // increase item qty of item in cart
      CART.contents = CART.contents.map(item=>{
        if(item.id === id)
          item.qty = item.qty + qty;
        return item;
      });
    },
    
    reduce(id, qty=1){
      // increase item qty of item in cart
      CART.contents = CART.contents.map(item=>{
        if(item.id === id)
          item.qty = item.qty - qty;
        return item;
      });
      CART.contents.forEach(async, item=>{
        if(item.id === id && item.qty === 0)
           CART.remove(id);
      });
      CART.sync()
    },
    
    remove(id) {
      //remove item entirely from CART.contens based on its id
      CART.contents = CART.contents.filter(item => {
        console.log("Remove in product was pressed")
        return (item.id == id) ? true : false; 
        
        // if (item.id !== id) {
        //   // console.log(`Compare was: ${item.id !== id}´)
        //   return false;}
      });
      //update localStorage
      CART.sync()
    }, 
    empty(){
      //empty cart
      CART.contents = [];
      //update localStorage
      CART.sync()
    }, 
    sort(field="title"){
      //sort by field - title, price, etc
      //return sorted shallow copy of the CART.contents array
      let sorted = CART.contents.sort((a, b)=>{
        if(a[field] > b[field]) {
          return 1;
        } else if(a[field] < a[field]){
          return -1;
        } else {
          return 0;
        }
      });
      return sorted;
      // no impact on localStorage
    }
  };
  
function addToStorage(){
    console.log("Adding to storage")
    let image = document.getElementById("img").getAttribute("src")
    let itemName = document.getElementById("itemName").innerText
    let itemPrice = document.getElementById("itemPrice").innerText.substr(4)
    let quantity = document.getElementById("itemQty").value
    CART.addProduct(image, itemName, quantity, itemPrice)
    CART.sync()
    console.log("Item added to localStorage")
};
