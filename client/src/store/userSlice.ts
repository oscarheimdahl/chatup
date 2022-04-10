import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import { host } from '../../config/vars';

export const login = createAsyncThunk(
  'users/login',
  async (user: { username: string; password: string }): Promise<string> => {
    const res = await axios.post(host + 'users/login', {
      username: user.username,
      password: user.password,
    });
    const token = res.data;
    return token;
  }
);

export const register = createAsyncThunk('users/register', async (user: { username: string; password: string }) => {
  await axios.post(host + 'users/register', {
    username: user.username,
    password: user.password,
  });
});

export const userSlice = createSlice({
  name: 'user',
  initialState: {
    loggedIn: false,
    token: '',
  },
  reducers: {
    // setLoggedIn: (state, action: PayloadAction<boolean>) => {
    //   console.log(action.payload);
    //   state.loggedIn = action.payload;
    // },
  },
  extraReducers: (builder) => {
    builder.addCase(login.fulfilled, (state, action) => {
      state.token = action.payload;
      state.loggedIn = true;
    });
    builder.addCase(register.fulfilled, (state, action) => {
      console.log('we have registered');
    });
  },
});

// Action creators are generated for each case reducer function
export const {} = userSlice.actions;

const userReducer = userSlice.reducer;

export default userReducer;
