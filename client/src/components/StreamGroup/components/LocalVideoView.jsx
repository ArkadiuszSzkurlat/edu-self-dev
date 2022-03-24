import React, { useRef, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import {
  setLocalCameraEnabled,
  setLocalMicrophoneEnabled,
} from '../../../store/callSlice';

const LocalVideoView = ({
  localStream,
  smallerThan600px,
  smallerThan960px,
}) => {
  const styles = {
    videoContainer: {
      width: '250px',
      height: '250px',
      borderRadius: '1px',
      position: 'absolute',
      bottom: smallerThan600px ? '15%' : smallerThan960px ? '10%' : '5%',
      right: '22vw',
      display: smallerThan960px ? 'none' : 'inline',
      zIndex: '50',
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
  }, [localStream]);

  useEffect(() => {
    const localVideo = localVideoRef.current;
    localVideo.srcObject = localStream;

    localVideo.onloadedmetadata = () => {
      localVideo.play();
    };
  }, [localStream]);

  return (
    <div style={styles.videoContainer}>
      <video style={styles.videoElement} ref={localVideoRef} autoPlay muted />
    </div>
  );
};

export default LocalVideoView;
