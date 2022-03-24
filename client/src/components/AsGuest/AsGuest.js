import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { setUsername as saveUsername } from '../../store/dashboardSlice';
import { registerNewUser } from '../../utils/wssConnection/wssConnection';

import { Grid, Typography, Button, TextField } from '@material-ui/core';
import Drawer from '../Drawer/Drawer';
import { setCallState } from '../../store/callSlice';
import { callStates } from '../../store/callStates';
import Logo from '../Logo/Logo';

function AsGuest() {
  const [username, setUsername] = useState('');

  const dispatch = useDispatch();

  const history = useHistory();

  const activeUsers = useSelector((state) => state.dashboard.activeUsers);
  const usernameRedux = useSelector((state) => state.dashboard.username);

  const handleSubmitButtonPressed = () => {
    if (!usernameRedux) {
      if (activeUsers.length === 0) {
        registerNewUser(username);
        dispatch(saveUsername(username));
        dispatch(setCallState(callStates.CALL_AVAILABLE));
        history.push('/Contacts');
      } else {
        if (activeUsers.some((item) => item.username === username)) {
          alert('Ktoś już ma taki nick, musisz podać inny');
        } else {
          registerNewUser(username);
          dispatch(saveUsername(username));
          history.push('/Contacts');
        }
      }
    }
  };

  return (
    <div>
      <Drawer />
      <Grid
        container
        direction='column'
        justifyContent='space-around'
        alignItems='center'
        style={{ height: '80vh', margin: 'auto', marginTop: '10vh' }}
      >
        <Logo />
        <Typography variant='h4' component='h1'>
          Wejdź jako gość
        </Typography>
        <TextField
          onChange={(event) => {
            setUsername(event.target.value);
          }}
          label='Nazwa Użytkownika'
          variant='filled'
          autoFocus
        />
        <Button
          variant='contained'
          color='secondary'
          onClick={handleSubmitButtonPressed}
        >
          Kontynuuj jako gość
        </Button>
      </Grid>
    </div>
  );
}

export default AsGuest;
