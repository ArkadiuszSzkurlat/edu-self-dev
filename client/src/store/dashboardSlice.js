import { createSlice } from '@reduxjs/toolkit';

export const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState: {
    username: '',
    peerId: '',
    socketID: '',
    activeUsers: [],
    groupCallRooms: [],
    groupCallRoomId: '',
  },
  reducers: {
    setUsername: (state, action) => {
      state.username = action.payload;
    },
    setSocketID: (state, action) => {
      state.socketID = action.payload;
    },
    setActiveUsers: (state, action) => {
      state.activeUsers = action.payload;
    },
    setGroupCalls: (state, action) => {
      state.groupCallRooms = action.payload;
    },
    setGroupCallRoomId: (state, action) => {
      state.groupCallRoomId = action.payload;
    },
    clearGroupCallRoomId: (state) => {
      state.groupCallRoomId = '';
    },
    setPeerId: (state, action) => {
      state.peerId = action.payload;
    },
  },
});

export const {
  setUsername,
  setActiveUsers,
  setGroupCalls,
  setGroupCallRoomId,
  clearGroupCallRoomId,
  setSocketID,
  setPeerId,
} = dashboardSlice.actions;

export default dashboardSlice.reducer;
