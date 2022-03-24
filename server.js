'use strict';
const path = require('path');
const express = require('express');
const socket = require('socket.io');
const { ExpressPeerServer } = require('peer');
const groupCallHandler = require('./groupCallHandler');
const { v4: uuidv4 } = require('uuid');
const cors = require('cors');
const userRouter = require('./routes/userRoutes');
var enforce = require('express-sslify');

require('./database');
// H12
var cookieParser = require('cookie-parser');
var timeout = require('connect-timeout');

const PORT = process.env.PORT || 5000;
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Resolved H12 error
app.use(timeout('5s'));
app.use(express());
app.use(haltOnTimedout);
app.use(cookieParser());
app.use(haltOnTimedout);

// fix cors problem
app.use(cors());

app.use(enforce.HTTPS({ trustProtoHeader: true }));
// ANCHOR SSL THings

// server use build version of app
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.resolve(__dirname, './client/build')));
  // Step 2:
  app.get('*', function (request, response) {
    response.sendFile(path.resolve(__dirname, './client/build', 'index.html'));
  });
}

const server = app.listen(process.env.PORT || 5000, () => {
  console.log(`server is listening on port ${PORT}`);
});

app.use('/users', userRouter);

module.exports = app;
//
function haltOnTimedout(req, res, next) {
  if (!req.timedout) next();
}
//

process.on('SIGTERM', () => {
  console.log('halo');
  server.close(() => {
    console.log('zakonczono proces');
  });
});

// If we want info about ice candidates etc. debug :true
const options = {
  debug: false,
};

const peerServer = ExpressPeerServer(server, options);

app.use('/peerjs', peerServer);

groupCallHandler.createPeerServerListeners(peerServer);

const io = socket(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

let peers = [];
let groupCallRooms = [];
let peerId = '';

const broadcastEventTypes = {
  ACTIVE_USERS: 'ACTIVE_USERS',
  GROUP_CALL_ROOMS: 'GROUP_CALL_ROOMS',
};

io.on('connection', (socket) => {
  socket.emit('connection', null);
  console.log('new user connected');
  console.log(socket.id);

  socket.emit('list-of-users', peers);

  socket.on('register-new-user', (data) => {
    peers.push({
      username: data.username,
      peerId: data.peerId,
      socketID: data.socketID,
    });
    console.log('registered new user');

    io.sockets.emit('broadcast', {
      event: broadcastEventTypes.ACTIVE_USERS,
      activeUsers: peers,
    });

    io.sockets.emit('broadcast', {
      event: broadcastEventTypes.GROUP_CALL_ROOMS,
      groupCallRooms,
    });
  });

  socket.on('disconnect', () => {
    console.log('user disconnected');

    peerId = peers.find((peer) => peer.socketID === socket.id);
    peers = peers.filter((peer) => peer.socketID !== socket.id);

    if (typeof peerId != 'undefined') {
      io.sockets.emit('broadcast', {
        event: broadcastEventTypes.ACTIVE_USERS,
        activeUsers: peers,
        socketID: socket.id,
        peerId: peerId.peerId,
      });
    }

    groupCallRooms = groupCallRooms.filter(
      (room) => room.socketID !== socket.id
    );

    // io.sockets.emit("broadcast", {
    //   event: broadcastEventTypes.DELETE_PEER,
    //   socketID: socket.id,
    // });

    io.sockets.emit('broadcast', {
      event: broadcastEventTypes.GROUP_CALL_ROOMS,
      groupCallRooms,
    });
  });

  socket.on('user-logout', () => {
    peerId = peers.find((peer) => peer.socketID === socket.id);
    peers = peers.filter((peer) => peer.socketID !== socket.id);

    if (typeof peerId != 'undefined') {
      io.sockets.emit('broadcast', {
        event: broadcastEventTypes.ACTIVE_USERS,
        activeUsers: peers,
        socketID: socket.id,
        peerId: peerId.peerId,
      });
    }

    groupCallRooms = groupCallRooms.filter(
      (room) => room.socketID !== socket.id
    );

    // io.sockets.emit("broadcast", {
    //   event: broadcastEventTypes.DELETE_PEER,
    //   socketID: socket.id,
    // });

    io.sockets.emit('broadcast', {
      event: broadcastEventTypes.GROUP_CALL_ROOMS,
      groupCallRooms,
    });
  });
  // listeners related with direct call

  socket.on('pre-offer', (data) => {
    io.to(data.callee.socketID).emit('pre-offer', {
      callerUsername: data.caller.username,
      callerSocketID: socket.id,
    });
  });

  socket.on('pre-offer-answer', (data) => {
    io.to(data.callerSocketID).emit('pre-offer-answer', {
      answer: data.answer,
    });
  });

  socket.on('peer-signal', (data) => {
    io.to(data.to).emit('peer-signal', data);
  });

  socket.on('user-hanged-up', (data) => {
    io.emit('user-hanged-up', data);
  });

  socket.on('new-chat-message', (data) => {
    io.to(data.connectedUserSocketID).emit('new-chat-message', data);
  });

  socket.on('group-call-register', (data) => {
    console.log('nowy room');
    const roomId = uuidv4();
    socket.join(roomId);

    const newGroupCallRoom = {
      peerId: data.peerId,
      hostName: data.username,
      socketID: socket.id,
      roomId: roomId,
      roomName: data.roomName,
    };

    groupCallRooms.push(newGroupCallRoom);

    io.emit('broadcast', {
      event: broadcastEventTypes.GROUP_CALL_ROOMS,
      groupCallRooms,
    });
  });

  socket.on('group-call-join-request', (data) => {
    console.log('join request');
    io.to(data.roomId).emit('group-call-join-request', {
      peerId: data.peerId,
      streamId: data.streamId,
      socketID: data.socketID,
      username: data.username,
    });

    const activeGroupCall = groupCallRooms.findIndex(
      (group) => group.roomId === data.roomId
    );

    if (groupCallRooms[activeGroupCall].messages) {
      console.log('ściąganie wiadomości');

      socket.emit(
        'download-messages',
        groupCallRooms[activeGroupCall].messages
      );
    }

    socket.join(data.roomId);
  });

  socket.on('group-call-user-left', (data) => {
    io.to(data.roomId).emit('group-call-user-left', data);
    socket.leave(data.roomId);
  });

  socket.on('group-call-closed-by-host', (data) => {
    groupCallRooms = groupCallRooms.filter(
      (room) => room.peerId !== data.peerId
    );

    io.sockets.emit('broadcast', {
      event: broadcastEventTypes.GROUP_CALL_ROOMS,
      groupCallRooms,
    });
  });

  socket.on('add-group-chat-message', (data) => {
    const activeGroupCall = groupCallRooms.findIndex(
      (group) => group.roomId === data.roomId
    );

    let newGroupCallRoomMessages = groupCallRooms[activeGroupCall].messages
      ? groupCallRooms[activeGroupCall].messages
      : [];
    newGroupCallRoomMessages.push(data.message);

    groupCallRooms[activeGroupCall].messages = newGroupCallRoomMessages;

    io.to(data.roomId).emit('add-group-chat-message', data.message);
  });
});


