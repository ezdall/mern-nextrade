import { createSlice } from '@reduxjs/toolkit';

const initialState = {};

// JSON.parse(window?.sessionStorage?.getItem('cart')) ||

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    addAuth(state, action) {
      // console.log({payload: action})
      return { ...state, ...action.payload };
    },
    resetAuth() {
      return initialState;
    }
  }
  // selectors: {}
});

export const { addAuth, resetAuth } = authSlice.actions;

export default authSlice.reducer;
