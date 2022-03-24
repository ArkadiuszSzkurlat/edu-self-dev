import React, { useState, useEffect, useRef } from 'react';
import {
  IconButton,
  Slide,
  Paper,
  Typography,
  Box,
  Button,
  TextField,
  List,
  FormControl,
  ButtonGroup,
} from '@material-ui/core';
// Icons
import ChatIcon from '@material-ui/icons/Chat';
import SendIcon from '@material-ui/icons/Send';
import PersonIcon from '@material-ui/icons/Person';
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';
import { useDispatch, useSelector } from 'react-redux';
import './RightNav.css';

import ChatMessage from './chat/ChatMessage';

import * as wss from '../../../utils/wssConnection/wssConnection';

const RightNav = ({ setVideoWidth, setChatWidth, chatWidth }) => {
  const [checked, setChecked] = useState(false);
  const [typeOfSlide, setTypeOfSlide] = useState('chat');
  const [newMessage, setNewMessage] = useState(false);

  const changeWidthVideoAndChat = (checked) => {
    if (dimensions.width >= 1920) {
      if (!checked) {
        setVideoWidth('80vw');
        setChatWidth('20vw');
      } else if (checked) {
        setVideoWidth('100vw');
      }
    } else if (dimensions.width < 1920 && dimensions.width >= 1280) {
      if (!checked) {
        setVideoWidth('75vw');
        setChatWidth('25vw');
      } else if (checked) {
        setVideoWidth('100vw');
      }
    } else if (dimensions.width < 1280 && dimensions.width >= 960) {
      if (!checked) {
        setVideoWidth('70vw');
        setChatWidth('30vw');
      } else if (checked) {
        setVideoWidth('100vw');
      }
    } else if (dimensions.width < 960 && dimensions.width >= 600) {
      if (!checked) {
        setVideoWidth('50vw');
        setChatWidth('50vw');
      } else if (checked) {
        setVideoWidth('100vw');
      }
    } else if (dimensions.width < 600) {
      if (!checked) {
        setVideoWidth('0vw');
        setChatWidth('100vw');
      } else if (checked) {
        setVideoWidth('100vw');
      }
    }
  };

  const [dimensions, setDimensions] = useState({
    width: window.innerWidth,
  });

  useEffect(() => {
    const debouncedHandleResize = debounce(function handleResize() {
      setDimensions({
        width: window.innerWidth,
      });
      changeWidthVideoAndChat(!checked);
    }, 50);

    window.addEventListener('resize', debouncedHandleResize);

    return (_) => {
      window.removeEventListener('resize', debouncedHandleResize);
    };
  });

  function debounce(fn, ms) {
    let timer;
    return (_) => {
      clearTimeout(timer);
      timer = setTimeout((_) => {
        timer = null;
        fn.apply(this, arguments);
      }, ms);
    };
  }

  const handleChange = () => {
    setChecked((prev) => !prev);
    if (typeOfSlide === 'chat') {
      setNewMessage(false);
    }
    if (checked === true) {
      changeWidthVideoAndChat(checked);
    } else if (checked === false) {
      changeWidthVideoAndChat(checked);
    }
  };

  const [message, setMessage] = useState(null);

  const messagesEndRef = useRef(null);

  const inputHandler = (e) => {
    setMessage(e.target.value);
  };

  const groupChatMessages = useSelector(
    (state) => state.call.groupChatMessages
  );
  const username = useSelector((state) => state.dashboard.username);
  const groupCallUsers = useSelector((state) => state.call.groupCallUsers);
  const groupCallRoomId = useSelector(
    (state) => state.dashboard.groupCallRoomId
  );

  const messageAdd = () => {
    const messageData = {
      roomId: groupCallRoomId,
      message: { text: message, sender: username },
    };
    if (messageData) {
      wss.addGroupChatMessage(messageData);
      setMessage('');
    }
  };

  const messageAddOnKeyPress = (event) => {
    if (event.key === 'Enter') {
      const messageData = {
        roomId: groupCallRoomId,
        message: { text: message, sender: username },
      };
      wss.addGroupChatMessage(messageData);
      setMessage('');
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current.scrollTop = messagesEndRef.current.scrollHeight;
  };

  useEffect(() => {
    if (groupChatMessages.length > 0) {
      setNewMessage(true);
    }
    if (groupChatMessages.length > 0 && messagesEndRef.current !== null)
      scrollToBottom();
  }, [groupChatMessages]);

  return (
    <div>
      <ButtonGroup size="large" orientation="vertical" className="buttonGroup">
        <IconButton
          style={{ height: '75px', borderRadius: '10px 0px 0px 0px' }}
          onClick={() => {
            setTypeOfSlide('chat');
            handleChange();
          }}
        >
          <ChatIcon />
        </IconButton>
        <IconButton
          style={{ height: '75px', borderRadius: '0px 0px 0px 10px' }}
          onClick={() => {
            setTypeOfSlide('participants');
            handleChange();
          }}
        >
          <PersonIcon />
          <Typography variant="body1">
            {groupCallUsers ? groupCallUsers.length : '0'}
          </Typography>
        </IconButton>
      </ButtonGroup>
      <Slide
        // INNLINE STYLING ONLY WORKS
        direction="left"
        in={checked}
        mountOnEnter
        unmountOnExit
      >
        <Box
          component={Paper}
          display="flex"
          style={{
            height: '100%',
            width: chatWidth,
            right: '0',
            position: 'absolute',
            zIndex: '50',
          }}
        >
          <IconButton
            className="iconButton"
            color="secondary"
            onClick={handleChange}
          >
            <ArrowForwardIosIcon />
          </IconButton>
          {typeOfSlide === 'chat' ? (
            <Box
              display="flex"
              flexDirection="column"
              justifyContent="space-between"
              alignItems="center"
              style={{ width: '100%', height: '100%' }}
            >
              <Typography variant="h3" component="h1">
                Czat
              </Typography>
              <Box
                display="flex"
                flexDirection="column"
                justifyContent="flex-end"
                alignItems="center"
                style={{
                  height: '80%',
                  width: '90%',
                  marginBottom: '30px',
                }}
              >
                <List
                  style={{
                    width: '100%',
                    height: '100%',
                    overflowY: 'scroll',
                    scrollBehavior: 'smooth',
                  }}
                  ref={messagesEndRef}
                >
                  {groupChatMessages &&
                    groupChatMessages.map((message) => (
                      <ChatMessage
                        TextMessage={message.text}
                        sender={message.sender}
                        username={username}
                      />
                    ))}
                </List>
                <FormControl onKeyPress={messageAddOnKeyPress}>
                  <TextField
                    multiline
                    rows="3"
                    rowsMax="3"
                    variant="outlined"
                    label="Wiadomość"
                    fullWidth
                    value={message}
                    onChange={inputHandler}
                    style={{ marginBottom: '15px' }}
                  />
                  <Button
                    component={Box}
                    variant="contained"
                    color="primary"
                    endIcon={<SendIcon />}
                    alignSelf="flex-end"
                    onClick={messageAdd}
                  >
                    Wyślij
                  </Button>
                </FormControl>
              </Box>
            </Box>
          ) : (
            <Box
              display="flex"
              flexDirection="column"
              gap="10px"
              alignItems="center"
              style={{ width: '100%', height: '100%' }}
            >
              <Typography variant="h3" component="h1">
                Uczestnicy
              </Typography>
              {groupChatMessages &&
                groupCallUsers.map((user) => (
                  <Typography variant="h6">{user}</Typography>
                ))}
            </Box>
          )}
        </Box>
      </Slide>
    </div>
  );
};

export default RightNav;
