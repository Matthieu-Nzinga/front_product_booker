import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  API_URL,
  GET_CATEGORIES,
  GET_COMMANDS,
  GET_SONDAGE,
  HIDE_PRODUCT,
  POST_COMMANDS,
  POST_PRODUCTS,
  POST_REPONSE,
  POST_SONDAGE,
  PRODUCT_SALE,
  PRODUCTS,
  PUT_COMMANDS,
  PUT_PRODUCT,
  SHOW_PRODUCT,
  UPDATE_COMMAND,
} from "../../config";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { CgLayoutGrid } from "react-icons/cg";

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
  async ( thunkApi) => {
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

export const getAllCategories = createAsyncThunk(
  "get/getAllcategories",
  async () => {
    try {
      const response = await api.get(GET_CATEGORIES);

      return response.data;
    } catch (error) {}
  }
);

export const postCommand = createAsyncThunk(
  "post/postCommand",
  async (data, thunkApi) => {
    try {
     const response = await api.post(POST_COMMANDS, data);
      return response.data;
    } catch (error) {
      console.log(error)
      return thunkApi.rejectWithValue(error);
    }
  }
);
export const getAllCommands = createAsyncThunk(
  "get/getAllCommands",
  async (thunkApi) => {
    try {
      const response = await api.get(GET_COMMANDS);
      return response.data.commandes;
    } catch (error) {
      return thunkApi.rejectWithValue(error);
    }
  }
);

export const putCommand = createAsyncThunk(
  "put/putCommand",
  async ({ id, status }, { thunkApi }) => {
    try {
      const response = await api.put(PUT_COMMANDS + id, { status });
      return response.data.commande;
    } catch (error) {
      return thunkApi.rejectWithValue(error);
    }
  }
);
export const hideProduct = createAsyncThunk(
  "put/hideProduct",
  async (idProduit, thunkApi) => {
    try {
      const response = await api.put(HIDE_PRODUCT + idProduit);
      return response.data.produit;
    } catch (error) {
      return thunkApi.rejectWithValue(error);
    }
  }
);
export const updateProduct = createAsyncThunk(
  "put/updateProduct",
  async ({formData, productId}, { thunkApi }) => {
    try {
       const response = await api.put(PUT_PRODUCT + productId, formData)
       return response.data.produit;
    } catch (error) {
      return thunkApi.rejectWithValue(error);
    }
  }
);
export const activateProduct = createAsyncThunk(
  "put/showProduct",
  async (idProduit, thunkApi) => {
    try {
      const response = await api.put(SHOW_PRODUCT + idProduit);
      return response.data.produit;
    } catch (error) {
      return thunkApi.rejectWithValue(error);
    }
  }
);
export const updateCommand = createAsyncThunk(
  "put/updateCommand",
  async(updatedData,thunkApi) => {
    try {
      const response = await api.put(UPDATE_COMMAND + updatedData.id, updatedData);
      return response.data.commande;
    } catch (error) {
      return thunkApi.rejectWithValue(error);
    }
  }
);
export const postReponse = createAsyncThunk(
  "post/postReponse",
  async (data, thunkApi) => {
    try {
      const response = await api.post(POST_REPONSE, data);
    return response.data.reponseSondage;
    } catch (error) {
      console.log(error)
      return thunkApi.rejectWithValue(error);
    }
  }
); 
export const postSondage = createAsyncThunk(
  "post/postSondage",
  async (data, thunkApi) => {
   
    try {
      const response = await api.post(POST_SONDAGE, data);
      return response.data.sondage;
    } catch (error) {
      return thunkApi.rejectWithValue(error);
    }
  }
); 
export const getAllSondages = createAsyncThunk(
  "get/getAllSondages",
  async ( thunkApi) => {
    try {
     
      const response = await api.get(GET_SONDAGE);
     return response.data;
    } catch (error) {
      return thunkApi.rejectWithValue(error);
    }
  }
);
export const ProductSale = createAsyncThunk(
  "put/ProductSale",
  async (idProduit, thunkApi) => {
    try {
      const response = await api.put(PRODUCT_SALE + idProduit);
      return response.data.produit;
    } catch (error) {
      return thunkApi.rejectWithValue(error);
    }
  }
);
const initialState = {
  product: [],
  categories: [],
  commands: [],
  sondages : [],
  error: null,
};

const products = createSlice({
  name: "products",
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(getAllProduits.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getAllProduits.fulfilled, (state, action) => {
        state.product = action.payload;
        state.status = "succeeded";
      })
      .addCase(getAllProduits.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(postProduit.pending, (state) => {
        state.status = "loading";
      })
      .addCase(postProduit.fulfilled, (state, action) => {
        state.product.push(action.payload);
        state.error = null;
      })
      .addCase(postProduit.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(getAllCategories.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getAllCategories.fulfilled, (state, action) => {
        state.categories = action.payload;
        state.error = null;
      })
      .addCase(getAllCategories.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(postCommand.pending, (state) => {
        state.status = "loading";
      })
      .addCase(postCommand.fulfilled, (state, action) => {
        state.commands.push(action.payload);
        state.error = null;
      })
      .addCase(postCommand.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(getAllCommands.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getAllCommands.fulfilled, (state, action) => {
        state.commands = action.payload;
        state.error = null;
      })
      .addCase(getAllCommands.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(putCommand.pending, (state) => {
        state.status = "loading";
      })
      .addCase(putCommand.fulfilled, (state, action) => {
        const index = state.commands.findIndex(
          (order) => order.id === action.payload.id
        );
        if (index !== -1) {
          state.commands[index].status = action.payload.status;
        }
      })
      .addCase(putCommand.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(hideProduct.pending, (state) => {
        state.status = "loading";
      })
      .addCase(hideProduct.fulfilled, (state, action) => {
        const index = state.product.findIndex(
          (order) => order.id === action.payload.id
        );
        if (index !== -1) {
          state.product[index].status = action.payload.statut;
        }
      })
      .addCase(hideProduct.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(activateProduct.pending, (state) => {
        state.status = "loading";
      })
      .addCase(activateProduct.fulfilled, (state, action) => {
        const index = state.product.findIndex(
          (order) => order.id === action.payload.id
        );
        if (index !== -1) {
          state.product[index].status = action.payload.statut;
        }
      })
      .addCase(activateProduct.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(updateProduct.pending, (state) => {
        state.status = "loading";
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        const index = state.product.findIndex(
          (order) => order.id === action.payload.id
        );
        if (index !== -1) {
          state.product[index] = action.payload;
        }
      })
      .addCase(updateProduct.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(updateCommand.pending, (state) => {
        state.status = "loading";
      })
      .addCase(updateCommand.fulfilled, (state, action) => {
        state.status = "success";
      })
      .addCase(updateCommand.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(postSondage.pending, (state) => {
        state.status = "loading";
      })
      .addCase(postSondage.fulfilled, (state, action) => {
        state.sondages.push(action.payload);
        state.error = null;
      })
      .addCase(postSondage.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(getAllSondages.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getAllSondages.fulfilled, (state, action) => {
        state.sondages = action.payload;
        state.status = "succeeded";
      })
      .addCase(getAllSondages.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(postReponse.pending, (state) => {
        state.status = "loading";
      })
      .addCase(postReponse.fulfilled, (state, action) => {
        
        state.error = null;
      })
      .addCase(postReponse.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(ProductSale.pending, (state) => {
        state.status = "loading";
      })
      .addCase(ProductSale.fulfilled, (state, action) => {
        const index = state.product.findIndex(
          (order) => order.id === action.payload.id
        );
        if (index !== -1) {
          state.product[index].enSolde = action.payload.enSolde;
        }
      })
      .addCase(ProductSale.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
    
  },
});

export default products.reducer;
