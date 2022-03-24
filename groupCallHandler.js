const createPeerServerListeners = (peerServer) => {
  peerServer.on('connection', (client) => {
    console.log('succesfully connected to peer js server');
    console.log(client.id);
  });
  peerServer.on('disconnected', (client) => {
    console.log(`${client.id} disconnected`);
  });
};

module.exports = {
  createPeerServerListeners,
};
