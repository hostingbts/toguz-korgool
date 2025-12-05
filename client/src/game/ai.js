// AI opponent for Toguz Korgool

import { 
  makeMove, 
  getValidMoves, 
  evaluateBoard, 
  PLAYERS,
  checkGameOver 
} from './gameLogic';

const DIFFICULTY_LEVELS = {
  EASY: 1,
  MEDIUM: 3,
  HARD: 5
};

// Simple AI: Random move
function easyAI(board, player) {
  const validMoves = getValidMoves(board, player);
  if (validMoves.length === 0) return null;
  return validMoves[Math.floor(Math.random() * validMoves.length)];
}

// Medium AI: Greedy with some lookahead
function mediumAI(board, player, depth = 2) {
  const validMoves = getValidMoves(board, player);
  if (validMoves.length === 0) return null;

  let bestMove = null;
  let bestScore = -Infinity;

  for (const move of validMoves) {
    try {
      const newBoard = makeMove(board, move, player);
      const score = minimax(newBoard, depth - 1, false, player);
      
      if (score > bestScore) {
        bestScore = score;
        bestMove = move;
      }
    } catch (e) {
      continue;
    }
  }

  return bestMove || validMoves[0];
}

// Hard AI: Deep minimax with alpha-beta pruning
function hardAI(board, player, depth = 4) {
  const validMoves = getValidMoves(board, player);
  if (validMoves.length === 0) return null;

  let bestMove = null;
  let bestScore = -Infinity;
  let alpha = -Infinity;
  const beta = Infinity;

  for (const move of validMoves) {
    try {
      const newBoard = makeMove(board, move, player);
      const score = minimaxAlphaBeta(newBoard, depth - 1, alpha, beta, false, player);
      
      if (score > bestScore) {
        bestScore = score;
        bestMove = move;
      }
      alpha = Math.max(alpha, score);
    } catch (e) {
      continue;
    }
  }

  return bestMove || validMoves[0];
}

// Minimax algorithm
function minimax(board, depth, isMaximizing, player) {
  if (depth === 0 || board.gameOver) {
    return evaluateBoard(board, player);
  }

  const currentPlayer = isMaximizing ? player : (player === PLAYERS.WHITE ? PLAYERS.BLACK : PLAYERS.WHITE);
  const validMoves = getValidMoves(board, currentPlayer);

  if (validMoves.length === 0) {
    return evaluateBoard(board, player);
  }

  if (isMaximizing) {
    let maxScore = -Infinity;
    for (const move of validMoves) {
      try {
        const newBoard = makeMove(board, move, currentPlayer);
        const score = minimax(newBoard, depth - 1, false, player);
        maxScore = Math.max(maxScore, score);
      } catch (e) {
        continue;
      }
    }
    return maxScore;
  } else {
    let minScore = Infinity;
    for (const move of validMoves) {
      try {
        const newBoard = makeMove(board, move, currentPlayer);
        const score = minimax(newBoard, depth - 1, true, player);
        minScore = Math.min(minScore, score);
      } catch (e) {
        continue;
      }
    }
    return minScore;
  }
}

// Minimax with alpha-beta pruning
function minimaxAlphaBeta(board, depth, alpha, beta, isMaximizing, player) {
  if (depth === 0 || board.gameOver) {
    return evaluateBoard(board, player);
  }

  const currentPlayer = isMaximizing ? player : (player === PLAYERS.WHITE ? PLAYERS.BLACK : PLAYERS.WHITE);
  const validMoves = getValidMoves(board, currentPlayer);

  if (validMoves.length === 0) {
    return evaluateBoard(board, player);
  }

  if (isMaximizing) {
    let maxScore = -Infinity;
    for (const move of validMoves) {
      try {
        const newBoard = makeMove(board, move, currentPlayer);
        const score = minimaxAlphaBeta(newBoard, depth - 1, alpha, beta, false, player);
        maxScore = Math.max(maxScore, score);
        alpha = Math.max(alpha, score);
        if (beta <= alpha) break; // Alpha-beta pruning
      } catch (e) {
        continue;
      }
    }
    return maxScore;
  } else {
    let minScore = Infinity;
    for (const move of validMoves) {
      try {
        const newBoard = makeMove(board, move, currentPlayer);
        const score = minimaxAlphaBeta(newBoard, depth - 1, alpha, beta, true, player);
        minScore = Math.min(minScore, score);
        beta = Math.min(beta, score);
        if (beta <= alpha) break; // Alpha-beta pruning
      } catch (e) {
        continue;
      }
    }
    return minScore;
  }
}

// Main AI function
export function getAIMove(board, player, difficulty) {
  // Add a small delay to make AI moves feel more natural
  return new Promise((resolve) => {
    setTimeout(() => {
      let move = null;
      
      switch (difficulty) {
        case DIFFICULTY_LEVELS.EASY:
          move = easyAI(board, player);
          break;
        case DIFFICULTY_LEVELS.MEDIUM:
          move = mediumAI(board, player, 2);
          break;
        case DIFFICULTY_LEVELS.HARD:
          move = hardAI(board, player, 4);
          break;
        default:
          move = easyAI(board, player);
      }
      
      resolve(move);
    }, 500); // 500ms delay
  });
}

export { DIFFICULTY_LEVELS };


