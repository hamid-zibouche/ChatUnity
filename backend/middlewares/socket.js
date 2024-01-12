// socket.js
const socketIo = require('socket.io');

function configureSockets(server) {
  const io = socketIo(server);

  io.on('connection', (socket) => {
    console.log('Nouvelle connexion socket:', socket.id);

    // Gérer les événements ici
    // Par exemple, écouter les messages du client
    socket.on('clientMessage', (data) => {
      console.log('Message reçu du client:', data);
    });

    socket.on('disconnect', () => {
      console.log('Déconnexion socket:', socket.id);
    });
  });

  return io;
}

module.exports = configureSockets;