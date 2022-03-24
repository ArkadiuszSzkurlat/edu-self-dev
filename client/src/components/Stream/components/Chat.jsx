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
} from '@material-ui/core';
// Icons
import ChatIcon from '@material-ui/icons/Chat';
import SendIcon from '@material-ui/icons/Send';
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';
import { useDispatch, useSelector } from 'react-redux';
import './chat.css';

import ChatMessage from './chat/ChatMessage';

import { addNewChatMessage } from '../../../utils/webRTC/webRTCHandler';
import { addChatMessage } from '../../../store/callSlice';

const Chat = ({ setVideoWidth, setChatWidth, chatWidth }) => {
  const [checked, setChecked] = useState(false);
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

    setNewMessage(false);
    if (checked === true) {
      changeWidthVideoAndChat(checked);
    } else if (checked === false) {
      changeWidthVideoAndChat(checked);
    }
  };

  const [message, setMessage] = useState(null);

  const chatMessages = useSelector((state) => state.call.chatMessages);
  const dispatch = useDispatch();

  const messagesEndRef = useRef(null);

  const inputHandler = (e) => {
    setMessage(e.target.value);
  };

  const username = useSelector((state) => state.dashboard.username);

  const messageAdd = () => {
    const messageData = { text: message, sender: username };
    dispatch(addChatMessage(messageData));
    addNewChatMessage(messageData);
    setMessage('');
  };

  const messageAddOnKeyPress = (event) => {
    if (event.key === 'Enter') {
      const messageData = { text: message, sender: username };
      dispatch(addChatMessage(messageData));
      addNewChatMessage(messageData);
      setMessage('');
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current.scrollTop = messagesEndRef.current.scrollHeight;
  };

  useEffect(() => {
    if (chatMessages.length > 0) {
      setNewMessage(true);
    }

    if (chatMessages.length > 0 && messagesEndRef.current !== null)
      scrollToBottom();
  }, [chatMessages]);

  return (
    <>
      <IconButton
        className={newMessage ? 'chatIcon newMessage' : 'chatIcon'}
        onClick={handleChange}
      >
        <ChatIcon />
      </IconButton>
      <Slide direction="left" in={checked} mountOnEnter unmountOnExit>
        <Box
          component={Paper}
          display="flex"
          style={{
            height: '100%',
            width: chatWidth,
            right: '0',
            position: 'absolute',
          }}
        >
          <IconButton
            className="iconButton"
            color="secondary"
            onClick={handleChange}
          >
            <ArrowForwardIosIcon />
          </IconButton>
          <Box
            display="flex"
            flexDirection="column"
            justifyContent="space-between"
            alignItems="center"
            style={{ width: '100%', height: '100%' }}
          >
            <Typography variant="h2" component="h1">
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
                  overflowY: 'auto',
                  scrollBehavior: 'smooth',
                }}
                ref={messagesEndRef}
              >
                {chatMessages.map((message) => (
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
        </Box>
      </Slide>
    </>
  );
};

export default Chat;
