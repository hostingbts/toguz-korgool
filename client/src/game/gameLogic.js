// Core game logic for Toguz Korgool

export const PLAYERS = {
  WHITE: 'white',
  BLACK: 'black'
};

export const GAME_MODES = {
  VS_COMPUTER: 'vs_computer',
  ONLINE: 'online',
  PASS_PLAY: 'pass_play'
};

// Initialize a new game board
export function initializeBoard() {
  const board = {
    pits: Array(18).fill(9), // 18 pits, each with 9 stones initially
    kazans: { white: 0, black: 0 },
    tuz: { white: null, black: null }, // pit index for each player's tuz
    currentPlayer: PLAYERS.WHITE,
    moveHistory: [],
    gameOver: false,
    winner: null
  };
  return board;
}

// Get pit indices for a player
export function getPlayerPits(player) {
  if (player === PLAYERS.WHITE) {
    return Array.from({ length: 9 }, (_, i) => i); // pits 0-8
  } else {
    return Array.from({ length: 9 }, (_, i) => i + 9); // pits 9-17
  }
}

// Get opponent's pits
export function getOpponentPits(player) {
  return getPlayerPits(player === PLAYERS.WHITE ? PLAYERS.BLACK : PLAYERS.WHITE);
}

// Get kazan index for a player
export function getKazanIndex(player) {
  return player === PLAYERS.WHITE ? 'white' : 'black';
}

// Check if a pit is a tuz
export function isTuz(board, pitIndex) {
  return board.tuz.white === pitIndex || board.tuz.black === pitIndex;
}

// Check if a pit belongs to a player
export function isPlayerPit(pitIndex, player) {
  const playerPits = getPlayerPits(player);
  return playerPits.includes(pitIndex);
}

// Get the opposite pit index (for tuz restriction)
export function getOppositePit(pitIndex) {
  // Pits are arranged: White (0-8) on top, Black (9-17) on bottom
  // Opposite pits: 0 <-> 17, 1 <-> 16, ..., 8 <-> 9
  if (pitIndex < 9) {
    return 17 - pitIndex;
  } else {
    return 8 - (pitIndex - 9);
  }
}

// Get display number for a pit (1-9 for each player)
// Bottom row (user's side): 1-9 left to right
// Top row (opponent's side): 9-1 left to right (mirrored)
// playerColor: the current user's color (for determining which side is bottom)
export function getPitDisplayNumber(pitIndex, playerColor = null) {
  // If no playerColor provided, use old logic (assumes black at bottom)
  if (playerColor === null) {
    if (pitIndex < 9) {
      return 9 - pitIndex; // White (top): 9-1
    } else {
      return pitIndex - 8; // Black (bottom): 1-9
    }
  }
  
  // Determine if this pit belongs to the user (bottom row) or opponent (top row)
  const isUserPit = isPlayerPit(pitIndex, playerColor);
  
  if (isUserPit) {
    // User's pits (bottom row): 1-9 left to right
    const userPits = getPlayerPits(playerColor);
    const indexInRow = userPits.indexOf(pitIndex);
    return indexInRow + 1; // 1-9
  } else {
    // Opponent's pits (top row): 9-1 left to right (mirrored)
    const opponentPits = getPlayerPits(playerColor === PLAYERS.WHITE ? PLAYERS.BLACK : PLAYERS.WHITE);
    const indexInRow = opponentPits.indexOf(pitIndex);
    return 9 - indexInRow; // 9-1
  }
}

// Get the 9th pit index for a player (rightmost pit, where tuz cannot be created)
export function getNinthPit(player) {
  if (player === PLAYERS.WHITE) {
    return 8; // Rightmost pit for white (top row)
  } else {
    return 17; // Rightmost pit for black (bottom row)
  }
}

// Calculate move steps for animation
export function calculateMoveSteps(board, pitIndex, player) {
  const steps = [];
  const stones = board.pits[pitIndex];
  let currentPit = pitIndex;
  let stonesToSow = stones;
  
  // Step 1: Pick up stones from source pit
  steps.push({
    type: 'pickup',
    fromPit: pitIndex,
    stones: stones
  });
  
  // If the pit had more than 1 stone, first stone goes back into same pit
  // (Note: Moving from a tuz is not allowed, so we don't need to check for tuz here)
  if (stones > 1) {
    steps.push({
      type: 'sow',
      toPit: pitIndex,
      stones: 1
    });
    stonesToSow = stones - 1;
    // Move anticlockwise: (pitIndex + 1) % 18
    // From user's perspective at bottom: moves right along bottom, then up, then left along top, then back down
    currentPit = (pitIndex + 1) % 18;
  } else {
    // Skip the source pit, move to next pit anticlockwise
    currentPit = (pitIndex + 1) % 18;
  }
  
  // Sow remaining stones one by one anticlockwise
  // Track which stones go to tuz pits (they go directly to kazan)
  const opponent = player === PLAYERS.WHITE ? PLAYERS.BLACK : PLAYERS.WHITE;
  const playerTuz = board.tuz[player];
  const opponentTuz = board.tuz[opponent];
  
  for (let i = 0; i < stonesToSow; i++) {
    // Check if this stone lands in a tuz pit
    if (currentPit === playerTuz) {
      // Stone goes directly to player's kazan
      steps.push({
        type: 'tuz_collect',
        fromPit: currentPit,
        toKazan: getKazanIndex(player),
        stones: 1,
        direct: true
      });
    } else if (currentPit === opponentTuz) {
      // Stone goes directly to opponent's kazan
      steps.push({
        type: 'tuz_collect',
        fromPit: currentPit,
        toKazan: getKazanIndex(opponent),
        stones: 1,
        direct: true
      });
    } else {
      // Normal sowing
      steps.push({
        type: 'sow',
        toPit: currentPit,
        stones: 1
      });
    }
    // Move to next pit anticlockwise
    currentPit = (currentPit + 1) % 18;
  }
  
  // The last stone was placed in the pit before currentPit
  // But we need to find the actual last pit (accounting for tuz)
  let lastPit = null;
  let lastPitStones = 0;
  
  // Find the last non-tuz pit that received a stone
  for (let i = steps.length - 1; i >= 0; i--) {
    if (steps[i].type === 'sow') {
      lastPit = steps[i].toPit;
      break;
    }
  }
  
  // If all stones went to tuz, use the last tuz pit
  if (lastPit === null) {
    for (let i = steps.length - 1; i >= 0; i--) {
      if (steps[i].type === 'tuz_collect' && steps[i].direct) {
        lastPit = steps[i].fromPit;
        break;
      }
    }
  }
  
  if (lastPit !== null) {
    // Calculate stones in last pit (only if it's not a tuz)
    if (lastPit !== playerTuz && lastPit !== opponentTuz) {
      lastPitStones = (board.pits[lastPit] || 0) + steps.filter(s => s.type === 'sow' && s.toPit === lastPit).length;
    }
    
    // Check for capture (even number in opponent's pit, and not a tuz)
    const opponentPits = getOpponentPits(player);
    if (opponentPits.includes(lastPit) && lastPit !== opponentTuz && lastPitStones % 2 === 0 && lastPitStones > 0) {
      steps.push({
        type: 'capture',
        fromPit: lastPit,
        toKazan: getKazanIndex(player),
        stones: lastPitStones
      });
    }
    
    // Check for tuz creation (exactly 3 stones in opponent's pit, and not a tuz)
    if (opponentPits.includes(lastPit) && lastPit !== opponentTuz && lastPitStones === 3) {
      const opponentRightmostPit = getNinthPit(opponent);
      const oppositePit = getOppositePit(lastPit);
      const opponentTuzForCheck = board.tuz[opponent];
      
      if (
        lastPit !== opponentRightmostPit &&
        oppositePit !== opponentTuzForCheck &&
        board.tuz[player] === null
      ) {
        steps.push({
          type: 'tuz_created',
          pit: lastPit,
          player: player
        });
      }
    }
  }
  
  // Collect any remaining stones from player's tuz (non-direct, accumulated stones)
  if (playerTuz !== null) {
    const tuzStones = board.pits[playerTuz] || 0;
    if (tuzStones > 0) {
      steps.push({
        type: 'tuz_collect',
        fromPit: playerTuz,
        toKazan: getKazanIndex(player),
        stones: tuzStones,
        direct: false
      });
    }
  }
  
  return steps;
}

// Check if a move is legal
export function isLegalMove(board, pitIndex, player) {
  // Must be player's turn
  if (board.currentPlayer !== player) {
    return false;
  }

  // Must be player's pit
  if (!isPlayerPit(pitIndex, player)) {
    return false;
  }

  // Cannot move from tuz
  if (isTuz(board, pitIndex)) {
    return false;
  }

  // Pit must have stones
  if (board.pits[pitIndex] === 0) {
    return false;
  }

  return true;
}

// Execute a move and return the new board state
export function makeMove(board, pitIndex, player) {
  // Validate move
  if (!isLegalMove(board, pitIndex, player)) {
    throw new Error('Illegal move');
  }

  const newBoard = JSON.parse(JSON.stringify(board)); // Deep copy
  const stones = newBoard.pits[pitIndex];
  newBoard.pits[pitIndex] = 0;

  // Sow stones anticlockwise
  let currentPit = pitIndex;
  let stonesToSow = stones;
  
  // If the pit had more than 1 stone, first stone goes back into same pit
  if (stones > 1) {
    newBoard.pits[pitIndex] = 1;
    stonesToSow = stones - 1;
    // Move anticlockwise: (pitIndex + 1) % 18
    // For user at bottom: moves right along bottom row, then up to opponent's row, then left, then back down
    currentPit = (pitIndex + 1) % 18;
  } else {
    // Skip the source pit, move to next pit anticlockwise
    currentPit = (pitIndex + 1) % 18;
  }

  // Sow remaining stones anticlockwise
  // Check if stones land in tuz pits (they go directly to kazan)
  const playerTuz = newBoard.tuz[player];
  const opponent = player === PLAYERS.WHITE ? PLAYERS.BLACK : PLAYERS.WHITE;
  const opponentTuz = newBoard.tuz[opponent];
  
  let lastPit = null;
  let lastPitStones = 0;
  
  for (let i = 0; i < stonesToSow; i++) {
    // Check if stone lands in a tuz pit
    if (currentPit === playerTuz) {
      // Stone goes directly to player's kazan
      newBoard.kazans[getKazanIndex(player)]++;
    } else if (currentPit === opponentTuz) {
      // Stone goes directly to opponent's kazan
      newBoard.kazans[getKazanIndex(opponent)]++;
    } else {
      // Normal sowing
      newBoard.pits[currentPit]++;
      // Track the last non-tuz pit
      lastPit = currentPit;
    }
    // Move to next pit anticlockwise
    currentPit = (currentPit + 1) % 18;
  }
  
  // Get stones count for last pit
  if (lastPit !== null) {
    lastPitStones = newBoard.pits[lastPit];
  }

  // Check for capture (even number in opponent's pit, and not a tuz)
  const opponentPits = getOpponentPits(player);
  if (opponentPits.includes(lastPit) && lastPit !== opponentTuz && lastPitStones % 2 === 0 && lastPitStones > 0) {
    // Capture all stones from opponent's pit
    const captured = newBoard.pits[lastPit];
    newBoard.pits[lastPit] = 0;
    newBoard.kazans[getKazanIndex(player)] += captured;
  }

  // Check for tuz creation (exactly 3 stones in opponent's pit, and not a tuz)
  // Restrictions:
  // 1. Cannot create tuz in opponent's 9th (rightmost) pit
  // 2. Cannot create tuz opposite to opponent's existing tuz
  // 3. Each player can have only one tuz
  if (opponentPits.includes(lastPit) && lastPit !== opponentTuz && lastPitStones === 3) {
    const opponent = player === PLAYERS.WHITE ? PLAYERS.BLACK : PLAYERS.WHITE;
    const opponentRightmostPit = getNinthPit(opponent);
    const oppositePit = getOppositePit(lastPit);
    const opponentTuzForCheck = newBoard.tuz[opponent];

    // Check restrictions
    if (
      lastPit !== opponentRightmostPit && // Not in rightmost pit
      oppositePit !== opponentTuzForCheck && // Not opposite to opponent's tuz (if exists)
      newBoard.tuz[player] === null // Player doesn't already have a tuz
    ) {
      // Player can choose to create tuz (for now, auto-create)
      newBoard.tuz[player] = lastPit;
    }
  }

  // Move any remaining stones from player's tuz to kazan
  // (Stones that were already in the tuz before this move)
  // Note: Stones landing in tuz during sowing already went directly to kazan
  if (newBoard.tuz[player] !== null) {
    const tuzPit = newBoard.tuz[player];
    const tuzStones = newBoard.pits[tuzPit];
    if (tuzStones > 0) {
      newBoard.kazans[getKazanIndex(player)] += tuzStones;
      newBoard.pits[tuzPit] = 0;
    }
  }

  // Switch turns
  newBoard.currentPlayer = newBoard.currentPlayer === PLAYERS.WHITE ? PLAYERS.BLACK : PLAYERS.WHITE;

  // Record move
  newBoard.moveHistory.push({
    player,
    pitIndex,
    captured: opponentPits.includes(lastPit) && lastPitStones % 2 === 0 ? lastPitStones : 0,
    tuzCreated: newBoard.tuz[player] === lastPit
  });

  // Check for game over
  checkGameOver(newBoard);

  return newBoard;
}

// Check if game is over
export function checkGameOver(board) {
  const whitePits = getPlayerPits(PLAYERS.WHITE);
  const blackPits = getPlayerPits(PLAYERS.BLACK);

  // Check if white has legal moves
  const whiteHasMoves = whitePits.some(pit => {
    if (isTuz(board, pit)) return false;
    return board.pits[pit] > 0;
  });

  // Check if black has legal moves
  const blackHasMoves = blackPits.some(pit => {
    if (isTuz(board, pit)) return false;
    return board.pits[pit] > 0;
  });

  if (!whiteHasMoves || !blackHasMoves) {
    board.gameOver = true;

    // Add remaining stones to respective kazans
    whitePits.forEach(pit => {
      board.kazans.white += board.pits[pit];
      board.pits[pit] = 0;
    });

    blackPits.forEach(pit => {
      board.kazans.black += board.pits[pit];
      board.pits[pit] = 0;
    });

    // Add tuz stones
    if (board.tuz.white !== null) {
      board.kazans.white += board.pits[board.tuz.white];
      board.pits[board.tuz.white] = 0;
    }
    if (board.tuz.black !== null) {
      board.kazans.black += board.pits[board.tuz.black];
      board.pits[board.tuz.black] = 0;
    }

    // Determine winner
    const whiteTotal = board.kazans.white;
    const blackTotal = board.kazans.black;

    if (whiteTotal > blackTotal) {
      board.winner = PLAYERS.WHITE;
    } else if (blackTotal > whiteTotal) {
      board.winner = PLAYERS.BLACK;
    } else {
      board.winner = 'draw';
    }
  }
}

// Get valid moves for a player
export function getValidMoves(board, player) {
  if (board.gameOver || board.currentPlayer !== player) {
    return [];
  }

  const playerPits = getPlayerPits(player);
  return playerPits.filter(pit => {
    if (isTuz(board, pit)) return false;
    return board.pits[pit] > 0;
  });
}

// Calculate board evaluation for AI
export function evaluateBoard(board, player) {
  const opponent = player === PLAYERS.WHITE ? PLAYERS.BLACK : PLAYERS.WHITE;
  
  const playerScore = board.kazans[getKazanIndex(player)];
  const opponentScore = board.kazans[getKazanIndex(opponent)];
  
  // Base score difference
  let score = playerScore - opponentScore;
  
  // Bonus for having a tuz
  if (board.tuz[player] !== null) {
    score += 5;
  }
  if (board.tuz[opponent] !== null) {
    score -= 5;
  }
  
  // Count stones in player's pits (potential future captures)
  const playerPits = getPlayerPits(player);
  const playerStones = playerPits.reduce((sum, pit) => sum + board.pits[pit], 0);
  const opponentPits = getOpponentPits(player);
  const opponentStones = opponentPits.reduce((sum, pit) => sum + board.pits[pit], 0);
  
  score += (playerStones - opponentStones) * 0.1;
  
  return score;
}


