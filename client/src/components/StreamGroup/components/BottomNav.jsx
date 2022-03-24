// Styles
import {
  BottomNavigation,
  BottomNavigationAction,
  Grid,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles/';
// ICONS
import VideocamIcon from '@material-ui/icons/Videocam';
import VideocamOffIcon from '@material-ui/icons/VideocamOff';
import MicIcon from '@material-ui/icons/Mic';
import MicOffIcon from '@material-ui/icons/MicOff';
// Libs
import { useSelector, useDispatch } from 'react-redux';
import {
  setLocalMicrophoneEnabled,
  setLocalCameraEnabled,
} from '../../../store/callSlice';
import React, { useState } from 'react';

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
  const { localStream, localCameraEnabled, localMicrophoneEnabled } = call;

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
    </BottomNavigation>
  );
};

export default BottomNav;
