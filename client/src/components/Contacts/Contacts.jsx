import { Grid } from '@material-ui/core';
import React from 'react';
import Drawer from '../Drawer/Drawer';
import { useSelector } from 'react-redux';
import Contact from './Contact';

const Contacts = ({ smallerThan960px, smallerThan600px }) => {
  const activeUsers = useSelector((state) => state.dashboard.activeUsers);
  const callState = useSelector((state) => state.call.callState);

  return (
    <>
      <Drawer />
      <Grid
        container
        spacing={3}
        style={{
          marginLeft: smallerThan960px ? '0px' : '200px',
          width: '100%',
          marginTop: '100px',
        }}
      >
        {activeUsers.map((activeUser) => (
          <Contact
            smallerThan960px={smallerThan960px}
            smallerThan600px={smallerThan600px}
            key={activeUser.socketID}
            activeUser={activeUser}
            callState={callState}
          />
        ))}
      </Grid>
    </>
  );
};

export default Contacts;
