import { createSlice, nanoid } from '@reduxjs/toolkit';

const initialState = JSON.parse(window?.localStorage?.getItem('cart')) || [];
// console.log({ initialState });

export const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addProd: {
      reducer(state, action) {
        const { cartId, item: prod } = action.payload;

        const cartIndex = state.findIndex(cItem => cItem.id === prod._id);

        // if item already in cart, inc quantity instead
        if (cartIndex !== -1) {
          return [
            ...state.slice(0, cartIndex),
            { ...state[cartIndex], quantity: state[cartIndex].quantity + 1 },
            ...state.slice(cartIndex + 1)
          ];
        }

        const product = [
          ...state,
          {
            cartId: prod.cartId,
            id: prod._id,
            product: prod,
            quantity: 1,
            shop: prod.shop._id
          }
        ];

        return product;
      },
      prepare(item) {
        // pre fetch?
        return {
          payload: {
            cartId: nanoid(),
            item // capture here?
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

export const { addProd, updateCart, removeProd, emptyCart } = cartSlice.actions;

export default cartSlice.reducer;
