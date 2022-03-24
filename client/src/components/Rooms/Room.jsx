import React from 'react';
import { Grid, Paper, Button, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { useHistory } from 'react-router';
import CallIcon from '@material-ui/icons/Call';
import { joinGroupCall } from '../../utils/webRTC/webRTCGroupCallHandler';
import { useSelector } from 'react-redux';
import { getLocalStream } from '../../utils/webRTC/webRTCHandler';

const useStyles = makeStyles({
  contact: {
    height: '200px',
    width: '200px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

const Room = ({ room }) => {
  const classes = useStyles();
  const history = useHistory();
  const username = useSelector((state) => state.dashboard.username);

  const handleListItemPressed = async () => {
    await getLocalStream();
    if (username) {
      await joinGroupCall(room.socketID, room.roomId);
      await history.push('/StreamGroup');
    }
  };
  return (
    <Grid item xs={4} key={room.roomId}>
      <Paper
        className={classes.contact}
        elevation={5}
        style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}
      >
        <Typography variant="body1">{room.roomName}</Typography>
        <Button
          variant="outlined"
          size="small"
          style={{ backgroundColor: '#49d049' }}
          startIcon={<CallIcon />}
          onClick={handleListItemPressed}
        >
          Dołącz
        </Button>
      </Paper>
    </Grid>
  );
};

export default Room;
