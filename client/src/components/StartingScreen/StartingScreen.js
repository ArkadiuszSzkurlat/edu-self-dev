import React, { useEffect } from 'react';
import Drawer from '../Drawer/Drawer';
import { Link } from 'react-router-dom';
import { Grid, Typography, ButtonGroup, Button } from '@material-ui/core';
import Logo from '../Logo/Logo';

const Home = ({ smallerThan960px }) => {
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
          gap: '15px',
        }}
      >
        <Logo />
        <Typography variant="h5">
          Witaj w aplikacji szkoleniowej Edu-Self.
        </Typography>
        <Typography variant="h6">
          Nowej na rynku aplikacji szkoleniowej
        </Typography>
        <Typography variant="body1">
          Po lewej stronie znajduje się nawigacja, zaloguj się lub wejdź jako
          gość, by już dzisiaj móc korzystać z rozmów.
        </Typography>
        <Link
          to="/home"
          style={{
            textDecoration: 'none',
          }}
        >
          <Button
            style={{
              margin: smallerThan960px ? '20px' : '0px',
            }}
            variant="contained"
            color="primary"
          >
            Dołącz do nas!
          </Button>
        </Link>
        <Typography variant="subtitle1">
          Aplikacja jest jeszcze w fazie testowej.
        </Typography>
      </Grid>
    </div>
  );
};

export default Home;
