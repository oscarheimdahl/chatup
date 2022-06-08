// import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
// import { host } from '@src/config/vars';
// import { io, Socket } from 'socket.io-client';

// export const connectSocket = createAsyncThunk('connect socket', async (token: string) => {
//   const socket = io(host, { auth: { token } });
//   return socket;
// });

// interface SocketState {
//   socket: Socket | null;
// }

// const initialState: SocketState = {
//   socket: null,
// };

// export const socketSlice = createSlice({
//   name: 'user',
//   initialState: initialState,
//   reducers: {
//     connectSocket: (state, action: PayloadAction<{ socket: Socket; token: string }>) => {
//       const socket = io(host, { auth: { token: action.payload } });
//       if (!socket) return;
//       state.socket = action.payload.socket;
//     },
//   },
//   extraReducers: (builder) => {
//     // builder.addCase(connectSocket.fulfilled, (state, action) => {
//     //   state.socket = action.payload;
//     // });
//   },
// });

// // Action creators are generated for each case reducer function
// export const {} = socketSlice.actions;

// const socketReducer = socketSlice.reducer;

// export default socketReducer;
