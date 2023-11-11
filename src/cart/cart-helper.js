const Cart = {
  itemTotal() {
    if (typeof window !== "undefined") {
      if (localStorage.getItem('cart')) {
        return JSON.parse(localStorage.getItem('cart')).length
      }
    }
    return 0
  },
  updateCart(prodId, quantity) {
    console.log({prodId,quantity})
    let cart = [];
    if (typeof window !== 'undefined') {
      if (localStorage.getItem('cart')) {
        cart = JSON.parse(localStorage.getItem('cart'));
      }

     const updCart = cart.map(c => {
      console.log({c})
      if(c._id === prodId){
        return {...c, quantity}
      }

      return c;
     })
     // console.log({updCart})
      // cart[prodId].quantity = quantity;

     
      localStorage.setItem('cart', JSON.stringify(updCart));
    }
  },
  getCart() {
    if (typeof window !== 'undefined') {
      if (localStorage.getItem('cart')) {
        return JSON.parse(localStorage.getItem('cart'));
      }
    }
    return [];
  },
   addItem(item, cb) {
    let cart = [];
    if (typeof window !== 'undefined') {
      if (localStorage.getItem('cart')) {
        cart = JSON.parse(localStorage.getItem('cart'));
      }

      const cartIndex = cart.findIndex(c=> c._id === item._id) 

      // console.log({cartIndex})
      // console.log(cart[cartIndex])

      // check if item already in cart
     if(cartIndex !== -1){
        cart = [ ...cart.slice(0, cartIndex),
        {...cart[cartIndex], quantity: cart[cartIndex].quantity+1 },
        ...cart.slice(cartIndex+1)
        ]
     } else{
        cart = [...cart, {
            _id: item._id,
            product: item,
            quantity: 1,
            shop: item.shop._id
         }] 
     }

    
      //  cart.push({
      //       _id: item._id,
      //       product: item,
      //       quantity: 1,
      //       shop: item.shop._id
      //     });
    

      localStorage.setItem('cart', JSON.stringify(cart));
      cb();
    }
  },  
  removeItem(itemIndex, prodId) {
    let cart = [];
    if (typeof window !== 'undefined') {
      if (localStorage.getItem('cart')) {
        cart = JSON.parse(localStorage.getItem('cart'));
      }
      // cart.splice(itemIndex, 1);

      cart = cart.filter(c => c._id !== prodId)

      localStorage.setItem('cart', JSON.stringify(cart));
    }
    return cart;
  },
 
  emptyCart(cb) {
    if (typeof window !== "undefined") {
      localStorage.removeItem('cart')
      cb()
    }
  }
};

export default Cart;
