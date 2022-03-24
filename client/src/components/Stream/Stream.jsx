import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Box, Button, Hidden } from '@material-ui/core';
import { useHistory } from 'react-router-dom';
import { callStates } from '../../store/callStates';

import { makeStyles } from '@material-ui/core/styles/';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';

import BottomNav from './components/BottomNav';
import Chat from './components/Chat';
import LocalVideoView from './components/LocalVideoView';
import RemoteVideoView from './components/RemoteVideoView';
import { getLocalStream, hangUp } from '../../utils/webRTC/webRTCHandler';

const useStyles = makeStyles({
  container: {
    width: '100vw',
    height: '100vh',
    position: 'absolute',
    top: '0',
    left: '0',
  },
  exit: {
    background: 'white',
    width: '150px',
    height: '50px',
    position: 'absolute',
    left: '0',
    top: '0',
  },
  question: {
    background: 'white',
    width: '150px',
    height: '50px',
    position: 'absolute',
    left: '0',
    bottom: '0',
  },
  video: {
    position: 'absolute',
    top: '0',
    left: '0',
    height: '100vh',
    background: 'black',
  },
});

const Stream = ({ smallerThan960px, smallerThan600px }) => {
  const call = useSelector((state) => state.call);
  const activeUsers = useSelector((state) => state.dashboard.activeUsers);
  const {
    localStream,
    remoteStream,
    callState,
    userHangedUp,
    screenSharingActive,
    screenSharingScreen,
    participantSocketID,
  } = call;

  const classes = useStyles();
  const [chatWidth, setChatWidth] = useState('20vw');
  const [videoWidth, setVideoWidth] = useState('100vw');
  const [soundMuted, setSoundMuted] = useState(false);

  const history = useHistory();
  const handleHangUpButtonPressed = () => {
    hangUp();
    history.push('/');
  };

  useEffect(() => {
    if (activeUsers.some((e) => e.socketID === participantSocketID)) {
      return;
    } else {
      hangUp();
      history.push('/');
    }
    if (userHangedUp) {
      history.push('/');
    }
  }, [activeUsers, userHangedUp]);

  useEffect(() => {
    getLocalStream();
  }, []);

  return (
    <>
      {!smallerThan600px && (
        <LocalVideoView
          localStream={localStream}
          screenSharingActive={screenSharingActive}
          screenSharingScreen={screenSharingScreen}
          smallerThan960px={smallerThan960px}
          smallerThan600px={smallerThan600px}
          chatWidth={chatWidth}
        />
      )}
      {remoteStream && callState === callStates.CALL_IN_PROGRESS && (
        <RemoteVideoView
          remoteStream={remoteStream}
          soundMuted={soundMuted}
          videoWidth={videoWidth}
        />
      )}
      <Box
        display="flex"
        className={classes.container}
        height="100%"
        justifyContent="center"
      >
        <Button
          variant="contained"
          className={classes.exit}
          startIcon={<ArrowBackIosIcon />}
          onClick={handleHangUpButtonPressed}
        >
          Opuść rozmowę
        </Button>
        <BottomNav
          smallerThan960px={smallerThan960px}
          smallerThan600px={smallerThan600px}
          soundMuted={soundMuted}
          setSoundMuted={setSoundMuted}
        />
        <Chat
          setVideoWidth={setVideoWidth}
          videoWidth={videoWidth}
          setChatWidth={setChatWidth}
          chatWidth={chatWidth}
        />
      </Box>
    </>
  );
};

export default Stream;
