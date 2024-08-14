
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import { LOGIN } from '../../config';

export const userLogin = createAsyncThunk(
  'auth/userLogin',
  async (data, thunkApi) => {
  
    try {
      const response = await axios.post(LOGIN, data);
      // Stockez le token dans le localStorage
      localStorage.setItem('token', response.data.token);
      return response.data;
    } catch (error) {
     
      return thunkApi.rejectWithValue(error.response.data);
    }
  }
);

const initialState = {
  user: null,
  token: localStorage.getItem('token') || null,
  status: 'idle',
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setToken: (state, action) => {
      state.token = action.payload;
    },
    removeTokenAction: (state) => {
      state.token = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(userLogin.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(userLogin.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.user = action.payload;
        state.token = action.payload.token; 
      })
      .addCase(userLogin.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  },
});
export const { setToken, removeTokenAction } = authSlice.actions;
export default authSlice.reducer;
