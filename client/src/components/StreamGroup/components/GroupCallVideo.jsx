import React, { useRef, useEffect, useState } from 'react';
import { Box } from '@material-ui/core';

const GroupCallVideo = ({
  stream,
  oneUserOnGroupStream,
  username,
  smallerThan600px,
  smallerThan960px,
  videoWidth,
}) => {
  const videoRef = useRef();

  useEffect(() => {
    const remoteGroupCallVideo = videoRef.current;
    remoteGroupCallVideo.srcObject = stream;
    remoteGroupCallVideo.onloadedmetadata = () => {
      remoteGroupCallVideo.play();
    };
  }, [stream]);

  return (
    <Box
      flexGrow={1}
      style={{
        bottom: smallerThan600px ? '15%' : smallerThan960px ? '10%' : '5%',
        height: smallerThan600px ? '60%' : smallerThan960px ? '80%' : '100%',
        width: 'auto',
        padding: oneUserOnGroupStream ? '0px' : '20px',
        flex: '1 1 300px',
        position: 'relative',
      }}
    >
      {/* NICKNAME OPTION */}
      {/* <Box
        style={{
          position: 'absolute',
          top: smallerThan600px ? '50%' : smallerThan960px ? '20%' : '10%',
          left: '50%',
          width: '250px',
          height: '80px',
          background: 'rgba(0, 0, 0, 0.15)',
          color: '#3399ff',
          borderRadius: '50%',
          transform: 'translateX(-50%)',
          display: 'none',
        }}
      >
        <Typography variant='h3' component='h2'>
          {username}
        </Typography>
      </Box>
      MUTED OPTION
      <Box
        style={{
          position: 'absolute',
          bottom: '20%',
          left: '50%',
          transform: 'translateX(-50%)',
          borderRadius: '50%',
          width: '60px',
          height: '60px',
          background: 'rgba(255, 255, 255, 0.4)',
          zIndex: '20',
          display: 'none',
        }}
      >
        <IconButton
          style={{
            position: 'absolute',
            left: '50%',
            top: '50%',
            transform: 'translate(-50%,-50%)',
          }}
          onClick={onOffClickVolume}
        >
          {soundMuted ? <VolumeOffIcon /> : <VolumeUpIcon />}
        </IconButton>
      </Box> */}

      <video
        ref={videoRef}
        autoPlay
        style={{
          width: '100%',
          height: '100%',
        }}
      />
    </Box>
  );
};

export default GroupCallVideo;
