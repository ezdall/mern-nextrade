import { createSlice } from '@reduxjs/toolkit';

const initialState = {};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    addAuth(state, action) {
      return action.payload;
      // return { ...state, ...action.payload };
    },
    resetAuth() {
      return initialState;
    }
  }
  // selectors: {}
});

export const { addAuth, resetAuth } = authSlice.actions;

export default authSlice.reducer;
