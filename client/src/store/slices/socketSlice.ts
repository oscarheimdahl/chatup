import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { host } from '@src/config/vars';
import { io, Socket } from 'socket.io-client';
import { SocketInitialState } from '../types';

// export const connectSocket = createAsyncThunk('connect socket', async (token: string) => {
//   const socket = io(host, { auth: { token } });
//   return socket;
// });

const initialState: SocketInitialState = {
  socket: null,
};

export const socketSlice = createSlice({
  name: 'user',
  initialState: initialState,
  reducers: {
    setSocket: (state, action) => {
      state.socket = action.payload;
    },
  },
  extraReducers: (builder) => {
    // builder.addCase(connectSocket.fulfilled, (state, action) => {
    //   state.socket = action.payload;
    // });
  },
});

// Action creators are generated for each case reducer function
export const { setSocket } = socketSlice.actions;

const socketReducer = socketSlice.reducer;

export default socketReducer;
