import React from 'react';
import { Paper, Button, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { callToOtherUser } from '../../utils/webRTC/webRTCHandler';
import { callStates } from '../../store/callStates';
import CallIcon from '@material-ui/icons/Call';

const Contact = ({
  activeUser,
  callState,
  smallerThan960px,
  smallerThan600px,
}) => {
  const useStyles = makeStyles({
    contact: {
      height: smallerThan600px ? '100px' : '200px',
      width: '200px',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      margin: '10px',
    },
  });
  const classes = useStyles();

  const handleListItemPressed = () => {
    if (callState === callStates.CALL_AVAILABLE) {
      callToOtherUser(activeUser);
    }
  };
  return (
    <Paper
      className={classes.contact}
      elevation={5}
      style={{
        display: 'flex',
        flexDirection: smallerThan600px ? 'row' : 'column',
        gap: '15px',
      }}
    >
      <Typography variant="body1">{activeUser.username}</Typography>
      <Button
        variant="outlined"
        size="small"
        style={{ backgroundColor: '#49d049' }}
        startIcon={<CallIcon />}
        onClick={handleListItemPressed}
      >
        Zadzwoń
      </Button>
    </Paper>
  );
};

export default Contact;
