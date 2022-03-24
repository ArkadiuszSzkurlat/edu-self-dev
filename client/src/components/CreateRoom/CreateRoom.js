import React, { useEffect, useState } from 'react';
import Drawer from '../Drawer/Drawer';
import {
  ButtonGroup,
  TextField,
  Grid,
  Typography,
  Button,
} from '@material-ui/core';
import { useDispatch, useSelector } from 'react-redux';
import {
  setLocalCameraEnabled,
  setLocalMicrophoneEnabled,
} from '../../store/callSlice';
import { createNewGroupCall } from '../../utils/webRTC/webRTCGroupCallHandler';
import { callStates } from '../../store/callStates';
import { getLocalStream } from '../../utils/webRTC/webRTCHandler';
import { useHistory } from 'react-router-dom';
import Logo from '../Logo/Logo';

const CreateRoom = ({ smallerThan600px }) => {
  const call = useSelector((state) => state.call);
  const { callState, groupCallActive } = call;
  const [nameInput, setNameInput] = useState('');

  const dispatch = useDispatch();

  const history = useHistory();

  useEffect(() => {
    dispatch(setLocalCameraEnabled(true));
    dispatch(setLocalMicrophoneEnabled(true));
  }, []);

  const createRoomFunction = async () => {
    await getLocalStream();

    if (!groupCallActive && callState !== callStates.CALL_IN_PROGRESS) {
      await createNewGroupCall(nameInput);
      await history.push('/StreamGroup');
    }
  };

  return (
    <div>
      <Drawer />
      <Grid
        container
        direction="column"
        justifyContent="space-around"
        alignItems="center"
        style={{ height: '70vh', margin: '100px auto auto auto' }}
      >
        <Logo />
        <Typography variant="h4" component="h1">
          Utwórz pokój
        </Typography>

        <TextField
          label="Nazwa Szkolenia"
          value={nameInput}
          onChange={(e) => {
            setNameInput(e.target.value);
          }}
          variant="filled"
        />

        <ButtonGroup>
          <Button
            variant="contained"
            color="secondary"
            onClick={createRoomFunction}
          >
            Utwórz pokój
          </Button>
        </ButtonGroup>
      </Grid>
    </div>
  );
};

export default CreateRoom;
