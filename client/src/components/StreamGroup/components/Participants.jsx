import React from 'react';

const Participants = ({ participantsSlideChecked }) => {
  return (
    <Slide
      direction="left"
      in={participantsSlideChecked}
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
        <Box
          display="flex"
          flexDirection="column"
          justifyContent="space-between"
          alignItems="center"
          style={{ width: '100%', height: '100%' }}
        >
          <Typography variant="h2" component="h1">
            Uczestnicy
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
            ></List>
          </Box>
        </Box>
      </Box>
    </Slide>
  );
};

export default Participants;
