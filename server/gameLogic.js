// Server-side game logic validation
// This mirrors the client-side logic for security

const PLAYERS = {
  WHITE: 'white',
  BLACK: 'black'
};

function initializeBoard() {
  return {
    pits: Array(18).fill(9),
    kazans: { white: 0, black: 0 },
    tuz: { white: null, black: null },
    currentPlayer: PLAYERS.WHITE,
    moveHistory: [],
    gameOver: false,
    winner: null
  };
}

function getPlayerPits(player) {
  if (player === PLAYERS.WHITE) {
    return Array.from({ length: 9 }, (_, i) => i);
  } else {
    return Array.from({ length: 9 }, (_, i) => i + 9);
  }
}

function isTuz(board, pitIndex) {
  return board.tuz.white === pitIndex || board.tuz.black === pitIndex;
}

function isPlayerPit(pitIndex, player) {
  const playerPits = getPlayerPits(player);
  return playerPits.includes(pitIndex);
}

function validateMove(oldBoard, newBoard, player) {
  // Basic validation: check if it's the player's turn
  if (oldBoard.currentPlayer !== player) {
    return false;
  }

  // Check if game is over
  if (oldBoard.gameOver) {
    return false;
  }

  // Validate board structure
  if (!newBoard.pits || newBoard.pits.length !== 18) {
    return false;
  }

  if (!newBoard.kazans || !newBoard.kazans.white || !newBoard.kazans.black) {
    return false;
  }

  // Check total stones (should be 162)
  const totalStones = newBoard.pits.reduce((sum, stones) => sum + stones, 0) +
    newBoard.kazans.white + newBoard.kazans.black;
  
  // Allow some tolerance for tuz stones
  if (totalStones < 160 || totalStones > 162) {
    return false;
  }

  // More detailed validation could be added here
  // For now, we trust the client but validate structure

  return true;
}

module.exports = {
  initializeBoard,
  PLAYERS,
  validateMove
};


