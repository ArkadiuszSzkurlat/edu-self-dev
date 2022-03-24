import React, { useRef, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import {
  setLocalCameraEnabled,
  setLocalMicrophoneEnabled,
} from '../../../store/callSlice';

const LocalVideoView = ({
  localStream,
  screenSharingActive,
  screenSharingScreen,
  smallerThan600px,
  smallerThan960px,
}) => {
  const styles = {
    videoContainer: {
      width: '250px',
      height: 'auto',
      position: 'absolute',
      backgroundColor: 'black',
      bottom: smallerThan600px ? '15%' : smallerThan960px ? '10%' : '5%',
    },
    videoElement: {
      width: '100%',
      height: '100%',
    },
  };

  const localVideoRef = useRef();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setLocalMicrophoneEnabled(true));
    dispatch(setLocalCameraEnabled(true));
  }, []);

  const getVideo = async () => {
    try {
      const localVideo = localVideoRef.current;
      localVideo.srcObject = localStream;

      localVideo.onloadedmetadata = () => {
        localVideo.play();
      };
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getVideo();
  }, [localStream]);

  useEffect(() => {
    if (!screenSharingActive) {
      const localVideo = localVideoRef.current;
      localVideo.srcObject = localStream;

      localVideo.onloadedmetadata = () => {
        localVideo.play();
      };
    } else {
      const localVideo = localVideoRef.current;
      localVideo.srcObject = screenSharingScreen;

      localVideo.onloadedmetadata = () => {
        localVideo.play();
      };
    }
  }, [screenSharingActive, screenSharingScreen]);

  return (
    <div style={styles.videoContainer}>
      <video style={styles.videoElement} ref={localVideoRef} autoPlay muted />
    </div>
  );
};

export default LocalVideoView;
