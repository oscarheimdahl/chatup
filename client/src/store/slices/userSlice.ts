import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { host } from '@src/config/vars';
import axios, { AxiosError } from 'axios';
import { UserInitialState } from '../types';

export const loggedIn = createAsyncThunk('users/loggedIn', async (token: string): Promise<string> => {
  await axios.get(host + 'users/loggedin', { headers: { Authorization: `Bearer ${token}` } });
  return token;
});

export const login = createAsyncThunk(
  'users/login',
  async (
    user: { username: string; password: string },
    { rejectWithValue }
  ): Promise<string | ReturnType<typeof rejectWithValue>> => {
    try {
      const res = await axios.post(host + 'users/login', {
        username: user.username,
        password: user.password,
      });
      const token: string = res.data;
      return token;
    } catch (e) {
      const axiosError = e as AxiosError;
      return rejectWithValue(axiosError?.response?.status);
    }
  }
);

export const register = createAsyncThunk('users/register', async (user: { username: string; password: string }) => {
  await axios.post(host + 'users/register', {
    username: user.username,
    password: user.password,
  });
});

const initialState: UserInitialState = {
  loggedIn: null,
  token: '',
  login: {
    forbidden: false,
    serverUnreachable: false,
  },
};

export const userSlice = createSlice({
  name: 'user',
  initialState: initialState,
  reducers: {
    resetLoginInfo: (state) => {
      state.login = {
        ...initialState.login,
      };
    },
    logout: (state) => {
      state.loggedIn = false;
      state.token = '';
      window.localStorage.removeItem('token');
    },
  },
  extraReducers: (builder) => {
    builder.addCase(login.fulfilled, (state, action) => {
      state.token = action.payload;
      window.localStorage.setItem('token', state.token);
      state.loggedIn = true;
    });
    builder.addCase(login.rejected, (state, action) => {
      switch (action.payload) {
        case 403:
          state.login.forbidden = true;
        case 500:
          state.login.serverUnreachable = true;
      }
    });
    builder.addCase(register.fulfilled, (state, action) => {
      console.log('we have registered');
    });
    builder.addCase(loggedIn.fulfilled, (state, action) => {
      state.loggedIn = true;
      state.token = action.payload;
    });
    builder.addCase(loggedIn.rejected, (state, action) => {
      state.loggedIn = false;
    });
  },
});

// Action creators are generated for each case reducer function
export const { resetLoginInfo, logout } = userSlice.actions;

const userReducer = userSlice.reducer;

export default userReducer;
