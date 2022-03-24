import { createSlice } from '@reduxjs/toolkit';
import { callStates } from './callStates';

export const callSlice = createSlice({
  name: 'call',
  initialState: {
    localStream: null,
    callState: callStates.CALL_AVAILABLE,
    callingDialogVisible: false,
    callerUsername: '',
    participantSocketID: '',
    callRejected: {
      rejected: false,
      reason: '',
    },
    userHangedUp: false,
    remoteStream: null,
    localCameraEnabled: true,
    localMicrophoneEnabled: true,
    screenSharingActive: false,
    screenSharingScreen: null,
    groupCallActive: false,
    groupCallUsers: [],
    groupCallStreams: [],
    message: {
      received: false,
      content: '',
    },
    chatMessages: [],
    groupChatMessages: [],
  },
  reducers: {
    setLocalStream: (state, action) => {
      state.localStream = action.payload;
    },
    setScreenSharingScreen: (state, action) => {
      state.screenSharingScreen = action.payload;
    },
    setCallState: (state, action) => {
      state.callState = action.payload;
    },
    setCallingDialogVisible: (state, action) => {
      state.callingDialogVisible = action.payload;
    },
    setCallerUsername: (state, action) => {
      state.callerUsername = action.payload;
    },
    setParticipantSocketID: (state, action) => {
      state.participantSocketID = action.payload;
    },
    setUserHangedUp: (state, action) => {
      state.userHangedUp = action.payload;
    },
    // Tu nie wiem czy dobrze
    setCallRejected: (state, action) => {
      state.callRejected = action.payload;
    },
    setRemoteStream: (state, action) => {
      state.remoteStream = action.payload;
    },
    setLocalMicrophoneEnabled: (state, action) => {
      state.localMicrophoneEnabled = action.payload;
    },
    setLocalCameraEnabled: (state, action) => {
      state.localCameraEnabled = action.payload;
    },
    setScreenSharingActive: (state, action) => {
      state.screenSharingActive = action.payload;
    },
    addChatMessage: (state, action) => {
      state.chatMessages.push(action.payload);
    },
    resetCallDataState: (state) => {
      state.localStream = null;
      state.remoteStream = null;
      state.screenSharingActive = false;
      state.callerUsername = '';
      state.localMicrophoneEnabled = true;
      state.localCameraEnabled = true;
      state.callingDialogVisible = false;
      state.chatMessages = [];
      state.participantSocketID = '';
      state.callRejected = {
        rejected: false,
        reason: '',
      };
    },
    setGroupCallActive: (state, action) => {
      state.groupCallActive = action.payload;
    },
    setGroupCallUsers: (state, action) => {
      state.groupCallUsers = action.payload;
    },
    addGroupCallUser: (state, action) => {
      state.groupCallUsers.push(action.payload);
    },
    setGroupCallIncomingStreams: (state, action) => {
      state.groupCallStreams = action.payload;
    },
    clearGroupCallData: (state) => {
      state.localStream = null;
      state.groupCallActive = false;
      state.groupCallStreams = [];
      state.callState = callStates.CALL_AVAILABLE;
      state.localMicrophoneEnabled = true;
      state.localCameraEnabled = true;
      state.groupChatMessages = [];
      state.groupCallUsers = [];
    },
    setMessage: (state, action) => {
      state.message = action.payload;
    },
    addGroupChatMessage: (state, action) => {
      state.groupChatMessages.push(action.payload);
    },
    downloadGroupChatMessages: (state, action) => {
      state.groupChatMessages = action.payload;
    },
  },
});

export const {
  setLocalStream,
  setCallState,
  setCallingDialogVisible,
  setCallerUsername,
  setCallRejected,
  setRemoteStream,
  setLocalMicrophoneEnabled,
  setLocalCameraEnabled,
  setScreenSharingActive,
  resetCallDataState,
  setGroupCallActive,
  setGroupCallIncomingStreams,
  clearGroupCallData,
  setMessage,
  setUserHangedUp,
  setScreenSharingScreen,
  addGroupCallUser,
  setGroupCallUsers,
  addChatMessage,
  addGroupChatMessage,
  downloadGroupChatMessages,
  setParticipantSocketID,
} = callSlice.actions;

export default callSlice.reducer;
