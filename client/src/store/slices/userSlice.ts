import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { host } from '@src/config/vars';
import axios, { AxiosError } from 'axios';
import { UserInitialState } from '../types';

export const loggedIn = createAsyncThunk('user/loggedIn', async (token: string) => {
  const res = await axios.get(host + 'user/loggedin', { headers: { Authorization: `Bearer ${token}` } });
  const username = res.data.username;
  const color = res.data.color;
  return { token, username, color };
});

export const login = createAsyncThunk(
  'user/login',
  async (user: { username: string; password: string }, { rejectWithValue }) => {
    try {
      const res = await axios.post(host + 'user/login', {
        username: user.username,
        password: user.password,
      });
      const token: string = res.data;
      return { token, username: user.username };
    } catch (e) {
      const axiosError = e as AxiosError;
      return rejectWithValue(axiosError?.response?.status);
    }
  }
);

export const register = createAsyncThunk(
  'user/register',
  async (user: { username: string; password: string }, { rejectWithValue }) => {
    try {
      await axios.post(host + 'user/register', {
        username: user.username,
        password: user.password,
      });
    } catch (e) {
      const axiosError = e as AxiosError;
      return rejectWithValue(axiosError?.response?.status);
    }
  }
);

const initialState: UserInitialState = {
  loggedIn: null,
  token: '',
  room: '',
  username: '',
  color: 0,
  loginError: {
    forbidden: false,
    serverUnreachable: false,
  },
  registerInfo: {
    usernameTaken: false,
    success: false,
  },
};

export const userSlice = createSlice({
  name: 'user',
  initialState: initialState,
  reducers: {
    resetLoginError: (state) => {
      state.loginError = {
        ...initialState.loginError,
      };
    },
    resetRegisterError: (state) => {
      state.registerInfo = {
        ...initialState.registerInfo,
      };
    },
    logout: (state) => {
      state.loggedIn = false;
      state.token = '';
      window.localStorage.removeItem('token');
    },
    setRoom: (state, action) => {
      state.room = action.payload;
    },
    setColor: (state, action) => {
      state.color = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(login.fulfilled, (state, action) => {
      state.token = action.payload.token;
      state.username = action.payload.username;
      window.localStorage.setItem('token', state.token);
      state.loggedIn = true;
    });
    builder.addCase(login.rejected, (state, action) => {
      switch (action.payload) {
        case 403:
          state.loginError.forbidden = true;
          break;
        default:
          state.loginError.serverUnreachable = true;
      }
    });
    builder.addCase(register.fulfilled, (state, action) => {
      state.registerInfo.success = true;
    });
    builder.addCase(register.rejected, (state, action) => {
      switch (action.payload) {
        case 409:
          state.registerInfo.usernameTaken = true;
          break;
        default:
          state.loginError.serverUnreachable = true;
      }
    });
    builder.addCase(loggedIn.fulfilled, (state, action) => {
      state.color = action.payload.color;
      state.loggedIn = true;
      state.username = action.payload.username;
      state.token = action.payload.token;
    });
    builder.addCase(loggedIn.rejected, (state, action) => {
      state.loggedIn = false;
    });
  },
});

// Action creators are generated for each case reducer function
export const { resetLoginError, resetRegisterError, logout, setRoom, setColor } = userSlice.actions;

const userReducer = userSlice.reducer;

export default userReducer;
