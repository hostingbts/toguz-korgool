import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useFullscreen } from '../contexts/FullscreenContext';
import { io } from 'socket.io-client';
import { initializeBoard, PLAYERS, makeMove } from '../game/gameLogic';
import GameBoard from './GameBoard';
import './OnlineGame.css';

const SERVER_URL = process.env.REACT_APP_SERVER_URL || 'http://localhost:5000';

function OnlineGame({ onBack }) {
  const { t } = useTranslation();
  const { isMobile, enterFullscreen, exitFullscreen } = useFullscreen();
  const [socket, setSocket] = useState(null);
  const [roomCode, setRoomCode] = useState('');
  const [gameState, setGameState] = useState('menu'); // menu, waiting, playing
  const [board, setBoard] = useState(null);
  const [playerColor, setPlayerColor] = useState(null);
  const [opponentName, setOpponentName] = useState('');
  const [connectionStatus, setConnectionStatus] = useState('disconnected');
  const [inputRoomCode, setInputRoomCode] = useState('');
  const socketRef = useRef(null);

  // Enter fullscreen when game starts playing on mobile
  useEffect(() => {
    if (gameState === 'playing' && isMobile) {
      enterFullscreen();
    }
  }, [gameState, isMobile, enterFullscreen]);

  // Exit fullscreen when component unmounts
  useEffect(() => {
    return () => {
      if (isMobile) {
        exitFullscreen();
      }
    };
  }, [isMobile, exitFullscreen]);

  const handleBack = () => {
    if (isMobile) {
      exitFullscreen();
    }
    onBack();
  };

  useEffect(() => {
    const newSocket = io(SERVER_URL, {
      transports: ['websocket', 'polling']
    });

    socketRef.current = newSocket;
    setSocket(newSocket);

    newSocket.on('connect', () => {
      setConnectionStatus('connected');
    });

    newSocket.on('disconnect', () => {
      setConnectionStatus('disconnected');
    });

    newSocket.on('roomCreated', (data) => {
      setRoomCode(data.roomCode);
      setGameState('waiting');
      setPlayerColor(PLAYERS.WHITE);
    });

    newSocket.on('roomJoined', (data) => {
      setRoomCode(data.roomCode);
      setGameState('playing');
      setPlayerColor(PLAYERS.BLACK);
      setBoard(data.board || initializeBoard());
      setOpponentName(data.opponentName || 'Opponent');
    });

    newSocket.on('playerJoined', (data) => {
      setGameState('playing');
      setBoard(data.board || initializeBoard());
      setOpponentName(data.playerName || 'Opponent');
    });

    newSocket.on('playerLeft', () => {
      setGameState('waiting');
      setOpponentName('');
    });

    newSocket.on('move', (data) => {
      if (data.board) {
        setBoard(data.board);
      }
    });

    newSocket.on('gameError', (error) => {
      console.error('Game error:', error);
      alert(error.message || 'An error occurred');
    });

    return () => {
      newSocket.close();
    };
  }, []);

  const handleCreateRoom = () => {
    if (socket) {
      socket.emit('createRoom', { playerName: 'Player 1' });
    }
  };

  const handleJoinRoom = () => {
    if (socket && inputRoomCode.trim()) {
      socket.emit('joinRoom', { 
        roomCode: inputRoomCode.trim(),
        playerName: 'Player 2'
      });
    }
  };

  const handleMove = (newBoard) => {
    if (socket && roomCode) {
      socket.emit('move', {
        roomCode,
        board: newBoard,
        player: playerColor
      });
      setBoard(newBoard);
    }
  };

  const handleNewGame = () => {
    if (socket && roomCode) {
      const newBoard = initializeBoard();
      socket.emit('newGame', {
        roomCode,
        board: newBoard
      });
      setBoard(newBoard);
    }
  };

  if (gameState === 'menu') {
    return (
      <div className="online-game-menu">
        <div className="menu-card">
          <h2>{t('game.playOnline')}</h2>
          
          <div className="connection-status">
            <span className={`status-indicator ${connectionStatus}`}></span>
            <span>{connectionStatus === 'connected' ? t('game.connecting') : t('game.disconnected')}</span>
          </div>

          {connectionStatus === 'disconnected' && (
            <div className="offline-message">
              <p className="offline-title">{t('game.onlineUnavailable')}</p>
              <p className="offline-details">{t('game.onlineUnavailableDetails')}</p>
            </div>
          )}

          <div className="menu-options">
            <button onClick={handleCreateRoom} className="btn" disabled={connectionStatus !== 'connected'}>
              {t('game.createRoom')}
            </button>

            <div className="join-section">
              <input
                type="text"
                placeholder={t('game.enterRoomCode')}
                value={inputRoomCode}
                onChange={(e) => setInputRoomCode(e.target.value)}
                className="room-code-input"
                disabled={connectionStatus !== 'connected'}
              />
              <button 
                onClick={handleJoinRoom} 
                className="btn btn-secondary"
                disabled={connectionStatus !== 'connected' || !inputRoomCode.trim()}
              >
                {t('game.joinRoom')}
              </button>
            </div>
          </div>

          <button onClick={handleBack} className="btn btn-secondary">
            {t('common.close')}
          </button>
        </div>
      </div>
    );
  }

  if (gameState === 'waiting') {
    return (
      <div className="online-game-waiting">
        <div className="waiting-card">
          <h2>{t('game.waitingForPlayer')}</h2>
          <div className="room-code-display">
            <p>{t('game.roomCode')}:</p>
            <div className="room-code">{roomCode}</div>
            <button 
              onClick={() => navigator.clipboard.writeText(roomCode)}
              className="btn btn-secondary"
            >
              Copy Code
            </button>
          </div>
          <button onClick={handleBack} className="btn">
            {t('common.close')}
          </button>
        </div>
      </div>
    );
  }

  if (!board) {
    return <div>Loading game...</div>;
  }

  const currentPlayer = board.currentPlayer;
  const disabled = currentPlayer !== playerColor || board.gameOver;

  return (
    <div className="online-game">
      <div className="game-header">
        <div className="player-info-online">
          <div className={`player-badge ${playerColor === PLAYERS.WHITE ? 'active' : ''}`}>
            {t('game.whitePlayer')} {playerColor === PLAYERS.WHITE ? '(You)' : `(${opponentName})`}
          </div>
          <div className={`player-badge ${playerColor === PLAYERS.BLACK ? 'active' : ''}`}>
            {t('game.blackPlayer')} {playerColor === PLAYERS.BLACK ? '(You)' : `(${opponentName})`}
          </div>
        </div>
        <div className="game-actions">
          <button onClick={handleNewGame} className="btn btn-secondary">
            {t('common.newGame')}
          </button>
          <button onClick={handleBack} className="btn btn-secondary">
            {t('common.close')}
          </button>
        </div>
      </div>

      <GameBoard
        board={board}
        onMove={handleMove}
        currentPlayer={currentPlayer}
        gameMode="online"
        playerColor={playerColor}
        disabled={disabled}
      />
    </div>
  );
}

export default OnlineGame;


