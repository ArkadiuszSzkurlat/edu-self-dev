import socketClient from 'socket.io-client';
import store from '../../store/store';
import * as dashboardActions from '../../store/dashboardSlice';
import { setGroupCallIncomingStreams } from '../../store/callSlice';
import * as webRTCHandler from '../webRTC/webRTCHandler';
import * as webRTCGroupCallHandler from '../webRTC/webRTCGroupCallHandler';

const SERVER = 'https://edu-self.herokuapp.com';

const broadcastEventTypes = {
  ACTIVE_USERS: 'ACTIVE_USERS',
  GROUP_CALL_ROOMS: 'GROUP_CALL_ROOMS',
  DELETE_PEER: 'DELETE_PEER',
};

let socket;

export const connectWithWebSocket = () => {
  // Create socket connection
  socket = socketClient(SERVER);

  socket.on('connection', () => {
    // Set socketID in local store(redux)
    console.log('socket conected');
    store.dispatch(dashboardActions.setSocketID(socket.id));
  });

  socket.on('list-of-users', (data) => {
    store.dispatch(dashboardActions.setActiveUsers(data));
  });

  socket.on('disconnect-hang-up', () => {
    webRTCHandler.hangUp();
  });

  socket.on('broadcast', (data) => {
    handleBroadcastEvents(data);
  });

  // Offert for call
  socket.on('pre-offer', (data) => {
    webRTCHandler.handlePreOffer(data);
  });

  socket.on('pre-offer-answer', (data) => {
    console.log('pre-offer-answer');
    webRTCHandler.handlePreOfferAnswer(data);
  });

  socket.on('peer-signal', (data) => {
    webRTCHandler.handlePeerSignal(data);
  });

  socket.on('user-hanged-up', (data) => {
    console.log(data);
    webRTCHandler.resetCallDataAfterHangUp();
  });

  socket.on('new-chat-message', (data) => {
    webRTCHandler.handleNewChatMessage(data);
  });
  // listeners related with group calls

  socket.on('group-call-join-request', (data) => {
    webRTCGroupCallHandler.connectToNewUser(data);
  });

  socket.on('download-messages', (data) => {
    webRTCGroupCallHandler.downloadMessages(data);
  });

  socket.on('group-call-user-left', (data) => {
    console.log(data);
    webRTCGroupCallHandler.removeInactiveStream(data);
    webRTCGroupCallHandler.removeInactiveUser(data);
  });

  socket.on('add-group-chat-message', (data) => {
    webRTCGroupCallHandler.addNewGroupChatMessage(data);
  });
};

export const registerNewUser = (username) => {
  const peerId = store.getState().dashboard.peerId;
  const socketID = store.getState().dashboard.socketID;
  socket.emit('register-new-user', {
    username: username,
    peerId: peerId,
    socketID: socketID,
  });
};

// emitting events to server related with direct call

export const userLogout = (data) => {
  socket.emit('user-logout');
};
export const sendPreOffer = (data) => {
  socket.emit('pre-offer', data);
};

export const sendPreOfferAnswer = (data) => {
  socket.emit('pre-offer-answer', data);
};

export const sendPeerSignal = (data) => {
  socket.emit('peer-signal', { ...data, from: socket.id });
};
export const sendUserHangedUp = (data) => {
  socket.emit('user-hanged-up', data);
};

export const addNewChatMessageSocket = (data) => {
  socket.emit('new-chat-message', data);
};
// emitting events related with group calls

export const registerGroupCall = (data) => {
  socket.emit('group-call-register', data);
};

//Tutaj trzeba by było ustawić pobór wiadomości z serwera
export const userWantsToJoinGroupCall = (data) => {
  socket.emit('group-call-join-request', data);
};

export const userLeftGroupCall = (data) => {
  //user quit groupcall, data contains all username,roomid etc.
  console.log(data);
  socket.emit('group-call-user-left', data);
};

export const groupCallClosedByHost = (data) => {
  socket.emit('group-call-closed-by-host', data);
};

export const addGroupChatMessage = (data) => {
  socket.emit('add-group-chat-message', data);
};

const handleBroadcastEvents = (data) => {
  // console.log(data);
  switch (data.event) {
    // Change redux active users
    // Z active users trzeba wyciągnąć ten który wyszedł
    case broadcastEventTypes.ACTIVE_USERS:
      const activeUsers = data.activeUsers.filter(
        (activeUser) => activeUser.socketID !== socket.id
      );

      const groupCallStreams = store.getState().call.groupCallStreams;

      const activeGroupCallStreams = groupCallStreams.filter(
        (groupCallStream) => groupCallStream.id !== data.peerId
      );

      store.dispatch(dashboardActions.setActiveUsers(activeUsers));

      store.dispatch(setGroupCallIncomingStreams(activeGroupCallStreams));
      break;
    //
    case broadcastEventTypes.GROUP_CALL_ROOMS:
      const groupCallRooms = data.groupCallRooms.filter(
        (room) => room.socketID !== socket.id
      );
      const allGroupCallRooms = data.groupCallRooms;

      const activeGroupCallRoomId =
        webRTCGroupCallHandler.checkActiveGroupCall();

      // taking room for roomId
      const activeGroupCallRoom = allGroupCallRooms.find(
        (room) => room.socketID === socket.id
      );

      if (activeGroupCallRoomId) {
        const room = groupCallRooms.find(
          (room) => room.roomId === activeGroupCallRoomId
        );
        if (!room) {
          webRTCGroupCallHandler.clearGroupData();
        }
      }
      if (activeGroupCallRoom) {
        store.dispatch(
          dashboardActions.setGroupCallRoomId(activeGroupCallRoom.roomId)
        );
      }
      store.dispatch(dashboardActions.setGroupCalls(allGroupCallRooms));
      break;
    default:
      break;
  }
};
