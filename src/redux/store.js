import { configureStore } from '@reduxjs/toolkit';

import logger from 'redux-logger';

// import cartReducer from './cart.reducers';
import cartReducer from './cart.slice';
import authReducer from './auth.slice';

export const store = configureStore({
  reducer: {
    cart3: cartReducer,
    auth3: authReducer
  },
  middleware: getDefaultMiddleware => getDefaultMiddleware().concat(logger)
});
