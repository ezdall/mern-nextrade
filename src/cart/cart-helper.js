//

export const saveCartItems = async ({ cart, userId, axiosPrivate2 }) => {
  try {
    const response = await axiosPrivate2.post(`/api/orders/cart/${userId}`, {
      cart
    });

    return response.data;
  } catch (error) {
    console.log({ error });
    return error;
  }
};

export const fetchCart = async ({ cartId, signal, axiosPrivate2 }) => {
  try {
    const response = await axiosPrivate2.get(`/api/orders/cart/${cartId}`, {
      signal
    });

    console.log({ response });

    return response.data;
  } catch (error) {
    console.log({ error });
    return error;
  }
};

const Cart = {
  itemTotal() {
    if (typeof window !== 'undefined') {
      if (localStorage.getItem('cart')) {
        return JSON.parse(localStorage.getItem('cart')).length;
      }
    }
    return 0;
  },
  updateCart(prodId, quantity) {
    // console.log({ prodId, quantity });
    let cart = [];
    if (typeof window !== 'undefined') {
      if (localStorage.getItem('cart')) {
        cart = JSON.parse(localStorage.getItem('cart'));
      }

      const updCart = cart.map(c => {
        // console.log({ c });
        if (c.id === prodId) {
          return { ...c, quantity };
        }
        return c;
      });

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
      const cartIndex = cart.findIndex(c => c.id === item._id);

      console.log({ cartIndex });
      // check if item already in cart
      if (cartIndex !== -1) {
        cart = [
          ...cart.slice(0, cartIndex),
          { ...cart[cartIndex], quantity: cart[cartIndex].quantity + 1 },
          ...cart.slice(cartIndex + 1)
        ];
      } else {
        cart = [
          ...cart,
          {
            id: item._id,
            product: item,
            quantity: 1,
            shop: item.shop._id
          }
        ];
      }

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

      cart = cart.filter(c => c.id !== prodId);

      localStorage.setItem('cart', JSON.stringify(cart));
    }
    return cart;
  },

  emptyCart(cb) {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('cart');
      cb();
    }
  }
};

export default Cart;
