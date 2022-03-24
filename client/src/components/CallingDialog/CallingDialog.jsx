import React, { useEffect } from 'react';
import './CallingDialog.css';
import { hangUp } from '../../utils/webRTC/webRTCHandler';
import { Button } from '@material-ui/core';
import { useHistory } from 'react-router-dom';

const CallingDialog = () => {
  const history = useHistory();

  let callingCanceled = true;
  const handleHangUpButtonPressed = () => {
    callingCanceled = false;
    hangUp();
  };

  useEffect(() => {
    return function cleanup() {
      if (callingCanceled) {
        history.push('/Stream');
      }
    };
  }, []);

  return (
    <div className="direct_calling_dialog background_secondary_color">
      <span>Nawiązywanie połączenia.</span>
      <Button variant="contained" onClick={handleHangUpButtonPressed}>
        Anuluj połączenie
      </Button>
    </div>
  );
};

export default CallingDialog;
