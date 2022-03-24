import {
  BottomNavigation,
  BottomNavigationAction,
  Grid,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles/';

import VideocamIcon from '@material-ui/icons/Videocam';
import VideocamOffIcon from '@material-ui/icons/VideocamOff';
import MicIcon from '@material-ui/icons/Mic';
import MicOffIcon from '@material-ui/icons/MicOff';
import VolumeUpIcon from '@material-ui/icons/VolumeUp';
import VolumeOffIcon from '@material-ui/icons/VolumeOff';
import ScreenShareIcon from '@material-ui/icons/ScreenShare';
import StopScreenShareIcon from '@material-ui/icons/StopScreenShare';

import { useSelector, useDispatch } from 'react-redux';
import {
  setLocalMicrophoneEnabled,
  setLocalCameraEnabled,
} from '../../../store/callSlice';
import React, { useState } from 'react';
import { switchForScreenSharingStream } from '../../../utils/webRTC/webRTCHandler';

const BottomNav = ({
  smallerThan600px,
  smallerThan960px,
  soundMuted,
  setSoundMuted,
}) => {
  const useStyles = makeStyles({
    bottomNavBar: {
      width: '400px',
      position: 'absolute',
      bottom: 0,
    },
    mobileBottomNavBar: {
      width: '100vw',
      height: smallerThan600px ? '15vh' : '10vh',
      bottom: '0',
      position: 'absolute',
    },
  });

  const call = useSelector((state) => state.call);
  const dispatch = useDispatch();
  const {
    localStream,
    localCameraEnabled,
    localMicrophoneEnabled,
    screenSharingActive,
  } = call;

  const [videoCamIcon, setVideoCamIcon] = useState(<VideocamIcon />);

  const videoCamHandler = (e) => {
    const cameraEnabled = localCameraEnabled;
    localStream.getVideoTracks()[0].enabled = !cameraEnabled;
    dispatch(setLocalCameraEnabled(!cameraEnabled));
    setVideoCamIcon(cameraEnabled ? <VideocamOffIcon /> : <VideocamIcon />);
  };

  const [micIcon, setMicIcon] = useState(<MicIcon />);

  const micHandler = (e) => {
    const micEnabled = localMicrophoneEnabled;
    localStream.getAudioTracks()[0].enabled = !micEnabled;
    dispatch(setLocalMicrophoneEnabled(!micEnabled));
    setMicIcon(micEnabled ? <MicOffIcon /> : <MicIcon />);
  };

  const handleScreenSharingButtonPressed = () => {
    switchForScreenSharingStream();
  };

  const onOffClickVolume = () => {
    soundMuted ? setSoundMuted(false) : setSoundMuted(true);
  };

  const classes = useStyles();
  return (
    <BottomNavigation
      showLabels
      component={Grid}
      container
      className={
        smallerThan960px ? classes.mobileBottomNavBar : classes.bottomNavBar
      }
      borderRadius="10px 10px 0 0"
    >
      <BottomNavigationAction
        component={Grid}
        item
        xs={6}
        sm
        onClick={micHandler}
        label="Mikrofon"
        icon={micIcon}
      />
      <BottomNavigationAction
        component={Grid}
        item
        xs={6}
        sm
        onClick={videoCamHandler}
        label="Kamera"
        icon={videoCamIcon}
      />
      <BottomNavigationAction
        component={Grid}
        item
        xs={6}
        sm
        onClick={onOffClickVolume}
        label="Dzwięk"
        icon={soundMuted ? <VolumeOffIcon /> : <VolumeUpIcon />}
      />
      <BottomNavigationAction
        component={Grid}
        item
        xs={6}
        sm
        onClick={handleScreenSharingButtonPressed}
        label={screenSharingActive ? 'Zatrzymaj' : 'Udostępnij'}
        icon={
          screenSharingActive ? <StopScreenShareIcon /> : <ScreenShareIcon />
        }
      />
    </BottomNavigation>
  );
};

export default BottomNav;
