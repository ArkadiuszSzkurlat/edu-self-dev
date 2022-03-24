import React, { useState } from 'react';
import Drawer from '../Drawer/Drawer';
import { Typography, Grid, Button, TextField } from '@material-ui/core';
import axios from 'axios';

import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { setUsername as saveUsername } from '../../store/dashboardSlice';
import { setCallState } from '../../store/callSlice';
import { callStates } from '../../store/callStates';
import { registerNewUser } from '../../utils/wssConnection/wssConnection';
import Logo from '../Logo/Logo';

function LogIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const dispatch = useDispatch();
  const history = useHistory();
  const activeUsers = useSelector((state) => state.dashboard.activeUsers);

  const handleEmail = (e) => {
    setEmail(e.target.value);
  };
  const handlePassword = (e) => {
    setPassword(e.target.value);
  };

  const handleLogIn = (username) => {
    if (activeUsers.length === 0) {
      registerNewUser(username);
      dispatch(saveUsername(username));
      dispatch(setCallState(callStates.CALL_AVAILABLE));
      history.push('/Contacts');
    } else {
      if (
        activeUsers.some(
          (item) => item.username === username && username !== ''
        )
      ) {
        alert('Ktoś już ma taki nick, musisz podać inny');
      } else {
        registerNewUser(username);
        dispatch(saveUsername(username));
        history.push('/Contacts');
      }
    }
  };
  const logIn = async (e) => {
    e.preventDefault();
    const user = await { email: email, password: password };
    let username = '';
    await axios
      .post('users/login', user)
      .then((response) => {
        username = response.data.data.user.name;
        handleLogIn(username);
      })
      .catch((error) => {
        console.log(error);
        setEmail('');
        setPassword('');
        alert('Wprowadzone dane są nieprawidłowe, spróbuj jeszcze raz');
        return;
      });
  };

  return (
    <Grid
      container
      direction="column"
      justifyContent="space-around"
      alignItems="center"
      style={{
        height: '80vh',
        margin: 'auto',
        marginTop: '10vh',
      }}
    >
      <Drawer />
      <Logo />
      <Typography variant="h4" component="h1">
        Zaloguj się
      </Typography>
      <form
        onSubmit={logIn}
        style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}
      >
        <TextField
          label="Email"
          variant="filled"
          type="email"
          required
          value={email}
          onChange={handleEmail}
        />
        <TextField
          label="Hasło"
          variant="filled"
          type="password"
          required
          value={password}
          onChange={handlePassword}
        />
        <Button
          type="submit"
          variant="contained"
          color="primary"
          primary={true}
        >
          Zaloguj się
        </Button>
      </form>
      <Button variant="contained" color="primary">
        Zarejestruj się
      </Button>
      <Button variant="contained" color="secondary">
        Kontynuuj jako gość
      </Button>
    </Grid>
  );
}

export default LogIn;
