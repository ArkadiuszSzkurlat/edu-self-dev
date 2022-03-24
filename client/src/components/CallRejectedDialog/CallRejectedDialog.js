import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { setCallRejected } from '../../store/callSlice';

import './CallRejectedDialog.css';

const CallRejectedDialog = () => {
  const reason = useSelector((state) => state.call.callRejected.reason);
  const dispatch = useDispatch();
  const history = useHistory();

  useEffect(() => {
    const hideCallRejectedDialog = (callRejectedDetails) => {
      dispatch(setCallRejected(callRejectedDetails));
    };

    history.push('/Contacts');
    setTimeout(() => {
      hideCallRejectedDialog({
        rejected: false,
        reason: '',
      });
    }, [4000]);
  }, []);

  return (
    <div className="call_rejected_dialog">
      <span>{reason}</span>
    </div>
  );
};

export default CallRejectedDialog;
