/**
 * GameBoard Component - Toguz Korgool
 * 
 * GAME DIRECTION:
 * - The game is played COUNTER-CLOCKWISE (anticlockwise)
 * - Stones are distributed one by one in counter-clockwise direction
 * - Movement: (pitIndex - 1 + 18) % 18 ensures counter-clockwise progression
 * 
 * ANIMATION SYSTEM:
 * - Animations are triggered step-by-step using calculateMoveSteps() which returns
 *   an array of animation steps (sow, capture, tuz_created, tuz_collect)
 * - Each step is animated sequentially with delays between them
 * - Stone movements use CSS transitions with cubic-bezier easing
 * - Animation timing can be adjusted via ANIMATION_DELAY and STONE_FLIGHT_DURATION constants
 * 
 * PIT NUMBERING:
 * - Bottom row (user's side): Displayed 1-9 from left to right
 * - Top row (opponent's side): Displayed 9-1 from left to right (mirrored)
 * - Display numbers use getPitDisplayNumber() helper function
 * - All game logic (including tuz restrictions on 9th pit) matches these numbers
 * 
 * BOARD LAYOUT (like chess):
 * - Bottom row: User's pits (always the player's side)
 * - Top row: Opponent's pits (computer/online player)
 * - Two kazans in the center, horizontally between the rows
 * - Organic oval design with dark background
 */

import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  makeMove, 
  isLegalMove, 
  PLAYERS, 
  getPlayerPits, 
  isTuz, 
  getPitDisplayNumber,
  calculateMoveSteps 
} from '../game/gameLogic';
import './GameBoard.css';

function GameBoard({ board, onMove, currentPlayer, gameMode, playerColor = PLAYERS.WHITE, disabled = false }) {
  const { t } = useTranslation();
  const [selectedPit, setSelectedPit] = useState(null);
  const [animating, setAnimating] = useState(false);
  const [animationState, setAnimationState] = useState(null);
  const [highlightedPit, setHighlightedPit] = useState(null);
  const [lastStonePit, setLastStonePit] = useState(null);
  const [flyingStones, setFlyingStones] = useState([]);
  const pitRefs = useRef({});
  const kazanRefs = useRef({});
  const previousBoardRef = useRef(null);
  const [displayBoard, setDisplayBoard] = useState(() => board || null);
  
  // Initialize displayBoard when board is first set
  useEffect(() => {
    if (board && !displayBoard) {
      setDisplayBoard(board);
      previousBoardRef.current = JSON.parse(JSON.stringify(board));
    }
  }, [board, displayBoard]);

  /**
   * ANIMATION TIMING CONSTANTS
   * Adjust these to change animation speed and feel:
   * - ANIMATION_DELAY: Delay between each stone movement (80-120ms recommended)
   * - SELECTION_DURATION: How long pit selection highlight lasts (200ms recommended)
   * - STONE_FLIGHT_DURATION: How long stone flight animation takes (400-800ms recommended)
   */
  const ANIMATION_DELAY = 100; // ms between stone movements
  const SELECTION_DURATION = 200; // ms for pit selection animation
  const STONE_FLIGHT_DURATION = 600; // ms for stone flight animation

  // Helper functions for animations (defined first so they can be used by animateMove)
  const animateStoneToPit = async (fromPit, toPit) => {
    const fromElement = pitRefs.current[fromPit];
    const toElement = pitRefs.current[toPit];
    
    if (!fromElement || !toElement) return;

    // Create a flying stone element
    const stone = document.createElement('div');
    stone.className = 'flying-stone';
    stone.style.position = 'absolute';
    stone.style.width = '12px';
    stone.style.height = '12px';
    stone.style.borderRadius = '50%';
    stone.style.background = '#8B4513';
    stone.style.boxShadow = '0 2px 4px rgba(0,0,0,0.3)';
    stone.style.pointerEvents = 'none';
    stone.style.zIndex = '1000';

    const fromRect = fromElement.getBoundingClientRect();
    const toRect = toElement.getBoundingClientRect();
    const boardRect = document.querySelector('.board-container')?.getBoundingClientRect() || { left: 0, top: 0 };

    const startX = fromRect.left - boardRect.left + fromRect.width / 2;
    const startY = fromRect.top - boardRect.top + fromRect.height / 2;
    const endX = toRect.left - boardRect.left + toRect.width / 2;
    const endY = toRect.top - boardRect.top + toRect.height / 2;

    stone.style.left = `${startX}px`;
    stone.style.top = `${startY}px`;

    document.querySelector('.board-container')?.appendChild(stone);

    // Calculate counter-clockwise arc path
    const isMovingUp = toRect.top < fromRect.top;
    const isMovingDown = toRect.top > fromRect.top;
    const isMovingRight = toRect.left > fromRect.left;
    const isMovingLeft = toRect.left < fromRect.left;
    
    let controlX, controlY;
    const dx = endX - startX;
    const dy = endY - startY;
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    if (isMovingUp) {
      controlX = (startX + endX) / 2 - distance * 0.3;
      controlY = (startY + endY) / 2;
    } else if (isMovingDown) {
      controlX = (startX + endX) / 2 + distance * 0.3;
      controlY = (startY + endY) / 2;
    } else if (isMovingRight) {
      controlX = (startX + endX) / 2;
      controlY = (startY + endY) / 2 + distance * 0.3;
    } else {
      controlX = (startX + endX) / 2;
      controlY = (startY + endY) / 2 - distance * 0.3;
    }

    const keyframes = [
      { transform: `translate(0, 0)`, offset: 0 },
      { transform: `translate(${controlX - startX}px, ${controlY - startY}px)`, offset: 0.5 },
      { transform: `translate(${endX - startX}px, ${endY - startY}px)`, offset: 1 }
    ];

    const animation = stone.animate(keyframes, {
      duration: STONE_FLIGHT_DURATION,
      easing: 'cubic-bezier(0.4, 0, 0.2, 1)'
    });

    await animation.finished;
    stone.remove();
  };

  const animateCapture = async (fromPit, toKazan, stones) => {
    const fromElement = pitRefs.current[fromPit];
    const toElement = kazanRefs.current[toKazan];
    
    if (!fromElement || !toElement) return;

    const stoneElements = [];
    for (let i = 0; i < Math.min(stones, 10); i++) {
      const stone = document.createElement('div');
      stone.className = 'flying-stone capture-stone';
      stone.style.position = 'absolute';
      stone.style.width = '10px';
      stone.style.height = '10px';
      stone.style.borderRadius = '50%';
      stone.style.background = '#8B4513';
      stone.style.boxShadow = '0 2px 4px rgba(0,0,0,0.3)';
      stone.style.pointerEvents = 'none';
      stone.style.zIndex = '1000';
      stone.style.transition = `transform ${STONE_FLIGHT_DURATION}ms cubic-bezier(0.4, 0, 0.2, 1), opacity ${STONE_FLIGHT_DURATION}ms`;

      const fromRect = fromElement.getBoundingClientRect();
      const toRect = toElement.getBoundingClientRect();
      const boardRect = document.querySelector('.board-container')?.getBoundingClientRect() || { left: 0, top: 0 };

      const offsetX = (Math.random() - 0.5) * 20;
      const offsetY = (Math.random() - 0.5) * 20;

      stone.style.left = `${fromRect.left - boardRect.left + fromRect.width / 2 + offsetX}px`;
      stone.style.top = `${fromRect.top - boardRect.top + fromRect.height / 2 + offsetY}px`;

      document.querySelector('.board-container')?.appendChild(stone);
      stoneElements.push(stone);

      requestAnimationFrame(() => {
        stone.style.transform = `translate(${toRect.left - fromRect.left - offsetX}px, ${toRect.top - fromRect.top - offsetY}px)`;
      });
    }

    await new Promise(resolve => setTimeout(resolve, STONE_FLIGHT_DURATION));
    stoneElements.forEach(stone => stone.remove());
  };

  // Extract animation logic into reusable function
  const animateMove = async (pitIndex, movePlayer, sourceBoard, skipSelection = false, updateDisplayBoard = null) => {
    setAnimating(true);
    
    if (!skipSelection) {
      setSelectedPit(pitIndex);
      // Brief selection animation
      await new Promise(resolve => setTimeout(resolve, SELECTION_DURATION));
    }

    try {
      // Calculate move steps for animation
      const steps = calculateMoveSteps(sourceBoard, pitIndex, movePlayer);
      
      // Create a working copy of the board for animation
      const workingBoard = JSON.parse(JSON.stringify(sourceBoard));
      workingBoard.pits[pitIndex] = 0; // Remove stones from source pit
      
      // Update displayBoard immediately to show source pit is empty
      if (updateDisplayBoard) {
        updateDisplayBoard(JSON.parse(JSON.stringify(workingBoard)));
      }

      // Execute animations step by step
      for (const step of steps) {
        if (step.type === 'sow') {
          // Animate stone moving to pit
          await animateStoneToPit(pitIndex, step.toPit);
          workingBoard.pits[step.toPit] = (workingBoard.pits[step.toPit] || 0) + step.stones;
          setAnimationState({ type: 'sowing', pit: step.toPit, stones: workingBoard.pits[step.toPit] });
          
          // Update displayBoard in real-time as stones are placed
          if (updateDisplayBoard) {
            updateDisplayBoard(JSON.parse(JSON.stringify(workingBoard)));
          }
          
          await new Promise(resolve => setTimeout(resolve, ANIMATION_DELAY));
        } else if (step.type === 'capture') {
          // Highlight last pit
          setLastStonePit(step.fromPit);
          await new Promise(resolve => setTimeout(resolve, 300));
          
          // Animate capture
          await animateCapture(step.fromPit, step.toKazan, step.stones);
          workingBoard.pits[step.fromPit] = 0;
          workingBoard.kazans[step.toKazan] += step.stones;
          setAnimationState({ type: 'capture', kazan: step.toKazan, stones: workingBoard.kazans[step.toKazan] });
          
          // Update displayBoard to show capture
          if (updateDisplayBoard) {
            updateDisplayBoard(JSON.parse(JSON.stringify(workingBoard)));
          }
          
          await new Promise(resolve => setTimeout(resolve, 400));
        } else if (step.type === 'tuz_created') {
          // Animate tuz creation
          setLastStonePit(step.pit);
          await new Promise(resolve => setTimeout(resolve, 300));
          workingBoard.tuz[step.player] = step.pit;
          setAnimationState({ type: 'tuz_created', pit: step.pit });
          
          // Update displayBoard to show tuz
          if (updateDisplayBoard) {
            updateDisplayBoard(JSON.parse(JSON.stringify(workingBoard)));
          }
          
          await new Promise(resolve => setTimeout(resolve, 500));
        } else if (step.type === 'tuz_collect') {
          if (step.direct) {
            // Stone goes directly from pit to kazan (landing in tuz)
            await animateStoneToPit(pitIndex, step.fromPit);
            await new Promise(resolve => setTimeout(resolve, 100));
            await animateCapture(step.fromPit, step.toKazan, step.stones);
            workingBoard.kazans[step.toKazan] += step.stones;
            setAnimationState({ type: 'tuz_collect', kazan: step.toKazan, stones: workingBoard.kazans[step.toKazan] });
            
            // Update displayBoard to show tuz collection
            if (updateDisplayBoard) {
              updateDisplayBoard(JSON.parse(JSON.stringify(workingBoard)));
            }
            
            await new Promise(resolve => setTimeout(resolve, 400));
          } else {
            // Animate accumulated stones from tuz to kazan
            await animateCapture(step.fromPit, step.toKazan, step.stones);
            workingBoard.pits[step.fromPit] = 0;
            workingBoard.kazans[step.toKazan] += step.stones;
            setAnimationState({ type: 'tuz_collect', kazan: step.toKazan, stones: workingBoard.kazans[step.toKazan] });
            
            // Update displayBoard to show tuz collection
            if (updateDisplayBoard) {
              updateDisplayBoard(JSON.parse(JSON.stringify(workingBoard)));
            }
            
            await new Promise(resolve => setTimeout(resolve, 400));
          }
        }
      }

      // Clear animation state
      setLastStonePit(null);
      setAnimationState(null);
      setFlyingStones([]);
      if (!skipSelection) {
        setSelectedPit(null);
      }
      setAnimating(false);
      return true;
    } catch (error) {
      console.error('Animation error:', error);
      setSelectedPit(null);
      setAnimating(false);
      setAnimationState(null);
      setLastStonePit(null);
      setFlyingStones([]);
      return false;
    }
  };

  // Sync displayBoard with board prop, but delay for opponent moves
  useEffect(() => {
    if (!board) {
      setDisplayBoard(board);
      previousBoardRef.current = null;
      return;
    }

    if (!previousBoardRef.current) {
      // Initial board state
      setDisplayBoard(board);
      previousBoardRef.current = JSON.parse(JSON.stringify(board));
      return;
    }

    // Don't update displayBoard if we're currently animating (let animation complete first)
    if (animating) {
      return;
    }

    const prevBoard = previousBoardRef.current;
    const isOpponentMove = board.currentPlayer !== prevBoard.currentPlayer && 
                          prevBoard.currentPlayer !== playerColor &&
                          prevBoard.currentPlayer !== null;

    if (isOpponentMove) {
      // This is an opponent move - animate first, then update display
      let movePit = null;
      const opponentPits = getPlayerPits(prevBoard.currentPlayer);
      
      // Find which pit was used for the move by comparing board states
      for (const pitIndex of opponentPits) {
        const prevStones = prevBoard.pits[pitIndex] || 0;
        const currStones = board.pits[pitIndex] || 0;
        
        if (prevStones > currStones && 
            prevStones > 0 &&
            !isTuz(prevBoard, pitIndex)) {
          movePit = pitIndex;
          break;
        }
      }

      if (movePit !== null) {
        // CRITICAL: Set displayBoard to previous state BEFORE animating
        // This ensures the pit still shows stones during animation
        // Use a function to ensure we're setting it to the exact previous state
        const prevBoardCopy = JSON.parse(JSON.stringify(prevBoard));
        setDisplayBoard(prevBoardCopy);
        
        // Store the new board state to update after animation
        const finalBoardState = JSON.parse(JSON.stringify(board));
        
        // Set animating to true to prevent other updates
        setAnimating(true);
        
        // Animate using the previous board state (pit still has stones)
        // Pass setDisplayBoard callback to update counts in real-time during animation
        animateMove(movePit, prevBoard.currentPlayer, prevBoardCopy, true, setDisplayBoard).then(() => {
          // After animation completes, ensure display board matches final state
          setDisplayBoard(finalBoardState);
          previousBoardRef.current = finalBoardState;
        });
      } else {
        // Couldn't find the move pit, just update immediately
        setDisplayBoard(board);
        previousBoardRef.current = JSON.parse(JSON.stringify(board));
      }
    } else {
      // User move or other update - update display immediately
      setDisplayBoard(board);
      previousBoardRef.current = JSON.parse(JSON.stringify(board));
    }
  }, [board, playerColor, animating]);

  const handlePitClick = async (pitIndex) => {
    if (disabled || animating || displayBoard.gameOver) return;
    if (!isLegalMove(displayBoard, pitIndex, currentPlayer)) return;

    // Animate the move using displayBoard (which shows current state)
    // Pass setDisplayBoard callback to update counts in real-time during animation
    const animationSuccess = await animateMove(pitIndex, currentPlayer, displayBoard, false, setDisplayBoard);
    
    if (animationSuccess) {
      // Execute the actual move to get final board state
      const newBoard = makeMove(displayBoard, pitIndex, currentPlayer);
      onMove(newBoard);
    }
  };

  const renderPit = (pitIndex, overrideDisplayNumber = null) => {
    if (!displayBoard) return null;
    const stones = displayBoard.pits[pitIndex];
    const isPlayerPit = getPlayerPits(playerColor).includes(pitIndex);
    const isOpponentPit = getPlayerPits(playerColor === PLAYERS.WHITE ? PLAYERS.BLACK : PLAYERS.WHITE).includes(pitIndex);
    const isTuzPit = isTuz(displayBoard, pitIndex);
    const isValidMove = !disabled && !animating && !displayBoard.gameOver && isLegalMove(displayBoard, pitIndex, currentPlayer);
    const isSelected = selectedPit === pitIndex;
    const isHighlighted = highlightedPit === pitIndex || lastStonePit === pitIndex;
    const displayNumber = overrideDisplayNumber !== null ? overrideDisplayNumber : getPitDisplayNumber(pitIndex, playerColor);

    let pitClass = 'pit';
    if (isTuzPit) pitClass += ' tuz';
    if (isValidMove) pitClass += ' valid-move';
    if (isSelected) pitClass += ' selected';
    if (isHighlighted) pitClass += ' highlighted';
    if (isPlayerPit) pitClass += ' player-pit';
    if (isOpponentPit) pitClass += ' opponent-pit';
    if (animationState?.type === 'sowing' && animationState.pit === pitIndex) {
      pitClass += ' receiving-stone';
    }

    return (
      <div
        key={pitIndex}
        ref={el => pitRefs.current[pitIndex] = el}
        className={pitClass}
        onClick={() => handlePitClick(pitIndex)}
        role="button"
        tabIndex={isValidMove ? 0 : undefined}
        onKeyDown={(e) => {
          if (isValidMove && (e.key === 'Enter' || e.key === ' ')) {
            e.preventDefault();
            handlePitClick(pitIndex);
          }
        }}
        aria-label={`Pit ${displayNumber}: ${stones} ${t('game.stones')}${isTuzPit ? ` (${t('game.tuz')})` : ''}`}
      >
        <div className="pit-content">
          <div className="pit-number">{displayNumber}</div>
          <div className="stones-count">{stones}</div>
          {isTuzPit && <div className="tuz-indicator">★</div>}
          {animationState?.type === 'sowing' && animationState.pit === pitIndex && (
            <div className="stone-plus">+1</div>
          )}
        </div>
      </div>
    );
  };

  const renderKazan = (player, score) => {
    const isPulsing = animationState?.type === 'capture' && animationState.kazan === getKazanIndex(player);
    const isPulsingTuz = animationState?.type === 'tuz_collect' && animationState.kazan === getKazanIndex(player);
    const playerLabel = player === PLAYERS.WHITE ? t('game.kazanWhite') : t('game.kazanBlack');
    const playerClass = player === PLAYERS.WHITE ? 'kazan-white' : 'kazan-black';
    
    return (
      <div className="kazan-container">
        <div 
          ref={el => kazanRefs.current[getKazanIndex(player)] = el}
          className={`kazan ${playerClass} ${isPulsing || isPulsingTuz ? 'pulsing' : ''}`}
          aria-label={`${playerLabel}: ${score} ${t('game.stones')}`}
        >
          <div className="kazan-content">
            <div className="kazan-label">{playerLabel}</div>
            <div className="kazan-score">{score}</div>
          </div>
        </div>
      </div>
    );
  };

  // Helper to get kazan index
  const getKazanIndex = (player) => {
    return player === PLAYERS.WHITE ? 'white' : 'black';
  };

  // Early return if no display board
  if (!displayBoard) {
    return <div>Loading board...</div>;
  }

  // Determine user and opponent
  const userPlayer = playerColor;
  const opponentPlayer = playerColor === PLAYERS.WHITE ? PLAYERS.BLACK : PLAYERS.WHITE;
  
  // Get user and opponent pits
  const userPits = getPlayerPits(userPlayer);
  const opponentPits = getPlayerPits(opponentPlayer);
  
  // Get kazans from displayBoard
  const userKazan = displayBoard.kazans[userPlayer === PLAYERS.WHITE ? 'white' : 'black'];
  const opponentKazan = displayBoard.kazans[opponentPlayer === PLAYERS.WHITE ? 'white' : 'black'];

  // Layout (like chess - user at bottom, opponent at top):
  // Top row: Opponent's pits, displayed 9-1 from left to right (mirrored)
  // Center: Two kazans side by side (opponent left, user right)
  // Bottom row: User's pits, displayed 1-9 from left to right

  return (
    <div className="game-board">
      <div className="board-header">
        <div className="player-info">
          <div className={`player-name ${displayBoard.currentPlayer === opponentPlayer ? 'active' : ''} ${currentPlayer === opponentPlayer && currentPlayer !== playerColor ? 'your-turn' : ''}`}>
            {opponentPlayer === PLAYERS.WHITE ? t('game.whitePlayer') : t('game.blackPlayer')}: {opponentKazan} {t('game.stones')}
          </div>
        </div>
        <div className="game-status">
          {displayBoard.gameOver ? (
            <div className="game-over">
              {displayBoard.winner === playerColor
                ? t('game.youWin')
                : displayBoard.winner === 'draw'
                ? t('game.draw')
                : t('game.youLose')}
            </div>
          ) : (
            <div className="turn-indicator">
              {currentPlayer === playerColor
                ? t('game.yourTurn')
                : t('game.opponentTurn')}
            </div>
          )}
        </div>
        <div className="player-info">
          <div className={`player-name ${displayBoard.currentPlayer === userPlayer ? 'active' : ''} ${currentPlayer === playerColor && displayBoard.currentPlayer === userPlayer ? 'your-turn' : ''}`}>
            {userPlayer === PLAYERS.WHITE ? t('game.whitePlayer') : t('game.blackPlayer')}: {userKazan} {t('game.stones')}
          </div>
        </div>
      </div>

      <div className="board-container">
        <div className="pits-container">
          {/* Top row: Opponent's pits, displayed 9-1 from left to right (mirrored) */}
          <div className="pits-row top-row opponent-row">
            {opponentPits.map((pitIndex, i) => {
              // Display opponent pits in reverse order (9-1 from left to right)
              const displayIndex = opponentPits.length - 1 - i;
              const visualPitIndex = opponentPits[displayIndex];
              // For opponent row: leftmost pit (i=0) should show 9, rightmost (i=8) should show 1
              const displayNumber = 9 - i;
              return renderPit(visualPitIndex, displayNumber);
            })}
          </div>

          {/* Center: Kazans (opponent left, user right) */}
          <div className="kazans-center">
            {renderKazan(opponentPlayer, opponentKazan)}
            {renderKazan(userPlayer, userKazan)}
          </div>

          {/* Bottom row: User's pits, displayed 1-9 from left to right */}
          <div className="pits-row bottom-row user-row">
            {userPits.map(pitIndex => renderPit(pitIndex))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default GameBoard;
