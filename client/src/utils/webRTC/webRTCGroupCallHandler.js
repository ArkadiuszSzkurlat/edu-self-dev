import * as wss from '../wssConnection/wssConnection';
import store from '../../store/store';
import {
  setCallState,
  setGroupCallIncomingStreams,
  clearGroupCallData,
  addGroupChatMessage,
  setGroupCallActive,
  downloadGroupChatMessages,
  addGroupCallUser,
  setGroupCallUsers,
} from '../../store/callSlice';
import {
  setGroupCallRoomId,
  clearGroupCallRoomId,
  setPeerId,
} from '../../store/dashboardSlice';
import { callStates } from '../../store/callStates';
import Peer from 'peerjs';
import { v4 as uuid } from 'uuid';

let myPeer;
let myPeerId;
let mySocketID;
let groupCallRoomId;
let groupCallHost = false;

export const connectWithMyPeer = () => {
  // host on / and port 5000 if local
  myPeer = new Peer(uuid(), {
    host: 'edu-self.herokuapp.com',
    // host: 'localhost',
    // port: process.env.PORT || 5000,
    // port: 9000,
    path: '/peerjs',
    secure: true,
    port: 443,
    config: {
      iceServers: [
        { url: 'stun:stun01.sipphone.com' },
        { url: 'stun:stun.ekiga.net' },
        { url: 'stun:stunserver.org' },
        { url: 'stun:stun.softjoys.com' },
        { url: 'stun:stun.voiparound.com' },
        { url: 'stun:stun.voipbuster.com' },
        { url: 'stun:stun.voipstunt.com' },
        { url: 'stun:stun.voxgratia.org' },
        { url: 'stun:stun.xten.com' },
        {
          url: 'turn:192.158.29.39:3478?transport=udp',
          credential: 'JZEOEt2V3Qb0y27GRntt2u2PAYA=',
          username: '28224511:1379330808',
        },
        {
          url: 'turn:192.158.29.39:3478?transport=tcp',
          credential: 'JZEOEt2V3Qb0y27GRntt2u2PAYA=',
          username: '28224511:1379330808',
        },
      ],
    },

    debug: 3,
  });

  myPeer.on('open', (id) => {
    console.log('succesfully connected with peer server');
    myPeerId = id;
    mySocketID = store.getState().dashboard.socketID;
    console.log(mySocketID);
    store.dispatch(setPeerId(id));
  });

  myPeer.on('error', (err) => {
    console.log('Cannot connect with server');
    console.log(err);
  });

  myPeer.on('call', (call) => {
    call.answer(
      store.getState().call.localStream
        ? store.getState().call.localStream
        : new MediaStream()
    );

    const activeUsers = store.getState().dashboard.activeUsers;

    const user = activeUsers.find((user) => user.peerId === call.peer);

    store.dispatch(addGroupCallUser(user?.username ? user.username : 'Błąd'));

    call.on('stream', (incomingStream) => {
      const streams = store.getState().call.groupCallStreams;
      const stream = streams.find(
        (stream) => stream.video.id === incomingStream.id
      );
      if (!stream) {
        addVideoStream({
          username: user?.username ? user.username : 'Błąd',
          video: incomingStream ? incomingStream : null,
          id: call.peer,
        });
      }
    });
  });
};

export const createNewGroupCall = (name) => {
  groupCallHost = true;
  store.dispatch(addGroupCallUser(store.getState().dashboard.username));
  wss.registerGroupCall({
    username: store.getState().dashboard.username,
    peerId: myPeerId,
    roomName: name,
    socketID: mySocketID,
    groupCallUsers: store.getState().call.groupCallUsers,
  });

  store.dispatch(setGroupCallActive(true));
  store.dispatch(setCallState(callStates.CALL_IN_PROGRESS));
};

export const joinGroupCall = (hostSocketID, roomId) => {
  const localStream = store.getState().call.localStream;
  groupCallRoomId = roomId;
  wss.userWantsToJoinGroupCall({
    peerId: myPeerId,
    hostSocketID,
    roomId,
    localStreamId: localStream?.id,
    socketID: mySocketID,
    username: store.getState().dashboard.username,
  });

  store.dispatch(addGroupCallUser(store.getState().dashboard.username));
  store.dispatch(setGroupCallRoomId(roomId));
  store.dispatch(setGroupCallActive(true));
  store.dispatch(setCallState(callStates.CALL_IN_PROGRESS));
};

// Accepting a new user into the chat along with their webcam / host only
export const connectToNewUser = (data) => {
  const localStream = store.getState().call.localStream
    ? store.getState().call.localStream
    : new MediaStream();

  const call = myPeer.call(data.peerId, localStream);

  const activeUsers = store.getState().dashboard.activeUsers;

  let user = activeUsers.find((user) => user.socketID === data.socketID);

  if (!user) {
    user = activeUsers.find((user) => user.peerId === data.peerId);
  }

  store.dispatch(addGroupCallUser(user?.username ? user.username : 'Błąd'));

  call.on('stream', (incomingStream) => {
    const streams = store.getState().call.groupCallStreams;
    const stream = streams.find(
      (stream) => stream.video.id === incomingStream?.id
    );

    if (!stream) {
      addVideoStream({
        username: user?.username ? user.username : 'Błąd',
        video: incomingStream ? incomingStream : 'brak',
        id: call.peer,
        socketID: data.socketID,
      });
    }
  });
};

export const downloadMessages = (data) => {
  store.dispatch(downloadGroupChatMessages(data));
};

export const leaveGroupCall = () => {
  if (groupCallHost) {
    wss.groupCallClosedByHost({
      peerId: myPeerId,
    });
  } else {
    wss.userLeftGroupCall({
      username: store.getState().dashboard.username,
      streamId: store.getState().call.localStream?.id,
      roomId: groupCallRoomId,
      socketID: mySocketID,
    });
  }

  clearGroupData();

  const localStream = store.getState().call.localStream;

  if (localStream) {
    localStream.getVideoTracks()[0].stop();
    localStream.getAudioTracks()[0].stop();
  }
};

export const clearGroupData = async () => {
  groupCallRoomId = await null;
  await store.dispatch(clearGroupCallData());
  await store.dispatch(clearGroupCallRoomId());
  await myPeer.destroy();
  await connectWithMyPeer();
};

export const removeInactiveStream = (data) => {
  const groupCallStreams = store
    .getState()
    .call.groupCallStreams.filter(
      (stream) => stream.video.id !== data.streamId
    );
  store.dispatch(setGroupCallIncomingStreams(groupCallStreams));
};
export const removeInactiveUser = (data) => {
  let groupCallUsers = store
    .getState()
    .call.groupCallUsers.filter((user) => user !== data.username);
  groupCallUsers = groupCallUsers.filter((user) => user !== 'Błąd');
  console.log(groupCallUsers);
  store.dispatch(setGroupCallUsers(groupCallUsers));
};

const addVideoStream = (incomingStream) => {
  const groupCallStreams = [
    ...store.getState().call.groupCallStreams,
    incomingStream,
  ];

  store.dispatch(setGroupCallIncomingStreams(groupCallStreams));
};

export const addNewGroupChatMessage = (message) => {
  store.dispatch(addGroupChatMessage(message));
};

export const checkActiveGroupCall = () => {
  if (store.getState().call.groupCallActive) {
    return groupCallRoomId;
  } else {
    return false;
  }
};
