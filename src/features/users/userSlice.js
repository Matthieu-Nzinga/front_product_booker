import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { API_URL, POST_USERS, USERS} from "../../config";
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

export const getAllUsers = createAsyncThunk(
  "get/getAllUsers",
  async () => {
    try {
      const response = await api.get(USERS);
      return response.data;
    } catch (error) {
      return thunkApi.rejectWithValue(error);
    }
  }
);


export const postUser = createAsyncThunk(
  "post/postUser",
  async (data, thunkApi) => {
    try {
      const response = await api.post(POST_USERS, data);
      return response.data;
    } catch (error) {
    
      return thunkApi.rejectWithValue(error);
    }
  }
);

export const updateUserStatus = createAsyncThunk(
  "put/updateUser",
  async ({ id, statut }, { thunkApi }) => {
    try {
      const response = await api.put(USERS + "/status/" + id, { statut });
      return response.data.user;
    } catch (error) {
      return thunkApi.rejectWithValue(error);
    }
  }
);
export const updateUser = createAsyncThunk(
  "put/updatedUser",
  async ({ formData }, { thunkApi }) => {
    try {
     const response = await api.put(USERS)
     return response.data.user;
    } catch (error) {
    
      return thunkApi.rejectWithValue(error);
    }
  }
);

const initialState = {
  user: [],
  error: null,
};

const users = createSlice({
  name: "users",
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(getAllUsers.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(getAllUsers.fulfilled, (state, action) => {
        state.user = action.payload;
        state.status = 'succeeded';
      })
      .addCase(postUser.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(postUser.fulfilled, (state, action) => {
        state.user.push(action.payload);
        state.error = null; 
      })
      .addCase(postUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(updateUserStatus.pending, (state) => {
        state.status = "loading";
      })
      .addCase(updateUserStatus.fulfilled, (state, action) => {
        const index = state.user.findIndex(
          (user) => user.id === action.payload.id
        );
        if (index !== -1) {
          state.user[index].statut = action.payload.statut;
        }
      })
      .addCase(updateUserStatus.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(updateUser.pending, (state) => {
        state.status = "loading";
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        const index = state.user.findIndex(
          (user) => user.id === action.payload.id
        )
        if (index !== -1) {
          state.user[index] = action.payload;
        }
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
  },
});

export default users.reducer;
