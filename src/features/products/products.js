import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { API_URL, POST_PRODUCTS, PRODUCTS, } from "../../config";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      const decodedToken = jwtDecode(token);
      const now = Date.now() / 1000;

      if (now > decodedToken.exp) {
        localStorage.removeItem("token");
        window.location.reload();
      } else {
        config.headers["auth-token"] = token;
      }
    }

    return config;
  },
  (error) => Promise.reject(error)
);

export const getAllProduits = createAsyncThunk(
  "get/getAllProduits",
  async () => {
    try {
      const response = await api.get(PRODUCTS);
      return response.data;
    } catch (error) {
      return thunkApi.rejectWithValue(error);
    }
  }
);


export const postProduit = createAsyncThunk(
  "post/postProduit",
  async (data, thunkApi) => {
    try {
      const response = await api.post(POST_PRODUCTS, data);
      return response.data;
    } catch (error) {
    
      return thunkApi.rejectWithValue(error);
    }
  }
);

const initialState = {
  product: [],
  error: null,
};

const products = createSlice({
  name: "products",
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(getAllProduits.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(getAllProduits.fulfilled, (state, action) => {
        state.product = action.payload;
        state.status = 'succeeded';
      })
      .addCase(postProduit.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(postProduit.fulfilled, (state, action) => {
        state.product.push(action.payload);
        state.error = null; 
      })
      .addCase(postProduit.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export default products.reducer;
