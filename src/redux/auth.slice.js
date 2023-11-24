import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  accessToken: '',
  user: {}
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    addAuth(state, action) {
      // console.log({ action });
      return { ...state, ...action.payload };
    },
    resetAuth(state, action) {
      return initialState;
    }
  }
});

export const { addAuth, resetAuth } = authSlice.actions;

export default authSlice.reducer;

// const [auth, setAuth] = useState({});
