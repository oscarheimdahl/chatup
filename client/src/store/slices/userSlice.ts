import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { host } from '@src/config/vars';
import axios, { AxiosError } from 'axios';

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

const initialState = {
  loggedIn: false,
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
  },
  extraReducers: (builder) => {
    builder.addCase(login.fulfilled, (state, action) => {
      console.log('FULFILLED');
      state.token = action.payload;
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
  },
});

// Action creators are generated for each case reducer function
export const { resetLoginInfo } = userSlice.actions;

const userReducer = userSlice.reducer;

export default userReducer;
