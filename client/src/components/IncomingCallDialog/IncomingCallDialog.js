import React, { useEffect } from 'react';
import {
  acceptIncomingCallRequest,
  rejectIncomingCallRequest,
} from '../../utils/webRTC/webRTCHandler';
import { useHistory } from 'react-router-dom';
import { Howl } from 'howler';
import uprisingSound from '../../resources/sounds/uprising1.wav';

import './IncomingCallDialog.css';

const IncomingCallDialog = ({ callerUsername }) => {
  const incomingCallSound = new Howl({
    src: [uprisingSound],
    loop: true,
    html5: true,
    volume: 1,
  });
  const history = useHistory();
  const handleAcceptButtonPressed = () => {
    acceptIncomingCallRequest();
    incomingCallSound.stop();
    incomingCallSound.stop();
    history.push('/stream');
  };

  useEffect(() => {
    incomingCallSound.play();
    return () => {
      incomingCallSound.stop();
      incomingCallSound.stop();
    };
  }, []);

  const handleRejectButtonPressed = () => {
    rejectIncomingCallRequest();
    incomingCallSound.stop();
    incomingCallSound.stop();
  };

  return (
    <div className="direct_call_dialog background_secondary_color">
      <span className="direct_call_dialog_caller_name">{callerUsername}</span>
      <div className="direct_call_dialog_button_container">
        <button
          className="direct_call_dialog_accept_button"
          onClick={handleAcceptButtonPressed}
        >
          Odbierz
        </button>
        <button
          className="direct_call_dialog_reject_button"
          onClick={handleRejectButtonPressed}
        >
          Odrzuć
        </button>
      </div>
    </div>
  );
};

export default IncomingCallDialog;
