
import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import productsReducer from '../features/products/products';
import usersReducer from '../features/users/userSlice';
import panierReducer from "../features/panier/panierSlice";



export const store = configureStore({
  reducer: {
    auth: authReducer,
    products: productsReducer,
    users: usersReducer,
    panier: panierReducer,
  },
});
