import React, { useEffect } from 'react';
import Drawer from '../Drawer/Drawer';
import { Link } from 'react-router-dom';
import { Grid, Typography, Button } from '@material-ui/core';
import { useDispatch } from 'react-redux';
import { setUserHangedUp } from '../../store/callSlice';
import Logo from '../Logo/Logo';

const Home = ({ smallerThan960px }) => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setUserHangedUp(false));
  }, []);

  return (
    <div>
      <Drawer />
      <Grid
        container
        direction="column"
        justifyContent="center"
        alignItems="center"
        style={{
          height: '80vh',
          margin: 'auto',
          marginTop: '10vh',
          width: smallerThan960px ? '100%' : '50%',
        }}
      >
        <Logo />
        <Typography variant="body1">
          Przedstaw się aby inni użytkownicy wiedzieli z kim rozmawiają, jeśli
          posiadasz konto zaloguj się, jeśli go nie posiadasz, zarejestruj się
          lub kontynuuj jako gość.
        </Typography>

        <Link
          to="/LogIn"
          style={{
            textDecoration: 'none',
          }}
        >
          <Button
            style={{
              margin: '12.5px',
            }}
            variant="contained"
          >
            Zaloguj się
          </Button>
        </Link>
        <Link
          to="/SignUp"
          style={{
            textDecoration: 'none',
          }}
        >
          <Button
            style={{
              margin: '12.5px',
            }}
            variant="contained"
          >
            Zarejestruj się
          </Button>
        </Link>
        <Link
          to="/AsGuest"
          style={{
            textDecoration: 'none',
          }}
        >
          <Button
            style={{
              margin: '12.5px',
            }}
            variant="contained"
          >
            Kontynuuj jako gość
          </Button>
        </Link>
      </Grid>
    </div>
  );
};

export default Home;
