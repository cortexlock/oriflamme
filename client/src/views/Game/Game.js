import React, { useState, useEffect, useContext } from 'react';

import './Game.css';
import OpponentArea from '../../molecules/OpponentArea/OpponentArea';
import Queue from '../../organisms/Queue/Queue';
import PlayerArea from '../../molecules/PlayerArea/PlayerArea';
import Status from '../../molecules/Status/Status.js';
import Messages from '../../organisms/Messages/Messages';
import Loading from '../../atoms/Loading/Loading';

import { SOCKET_EVENTS } from '../../config/socket.constants';
import { UserContext } from '../../context/user.context';
import { CardsProvider } from '../../context/cards.context';

// TODO: remove
// import { gameState as fixedGameState } from '../../mocks/gamestate.mocks';
import { cards } from '../../mocks/cards.mocks';

const { LOBBY, GAME } = SOCKET_EVENTS;

export default function Game (props) {

  const { socket } = props;
  // const { activeRoomId, leaveRoom, socket } = props;

  // "METHODS"

  const onPlayerCardClicked = (card) => {
    setSelectedPlayerCard(card);
  }

  // const onAddToQueue = () => {

  // }

  const handleGameStateChanged = (newGameState) => {
    console.log('EVENT RECEIVED: ', GAME.GAMESTATE_CHANGED);
    setGameState(newGameState);
    if (loading) {
      setLoading(false);
    }
  }

  useEffect(() => {

    // socket.registerListener(GAME.ROUND_START, handleRoundStart);
    // TODO: change to cleanup useEffect to unregister listener
    socket.registerListener(GAME.GAMESTATE_CHANGED, handleGameStateChanged);
    socket.registerOneShotListener(LOBBY.GAME_STARTED, () => {
      socket.getGameState();
    });

    return function teardownListeners() {
      // TODO: all the others
      socket.unregisterListeners(GAME.GAMESTATE_CHANGED);
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // TODO: review this
  const [loading, setLoading] = useState(true);
  const [gameState, setGameState] = useState(null);
  const [messages, setMessages] = useState([]);
  const [selectedPlayerCard, setSelectedPlayerCard] = useState(null);

  const [user] = useContext(UserContext);
  // const [messages, setMessages] = useState({});

  return (
    <div className="game">
      {
        loading ?
        <Loading message={"Starting game..."} /> :
        null
      }
      {
        !loading && gameState ?
          <CardsProvider value={[cards, onPlayerCardClicked]} >
            <div className="game__table">
              <div className="game__opponents">
                <OpponentArea gameState={gameState} />
              </div>
              <div className="game__queue">
                <Queue
                  gameState={gameState}
                  selectedPlayerCard={selectedPlayerCard}
                />
              </div>
              <div className="game__player">
                <PlayerArea gameState={gameState} />
              </div>
            </div>
            <div className="game__sidebar">
              <div className="game__status">
                <Status
                  gameState={gameState}
                  selectedPlayerCard={selectedPlayerCard}
                  user={user}
                />
              </div>
              <div className="game__messages">
                <Messages
                  messages={messages}
                  players={gameState.players}
                  socket={socket}
                />
              </div>
            </div>
          </CardsProvider> :
          null
      }
    </div>
  );
}

