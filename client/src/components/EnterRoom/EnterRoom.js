import React from 'react';
import Drawer from '../Drawer/Drawer';
import {
  Grid,
  Typography,
  Button,
  ButtonGroup,
  TextField,
} from '@material-ui/core';
import Logo from '../Logo/Logo';

const EnterRoom = ({ smallerThan600px }) => {
  return (
    <div>
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
          Wpisz kod do sali
        </Typography>

        <TextField label="Wprowadź kod: " variant="filled" />
        <ButtonGroup>
          <Button variant="contained" color="primary">
            Dołącz do pokoju
          </Button>
        </ButtonGroup>
        <Button variant="contained" color="secondary">
          Kontynuuj jako gość
        </Button>
      </Grid>
    </div>
  );
};

export default EnterRoom;
