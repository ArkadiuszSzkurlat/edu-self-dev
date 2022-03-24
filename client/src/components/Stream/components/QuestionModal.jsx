import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
  Modal,
  Button,
  IconButton,
  Paper,
  Typography,
  TextField,
  Box,
} from '@material-ui/core';
import SendIcon from '@material-ui/icons/Send';
import LiveHelpOutlinedIcon from '@material-ui/icons/LiveHelpOutlined';
import CloseIcon from '@material-ui/icons/Close';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';

const useStyles = makeStyles((theme) => ({
  paper: {
    position: 'absolute',
    width: '400px',
    height: '200px',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(4, 5),
    bottom: '0',
    left: '0',
  },
  question: {
    background: 'white',
    width: '150px',
    height: '50px',
    position: 'absolute',
    left: '0',
    bottom: '0',
  },
}));

const QuestionModal = () => {
  const classes = useStyles();
  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const question = (
    <Paper className={classes.paper}>
      <Box
        display="flex"
        flexDirection="column"
        justifyContent="space-between"
        alignItems="flex-start"
        style={{ height: '100%' }}
      >
        <IconButton
          style={{ position: 'absolute', right: '5px', top: '5px' }}
          onClick={handleClose}
        >
          <CloseIcon />
        </IconButton>
        <Typography variant="h5" component="h3">
          Zadaj pytanie prowadzącemu
        </Typography>
        <TextField
          multiline
          rows="3"
          rowsMax="3"
          variant="outlined"
          label="Treść pytania"
          fullWidth
        />
        <Button
          component={Box}
          alignSelf="flex-end"
          justifySelf="flex-end"
          variant="contained"
          color="primary"
          endIcon={<SendIcon />}
          size="large"
        >
          Zapytaj
        </Button>
      </Box>
    </Paper>
  );

  return (
    <div>
      <Button
        variant="contained"
        className={classes.question}
        startIcon={<LiveHelpOutlinedIcon />}
        onClick={handleOpen}
        disabled
      >
        Zapytaj
      </Button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={open}>{question}</Fade>
      </Modal>
    </div>
  );
};

export default QuestionModal;
