import store from '../../store/store';
import {
  setLocalStream,
  setParticipantSocketID,
  setCallState,
  setCallingDialogVisible,
  setCallerUsername,
  setCallRejected,
  setRemoteStream,
  resetCallDataState,
  setScreenSharingActive,
  setScreenSharingScreen,
  addChatMessage,
} from '../../store/callSlice';
import * as webSocket from '../wssConnection/wssConnection';
import { callStates } from '../../store/callStates';
import Peer from 'simple-peer';

const preOfferAnswers = {
  CALL_ACCEPTED: 'CALL_ACCEPTED',
  CALL_REJECTED: 'CALL_REJECTED',
  CALL_NOT_AVAILABLE: 'CALL_NOT_AVAILABLE',
};

// Settings for local stream download
const defaultConstrains = {
  video: {
    width: 480,
    height: 360,
  },
  audio: true,
};

const configuration = {
  iceServers: [
    {
      urls: 'stun:stun.l.google.com:13902',
    },
  ],
};

let connectedUserSocketID;
let initiator;
let peer;

//Taking the Local Stream
export const getLocalStream = async () => {
  await navigator.mediaDevices
    .getUserMedia(defaultConstrains)
    .then(async (stream) => {
      await store.dispatch(setLocalStream(stream));
      console.log('Succesfully received localStream');
      await createPeerConnection(stream);
    })
    .catch(async (err) => {
      await console.log('User have not consented to camera access');
      console.error(err);
    });
};

export const createPeerConnection = (stream) => {
  console.log('creating Peer');
  console.log(stream);
  peer = new Peer({
    initiator: initiator,
    trickle: false,
    config: {
      iceServers: [
        {
          urls: 'stun:numb.viagenie.ca',
          username: 'sultan1640@gmail.com',
          credential: '98376683',
        },
        {
          urls: 'turn:numb.viagenie.ca',
          username: 'sultan1640@gmail.com',
          credential: '98376683',
        },
      ],
    },
    stream: stream,
  });

  peer.on('signal', (data) => {
    console.log('signalData', data);
    webSocket.sendPeerSignal({ signalData: data, to: connectedUserSocketID });
  });

  peer.on('stream', (stream) => {
    store.dispatch(setRemoteStream(stream));
  });

  peer.on('close', () => {
    console.log(' peer connection has closed');
    resetCallDataAfterHangUp();
  });

  peer.on('error', (err) => {
    console.log('some error occuered', err);
  });
};

export const handlePeerSignal = (data) => {
  console.log('łapiemy signal data');
  peer.signal(data.signalData);
};

export const callToOtherUser = (calleeDetails) => {
  initiator = true;
  console.log(calleeDetails);
  connectedUserSocketID = calleeDetails.socketID;
  store.dispatch(setParticipantSocketID(connectedUserSocketID));
  store.dispatch(setCallState(callStates.CALL_UNAVAILABLE));
  store.dispatch(setCallingDialogVisible(true));
  webSocket.sendPreOffer({
    callee: calleeDetails,
    caller: {
      username: store.getState().dashboard.username,
    },
  });
};

export const handlePreOffer = (data) => {
  initiator = false;
  if (checkIfCallIsPossible()) {
    connectedUserSocketID = data.callerSocketID;
    store.dispatch(setCallerUsername(data.callerUsername));
    store.dispatch(setCallState(callStates.CALL_REQUESTED));
  } else {
    webSocket.sendPreOfferAnswer({
      callerSocketID: data.callerSocketID,
      answer: preOfferAnswers.CALL_NOT_AVAILABLE,
    });
  }
};

export const handlePreOfferAnswer = (data) => {
  store.dispatch(setCallingDialogVisible(false));

  if (data.answer === preOfferAnswers.CALL_ACCEPTED) {
    store.dispatch(setCallState(callStates.CALL_IN_PROGRESS));
    sendOffer();
  } else {
    let rejectionReason;
    if (data.answer === preOfferAnswers.CALL_NOT_AVAILABLE) {
      rejectionReason = 'W tym momencie użytkownik nie może odebrać rozmowy';
    } else {
      rejectionReason = 'Połączenie odrzucone przez użytkownika';
    }
    store.dispatch(
      setCallRejected({
        rejected: true,
        reason: rejectionReason,
      })
    );

    resetCallData();
  }
};

export const acceptIncomingCallRequest = () => {
  store.dispatch(setParticipantSocketID(connectedUserSocketID));
  webSocket.sendPreOfferAnswer({
    callerSocketID: connectedUserSocketID,
    answer: preOfferAnswers.CALL_ACCEPTED,
  });

  store.dispatch(setCallState(callStates.CALL_IN_PROGRESS));
};

export const rejectIncomingCallRequest = () => {
  webSocket.sendPreOfferAnswer({
    callerSocketID: connectedUserSocketID,
    answer: preOfferAnswers.CALL_REJECTED,
  });
  resetCallData();
};

export const checkIfCallIsPossible = () => {
  if (
    // store.getState().call.localStream === null ||
    store.getState().call.callState !== callStates.CALL_AVAILABLE
  ) {
    return false;
  } else {
    return true;
  }
};

const sendOffer = () => {
  // const localStream = store.getState().call.localStream;
  console.log(
    'Rozmowa została zaakceptowana i tutaj nastąpi próba połączenia dwóch osób za pomocą simple-peer'
  );
};

export const resetCallData = () => {
  connectedUserSocketID = null;
  store.dispatch(setCallState(callStates.CALL_AVAILABLE));
};

export const hangUp = () => {
  webSocket.sendUserHangedUp({
    connectedUserSocketID: connectedUserSocketID,
  });

  resetCallDataAfterHangUp();
};

export const resetCallDataAfterHangUp = () => {
  // 26/10 add
  const localStream = store.getState().call.localStream;
  const localStreamTracks = localStream.getTracks();
  // FIXME Wywala jak nie ma mikro i kamery z rozmowy
  if (localStream) {
    peer.removeStream(localStream);
    localStreamTracks.forEach((track) => {
      track.stop();
    });
    // peer.destroy();
  }
  resetCallData();

  // if (store.getState().call.screenSharingActive) {
  //   screenSharingStream.getTracks().forEach((track) => {
  //     track.stop();
  //   });
  // }

  store.dispatch(resetCallDataState());
};

let screenSharingStream;

// FIXME Tutaj poprawić bo nie działa
export const switchForScreenSharingStream = async () => {
  if (!store.getState().call.screenSharingActive) {
    const localStream = store.getState().call.localStream;
    try {
      screenSharingStream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
      });

      store.dispatch(setScreenSharingActive(true));

      peer.replaceTrack(
        localStream.getVideoTracks()[0],
        screenSharingStream.getVideoTracks()[0],
        localStream
      );

      store.dispatch(setScreenSharingScreen(screenSharingStream));
    } catch (err) {
      console.error(
        'error occured when trying to get screen sharing stream',
        err
      );
    }
  } else {
    const localStream = store.getState().call.localStream;
    const screenSharingScreen = store.getState().call.screenSharingScreen;

    peer.replaceTrack(
      screenSharingScreen.getVideoTracks()[0],
      localStream.getVideoTracks()[0],
      localStream
    );

    store.dispatch(setScreenSharingActive(false));
    screenSharingStream.getTracks().forEach((track) => track.stop());
  }
};

export const addNewChatMessage = (message) => {
  webSocket.addNewChatMessageSocket({
    connectedUserSocketID: connectedUserSocketID,
    message: message,
  });
};

export const handleNewChatMessage = (data) => {
  store.dispatch(addChatMessage(data.message));
};
