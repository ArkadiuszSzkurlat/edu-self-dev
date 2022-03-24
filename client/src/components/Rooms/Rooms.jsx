import { Grid } from '@material-ui/core';
import React from 'react';
import Drawer from '../Drawer/Drawer';
import { useSelector } from 'react-redux';
import Room from './Room';

const Contacts = () => {
  const groupCallRooms = useSelector((state) => state.dashboard.groupCallRooms);

  return (
    <>
      <Drawer />
      <Grid
        container
        spacing={3}
        style={{ marginLeft: '200px', width: '100%', marginTop: '100px' }}
      >
        {groupCallRooms.map((room) => (
          <Room key={room.roomId} room={room} />
        ))}
      </Grid>
    </>
  );
};

export default Contacts;
