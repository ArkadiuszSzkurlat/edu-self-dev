import React, { useState } from 'react';
import {
  BottomNavigation,
  BottomNavigationAction,
  Grid,
} from '@material-ui/core';

import VideocamIcon from '@material-ui/icons/Videocam';
import VideocamOffIcon from '@material-ui/icons/VideocamOff';
import MicIcon from '@material-ui/icons/Mic';
import VolumeUpIcon from '@material-ui/icons/VolumeUp';
import ChatIcon from '@material-ui/icons/Chat';
import LiveHelpOutlinedIcon from '@material-ui/icons/LiveHelpOutlined';
import { makeStyles } from '@material-ui/core/styles/';

const StreamMenuMobile = ({ smallerThan600px }) => {
  const useStyles = makeStyles({
    bottomNavBar: {
      width: '100vw',
      height: smallerThan600px ? '15vh' : '10vh',
      bottom: '0',
      position: 'absolute',
    },
  });

  const classes = useStyles();

  const [videoCam, setVideoCam] = useState(false);
  const [videoCamIcon, setVideoCamIcon] = useState(<VideocamIcon />);
  const videoCamHandler = (e) => {
    setVideoCam(!videoCam);
    setVideoCamIcon(videoCam ? <VideocamIcon /> : <VideocamOffIcon />);
  };

  return (
    <BottomNavigation
      showLabels
      component={Grid}
      container
      className={classes.bottomNavBar}
    >
      <BottomNavigationAction
        component={Grid}
        item
        xs={6}
        sm
        disabled
        label="Zapytaj"
        icon={<LiveHelpOutlinedIcon />}
      ></BottomNavigationAction>
      <BottomNavigationAction
        component={Grid}
        item
        xs={6}
        sm
        label="Czat"
        icon={<ChatIcon />}
      ></BottomNavigationAction>
      <BottomNavigationAction
        component={Grid}
        item
        label="Kamera"
        xs={4}
        sm
        icon={<VideocamIcon />}
      ></BottomNavigationAction>
      <BottomNavigationAction
        component={Grid}
        item
        label="Mikrofon"
        xs={4}
        sm
        icon={<MicIcon />}
      ></BottomNavigationAction>
      <BottomNavigationAction
        component={Grid}
        item
        label="Dzwięk"
        xs={4}
        sm
        icon={<VolumeUpIcon />}
      ></BottomNavigationAction>
    </BottomNavigation>
  );
};

export default StreamMenuMobile;
