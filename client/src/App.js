import Home from './components/Home/Home';
import StartingScreen from './components/StartingScreen/StartingScreen';
import LogIn from './components/LogIn/LogIn';
import SignUp from './components/SignUp/SignUp';
import AsGuest from './components/AsGuest/AsGuest';
import EnterRoom from './components/EnterRoom/EnterRoom';
import CreateRoom from './components/CreateRoom/CreateRoom';
import Stream from './components/Stream/Stream';
import Contacts from './components/Contacts/Contacts';
import IncomingCallDialog from './components/IncomingCallDialog/IncomingCallDialog';
import CallingDialog from './components/CallingDialog/CallingDialog';
import CallRejectedDialog from './components/CallRejectedDialog/CallRejectedDialog';
import Rooms from './components/Rooms/Rooms';
import StreamGroup from './components/StreamGroup/StreamGroup';
import Settings from './components/Settings/Settings';
import { callStates } from './store/callStates';

import { Container } from '@material-ui/core';
import './App.css';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import {
  ThemeProvider,
  createTheme,
  makeStyles,
} from '@material-ui/core/styles';
import { red, cyan } from '@material-ui/core/colors';

import { connectWithWebSocket } from './utils/wssConnection/wssConnection';
import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import * as webRTCHandler from './utils/webRTC/webRTCHandler';
import * as webRTCGroupHandler from './utils/webRTC/webRTCGroupCallHandler';
import { useMediaQuery } from 'react-responsive';

const theme = createTheme({
  palette: {
    primary: {
      main: red[500],
    },
    secondary: {
      main: cyan[500],
    },
  },
});

const useStyles = makeStyles({
  container: {
    display: 'flex',
    height: '100vh',
    width: '100vw',
  },
});

function App() {
  const classes = useStyles();

  const callerUsername = useSelector((state) => state.call.callerUsername);
  const callState = useSelector((state) => state.call.callState);
  const rejected = useSelector((state) => state.call.callRejected.rejected);
  const callingDialogVisible = useSelector(
    (state) => state.call.callingDialogVisible
  );

  const smallerThan960px = useMediaQuery({ query: '(max-width: 960px)' });
  const smallerThan600px = useMediaQuery({ query: '(max-width: 600px)' });

  useEffect(() => {
    connectWithWebSocket();
    webRTCGroupHandler.connectWithMyPeer();
  }, []);

  // useEffect(() => {
  //   // Takes user camera and audio
  //   // webRTCHandler.getLocalStream();
  //   // Connect tu peer server (edu.self.herokuapp.com)
  //   webRTCGroupHandler.connectWithMyPeer();
  // }, []);

  return (
    <ThemeProvider theme={theme}>
      <div className={classes.container}>
        <Router>
          <Container fixed className="container">
            {callState === callStates.CALL_REQUESTED && (
              <>
                <IncomingCallDialog callerUsername={callerUsername} />
              </>
            )}
            {callingDialogVisible && <CallingDialog />}
            {rejected && <CallRejectedDialog />}
            <Switch>
              <Route path="/" exact>
                <StartingScreen smallerThan960px={smallerThan960px} />
              </Route>
              <Route path="/Home" component={LogIn}>
                <Home smallerThan960px={smallerThan960px} />
              </Route>
              <Route path="/LogIn" component={LogIn}></Route>
              <Route path="/SignUp" component={SignUp}></Route>
              <Route path="/AsGuest" component={AsGuest}></Route>
              <Route path="/EnterRoom" component={EnterRoom}>
                <EnterRoom smallerThan600px={smallerThan600px} />
              </Route>
              <Route path="/CreateRoom" component={CreateRoom}>
                <CreateRoom smallerThan600px={smallerThan600px} />
              </Route>
              <Route path="/Stream">
                <Stream
                  smallerThan960px={smallerThan960px}
                  smallerThan600px={smallerThan600px}
                />
              </Route>
              <Route path="/StreamGroup">
                <StreamGroup
                  smallerThan960px={smallerThan960px}
                  smallerThan600px={smallerThan600px}
                />
              </Route>
              <Route path="/Contacts">
                <Contacts
                  smallerThan960px={smallerThan960px}
                  smallerThan600px={smallerThan600px}
                ></Contacts>
              </Route>
              <Route path="/Rooms" component={Rooms}></Route>
              <Route path="/Settings" component={Settings}></Route>
            </Switch>
          </Container>
        </Router>
      </div>
    </ThemeProvider>
  );
}

export default App;
