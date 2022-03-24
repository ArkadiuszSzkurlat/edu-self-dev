import React from 'react';
import Drawer from '../Drawer/Drawer';
import { Typography, Grid, Button } from '@material-ui/core';
import axios from 'axios';
import { useHistory } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import { userLogout } from '../../utils/wssConnection/wssConnection';
import { setUsername as saveUsername } from '../../store/dashboardSlice';
import Logo from '../Logo/Logo';

const Settings = () => {
  const history = useHistory();
  const dispatch = useDispatch();
  const username = useSelector((state) => state.dashboard.username);

  const deleteAccount = (e) => {
    e.preventDefault();
    // eslint-disable-next-line no-restricted-globals
    if (username) {
      const confirmed = window.confirm('Czy na pewno chcesz usunąć konto?');
      if (confirmed) {
        axios
          .delete('users/deleteMe')
          .then(function (response) {
            alert('Twoje konto zostało usunięte.');
            dispatch(saveUsername(''));
            userLogout();
            history.push('/home');
            console.log(response);
          })
          .catch(function (error) {
            alert('Niestety nie udało się usunąć konta.');
            console.error(error);
          });
      }
    } else {
      alert('Nie jesteś zalogowany, więc nie możesz usunąć konta');
    }
  };

  return (
    <>
      <Drawer />
      <Grid
        container
        direction="column"
        justifyContent="space-around"
        alignItems="center"
        style={{ height: '80vh', margin: 'auto', marginTop: '10vh' }}
      >
        <Logo />
        <Typography variant="h4" component="h1">
          Ustawienia
        </Typography>
        <form style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            primary={true}
            onClick={deleteAccount}
          >
            Usuń konto
          </Button>
        </form>
      </Grid>
    </>
  );
};

export default Settings;
