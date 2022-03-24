import React, { useRef, useEffect } from 'react';

const RemoteVideoView = (props) => {
  const { remoteStream, soundMuted, videoWidth } = props;
  const styles = {
    videoContainer: {
      width: videoWidth,
      position: 'absolute',
      left: 0,
      top: 20,
      zIndex: '-5',
      height: '100%',
    },
    videoElement: {
      width: '100%',
      height: '70%',
    },
  };
  const remoteVideoRef = useRef();

  useEffect(() => {
    if (remoteStream) {
      const remoteVideo = remoteVideoRef.current;
      remoteVideo.srcObject = remoteStream;
      remoteVideo.onloadedmetadata = () => {
        remoteVideo.play();
      };
    }
  }, [remoteStream]);

  useEffect(() => {
    if (soundMuted) {
      remoteVideoRef.current.muted = true;
    } else if (!soundMuted) {
      remoteVideoRef.current.muted = false;
    }
  }, [soundMuted]);

  return (
    <div style={styles.videoContainer}>
      <video style={styles.videoElement} ref={remoteVideoRef} autoPlay />
    </div>
  );
};

export default RemoteVideoView;
