import React, { useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import {
  Drawer as MUIDrawer,
  Hidden,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  IconButton,
  Divider,
  Avatar,
  Typography,
  Grid,
  Button,
} from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';
import CloseIcon from '@material-ui/icons/Close';
import ContactsIcon from '@material-ui/icons/Contacts';
import { makeStyles } from '@material-ui/core/styles';
import {
  ExitToApp as ExitToAppIcon,
  MeetingRoom as MeetingRoomIcon,
  Settings as SettingsIcon,
  Event as EventIcon,
} from '@material-ui/icons';
import userAvatar from '../../resources/images/userAvatar.png';
import { userLogout } from '../../utils/wssConnection/wssConnection';
import { setUsername as saveUsername } from '../../store/dashboardSlice';
import axios from 'axios';

const useStyles = makeStyles({
  drawer: {
    width: '300px',
    color: 'white',
  },
  drawerPaper: {
    width: '300px',
  },
  grid: {
    height: '230px',
  },
  avatar: {
    width: '90px',
    height: '90px',
  },
});

const Drawer = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const username = useSelector((state) => state.dashboard.username);
  const handleDrawerToggle = () => setMobileOpen(!mobileOpen);

  const dispatch = useDispatch();
  const history = useHistory();
  const classes = useStyles();

  const logInButton = () => {
    if (!username) {
      history.push('/home');
    } else {
      history.push('/home');
      dispatch(saveUsername(''));
      userLogout();
      axios
        .get('users/logout')
        .then((response) => {
          console.log(response);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };

  const drawerMenu = (
    <>
      <Grid
        container
        direction="column"
        justifyContent="space-evenly"
        alignItems="center"
        className={classes.grid}
      >
        {username && <Avatar className={classes.avatar} src={userAvatar} />}
        <Typography variant="h5">{username}</Typography>
        <Button
          variant="outlined"
          size="small"
          className={classes.button}
          startIcon={<ExitToAppIcon />}
          onClick={logInButton}
        >
          {username ? 'Wyloguj się' : 'Zaloguj się'}
        </Button>
      </Grid>
      <List>
        <ListItem button component={Link} to="/EnterRoom">
          <ListItemIcon>
            <MeetingRoomIcon color="primary" />
          </ListItemIcon>
          <ListItemText primary="Dołącz do pokoju" />
        </ListItem>
        <ListItem button component={Link} to="/CreateRoom">
          <ListItemIcon>
            <MeetingRoomIcon color="secondary" />
          </ListItemIcon>
          <ListItemText primary="Załóż pokój" />
        </ListItem>
        <ListItem button component={Link} to="/Settings">
          <ListItemIcon>
            <SettingsIcon />
          </ListItemIcon>
          <ListItemText primary="Ustawienia" />
        </ListItem>
        <ListItem button component={Link} to="/Rooms">
          <ListItemIcon>
            <EventIcon />
          </ListItemIcon>
          <ListItemText primary="Dostępne szkolenia" />
        </ListItem>
        <ListItem button component={Link} to="/Contacts">
          <ListItemIcon>
            <ContactsIcon />
          </ListItemIcon>
          <ListItemText primary="Kontakty" />
        </ListItem>
        <Hidden lgUp implementation="css">
          <IconButton
            onClick={handleDrawerToggle}
            style={{ marginLeft: '120px' }}
          >
            <CloseIcon fontSize="large" />
          </IconButton>
        </Hidden>
        <Divider />
        <ListItem button component={Link} to="/">
          <ListItemText primary="Home" />
        </ListItem>
      </List>
    </>
  );

  return (
    <nav>
      <Hidden lgUp implementation="css">
        <IconButton
          onClick={handleDrawerToggle}
          style={{ position: 'absolute', top: '5px', left: '5px' }}
        >
          <MenuIcon fontSize="large" />
        </IconButton>
      </Hidden>
      <Hidden mdUp implementation="css">
        <MUIDrawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          className="drawerMenu"
          classes={{
            paper: classes.drawerPaper,
          }}
        >
          {drawerMenu}
        </MUIDrawer>
      </Hidden>
      <Hidden mdDown implementation="css">
        <MUIDrawer
          className="drawerMenu"
          variant="permanent"
          classes={{
            paper: classes.drawerPaper,
          }}
          open
        >
          {drawerMenu}
        </MUIDrawer>
      </Hidden>
    </nav>
  );
};

export default Drawer;
