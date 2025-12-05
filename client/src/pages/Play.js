import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useFullscreen } from '../contexts/FullscreenContext';
import { initializeBoard, PLAYERS, GAME_MODES, makeMove } from '../game/gameLogic';
import { getAIMove, DIFFICULTY_LEVELS } from '../game/ai';
import GameBoard from '../components/GameBoard';
import GameModeSelector from '../components/GameModeSelector';
import OnlineGame from '../components/OnlineGame';
import './Play.css';

function Play() {
  const { t } = useTranslation();
  const { isMobile, enterFullscreen, exitFullscreen } = useFullscreen();
  const [gameMode, setGameMode] = useState(null);
  const [board, setBoard] = useState(null);
  const [playerColor, setPlayerColor] = useState(PLAYERS.WHITE);
  const [difficulty, setDifficulty] = useState(DIFFICULTY_LEVELS.MEDIUM);
  const [moveHistory, setMoveHistory] = useState([]);
  const [isAITurn, setIsAITurn] = useState(false);
  const boardRef = useRef(null);

  useEffect(() => {
    if (gameMode && !board) {
      const newBoard = initializeBoard();
      setBoard(newBoard);
      setMoveHistory([]);
      // Enter fullscreen on mobile when game starts
      if (isMobile) {
        enterFullscreen();
      }
    }
  }, [gameMode, board, isMobile, enterFullscreen]);

  // Exit fullscreen when leaving game
  useEffect(() => {
    return () => {
      if (isMobile) {
        exitFullscreen();
      }
    };
  }, [isMobile, exitFullscreen]);

  const handleMove = (newBoard) => {
    setBoard(newBoard);
    setMoveHistory([...moveHistory, newBoard]);

    // If playing vs computer and it's AI's turn, make AI move
    if (gameMode === GAME_MODES.VS_COMPUTER && newBoard.currentPlayer !== playerColor && !newBoard.gameOver) {
      setIsAITurn(true);
      getAIMove(newBoard, newBoard.currentPlayer, difficulty).then((aiMove) => {
        if (aiMove !== null && !newBoard.gameOver) {
          try {
            const aiBoard = makeMove(newBoard, aiMove, newBoard.currentPlayer);
            setBoard(aiBoard);
            setMoveHistory([...moveHistory, newBoard, aiBoard]);
            setIsAITurn(false);
          } catch (error) {
            console.error('AI move error:', error);
            setIsAITurn(false);
          }
        } else {
          setIsAITurn(false);
        }
      });
    }
  };

  const handleNewGame = () => {
    const newBoard = initializeBoard();
    setBoard(newBoard);
    setMoveHistory([]);
    setIsAITurn(false);
  };

  const handleUndo = () => {
    if (moveHistory.length > 0) {
      const previousBoard = moveHistory[moveHistory.length - 1];
      setBoard(previousBoard);
      setMoveHistory(moveHistory.slice(0, -1));
      setIsAITurn(false);
    }
  };

  const handleModeSelect = (mode) => {
    setGameMode(mode);
    setBoard(null);
    setMoveHistory([]);
    setIsAITurn(false);
  };

  const handleExitGame = () => {
    if (isMobile) {
      exitFullscreen();
    }
    setGameMode(null);
    setBoard(null);
    setMoveHistory([]);
    setIsAITurn(false);
  };

  if (!gameMode) {
    return (
      <div className="page play-page">
        <div className="container">
          <GameModeSelector onSelect={handleModeSelect} />
        </div>
      </div>
    );
  }

  if (gameMode === GAME_MODES.ONLINE) {
    return (
      <div className="page play-page">
        <div className="container">
          <OnlineGame onBack={handleExitGame} />
        </div>
      </div>
    );
  }

  if (!board) {
    return <div>Loading...</div>;
  }

  const currentPlayer = gameMode === GAME_MODES.VS_COMPUTER 
    ? (isAITurn ? (playerColor === PLAYERS.WHITE ? PLAYERS.BLACK : PLAYERS.WHITE) : playerColor)
    : board.currentPlayer;

  // In pass & play, both players can move (no disabled state based on playerColor)
  // In vs computer, only the human player can move
  const disabled = gameMode === GAME_MODES.VS_COMPUTER 
    ? (isAITurn || board.gameOver || currentPlayer !== playerColor)
    : board.gameOver;

  return (
    <div className="page play-page">
      <div className="container">
        <div className="game-controls">
          <button onClick={handleNewGame} className="btn">
            {t('common.newGame')}
          </button>
          {(gameMode === GAME_MODES.VS_COMPUTER || gameMode === GAME_MODES.PASS_PLAY) && moveHistory.length > 0 && (
            <button onClick={handleUndo} className="btn btn-secondary">
              {t('common.undo')}
            </button>
          )}
          <button onClick={handleExitGame} className="btn btn-secondary">
            {t('common.close')}
          </button>
          {gameMode === GAME_MODES.VS_COMPUTER && (
            <div className="difficulty-selector">
              <label>{t('game.selectDifficulty')}: </label>
              <select 
                value={difficulty} 
                onChange={(e) => setDifficulty(Number(e.target.value))}
                disabled={isAITurn}
              >
                <option value={DIFFICULTY_LEVELS.EASY}>{t('game.easy')}</option>
                <option value={DIFFICULTY_LEVELS.MEDIUM}>{t('game.medium')}</option>
                <option value={DIFFICULTY_LEVELS.HARD}>{t('game.hard')}</option>
              </select>
            </div>
          )}
        </div>

        {isAITurn && (
          <div className="ai-thinking">
            {t('game.opponentTurn')}...
          </div>
        )}

        <div ref={boardRef}>
          <GameBoard
            board={board}
            onMove={handleMove}
            currentPlayer={currentPlayer}
            gameMode={gameMode}
            playerColor={playerColor}
            disabled={disabled}
          />
        </div>
      </div>
    </div>
  );
}

export default Play;

