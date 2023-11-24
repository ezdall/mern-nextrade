import { createSlice, nanoid } from '@reduxjs/toolkit';

const initialState = JSON.parse(window.localStorage.getItem('cart')) || [];

// JSON.parse(window.localStorage.getItem('cart')) ||

export const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addProd: {
      reducer(state, action) {
        const { cartId, item: prod } = action.payload;

        console.log({ prod });

        const cartIndex = state.findIndex(cItem => cItem.id === prod._id);

        if (cartIndex !== -1) {
          return [
            ...state.slice(0, cartIndex),
            { ...state[cartIndex], quantity: state[cartIndex].quantity + 1 },
            ...state.slice(cartIndex + 1)
          ];
        }

        return [
          ...state,
          {
            cartId: prod.cartId,
            id: prod._id,
            product: prod,
            quantity: 1,
            shop: prod.shop._id
          }
        ];
      },
      prepare(item) {
        return {
          payload: {
            cartId: nanoid(),
            item
          }
        };
      }
    },
    updateCart(state, action) {
      const { prodId, quantity } = action.payload;

      return state.map(cItem => {
        if (cItem.id === prodId) {
          return { ...cItem, quantity };
        }
        return cItem;
      });
    },
    removeProd(state, action) {
      const { prodId } = action.payload;

      return state.filter(cItem => cItem.id !== prodId);
    },
    emptyCart() {
      return [];
    }
  }
});

// const getTotal = () => {
//   return state.reduce((a, b) => {
//     return a + b.quantity * b.product.price;
//   }, 0);
// };

export const { addProd, updateCart, removeProd, emptyCart } = cartSlice.actions;

export const selectCartItems = state => state.cart3;

export default cartSlice.reducer;
