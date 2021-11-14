const SOCKET_EVENTS = require('../config/socket.constants');
const { GAME, MESSAGE } = SOCKET_EVENTS;

module.exports = async function registerGameEventHandlers (roomId, gameManager, socketServer) {

  try {
    const socketsInRoom = await socketServer.in(roomId).fetchSockets();
    for (let socket of socketsInRoom) {

      socket.on(GAME.GAMESTATE_GET, () => {
        console.log('EVENT RECEIVED: ', GAME.GAMESTATE_GET);
        socketServer.to(roomId).emit(GAME.GAMESTATE_CHANGED, gameManager.getGameState());
      });

      socket.on(GAME.PLANNING.PLAY_CARD, (card, position) => {
        console.log('EVENT RECEIVED: ', GAME.PLANNING.PLAY_CARD);
        gameManager.playCard(card, position);
        socketServer.to(roomId).emit(GAME.GAMESTATE_CHANGED, gameManager.getGameState());
      });

      socket.on(GAME.RESOLUTION.QUEUE.NO_REVEAL, (qri) => {
        console.log('EVENT RECEIVED: ', GAME.RESOLUTION.QUEUE.NO_REVEAL);
        gameManager.dontRevealCard(qri);
        socketServer.to(roomId).emit(GAME.GAMESTATE_CHANGED, gameManager.getGameState());
      });

      socket.on(GAME.RESOLUTION.QUEUE.REVEAL, (qri) => {
        console.log('EVENT RECEIVED: ', GAME.RESOLUTION.QUEUE.REVEAL);
        gameManager.revealCard(qri);
        socketServer.to(roomId).emit(GAME.GAMESTATE_CHANGED, gameManager.getGameState());
      });

      socket.on(GAME.RESOLUTION.QUEUE.CONFIRM_TARGET, (qri) => {
        console.log('EVENT RECEIVED: ', GAME.RESOLUTION.QUEUE.CONFIRM_TARGET);
        gameManager.confirmTarget(qri);
        // socketServer.to(roomId).emit(GAME.GAMESTATE_CHANGED, gameManager.getGameState());
      });

      socket.on(MESSAGE.CREATE, (message) => {
        console.log('EVENT RECEIVED: ', MESSAGE.CREATE);
        console.log(message);
      });
    }
  } catch (err) {
    console.error('ERROR registerGameEventHandlers() : ', err);
  }
};