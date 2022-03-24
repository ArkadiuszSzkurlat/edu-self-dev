// Functions and libraries
import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Box, Button } from '@material-ui/core';
import { useHistory } from 'react-router-dom';
// Styless
import { makeStyles } from '@material-ui/core/styles/';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
// Components
import BottomNav from './components/BottomNav';
import RightNav from './components/RightNav';
import LocalVideoView from './components/LocalVideoView';
import GroupCallVideo from './components/GroupCallVideo';
import { leaveGroupCall } from '../../utils/webRTC/webRTCGroupCallHandler';

const useStyles = makeStyles({
  container: {
    width: '100vw',
    height: '100vh',
    position: 'absolute',
    top: '0',
    left: '0',
  },
  remoteVideos: {
    width: '90vw',
    height: '90vh',
    position: 'absolute',
    left: '5vw',
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
  const { localStream, groupCallStreams, groupCallActive } = call;
  //  STYLES
  const classes = useStyles();
  const [chatWidth, setChatWidth] = useState('20vw');
  const [videoWidth, setVideoWidth] = useState('100vw');
  const [oneUserOnGroupStream, setOneUserOnGroupStream] = useState(false);

  const history = useHistory();

  useEffect(() => {
    if (groupCallStreams.length === 1) {
      setOneUserOnGroupStream(true);
    } else {
      setOneUserOnGroupStream(false);
    }
  }, [groupCallStreams]);

  const handleHangUpButtonPressed = () => {
    leaveGroupCall();
    history.push('/');
  };

  useEffect(() => {
    if (!groupCallActive) {
      leaveGroupCall();
      history.push('/');
    }
  }, [groupCallActive]);

  return (
    <>
      <LocalVideoView
        localStream={localStream}
        smallerThan960px={smallerThan960px}
        smallerThan600px={smallerThan600px}
        chatWidth={chatWidth}
      />
      <Box
        display="flex"
        className={classes.remoteVideos}
        justifyContent="center"
        alignItems="center"
      >
        {groupCallStreams &&
          groupCallStreams.map((stream) => {
            return (
              <GroupCallVideo
                key={stream.video.id}
                stream={stream.video}
                username={stream.username}
                oneUserOnGroupStream={oneUserOnGroupStream}
                smallerThan600px={smallerThan600px}
                smallerThan960px={smallerThan960px}
                videoWidth={videoWidth}
              />
            );
          })}
      </Box>
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
          Opuść szkolenie
        </Button>

        <BottomNav
          smallerThan960px={smallerThan960px}
          smallerThan600px={smallerThan600px}
        />

        <RightNav
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
