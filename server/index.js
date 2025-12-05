const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');
const gameLogic = require('./gameLogic');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

app.use(cors());
app.use(express.json());

// Store active games
const games = new Map();

// Generate a room code
function generateRoomCode() {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
}

// Initialize a new game board
function initializeGame() {
  return {
    board: gameLogic.initializeBoard(),
    players: [],
    createdAt: Date.now()
  };
}

// Clean up old games (older than 1 hour)
setInterval(() => {
  const now = Date.now();
  for (const [roomCode, game] of games.entries()) {
    if (now - game.createdAt > 3600000) { // 1 hour
      games.delete(roomCode);
    }
  }
}, 60000); // Check every minute

io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);

  socket.on('createRoom', (data) => {
    const roomCode = generateRoomCode();
    const game = initializeGame();
    game.players.push({
      id: socket.id,
      name: data.playerName || 'Player 1',
      color: 'white'
    });
    games.set(roomCode, game);
    
    socket.join(roomCode);
    socket.emit('roomCreated', { roomCode, board: game.board });
    console.log(`Room created: ${roomCode} by ${socket.id}`);
  });

  socket.on('joinRoom', (data) => {
    const { roomCode } = data;
    const game = games.get(roomCode);

    if (!game) {
      socket.emit('gameError', { message: 'Room not found' });
      return;
    }

    if (game.players.length >= 2) {
      socket.emit('gameError', { message: 'Room is full' });
      return;
    }

    game.players.push({
      id: socket.id,
      name: data.playerName || 'Player 2',
      color: 'black'
    });

    socket.join(roomCode);
    socket.emit('roomJoined', {
      roomCode,
      board: game.board,
      opponentName: game.players[0].name
    });

    // Notify the first player
    io.to(game.players[0].id).emit('playerJoined', {
      board: game.board,
      playerName: data.playerName || 'Player 2'
    });

    console.log(`Player joined room: ${roomCode}`);
  });

  socket.on('move', (data) => {
    const { roomCode, board, player } = data;
    const game = games.get(roomCode);

    if (!game) {
      socket.emit('gameError', { message: 'Room not found' });
      return;
    }

    // Validate move on server side
    try {
      // Validate the board state
      const isValid = gameLogic.validateMove(game.board, board, player);
      
      if (!isValid) {
        socket.emit('gameError', { message: 'Invalid move' });
        return;
      }

      // Update game state
      game.board = board;

      // Broadcast move to all players in the room
      io.to(roomCode).emit('move', { board, player });
    } catch (error) {
      console.error('Move validation error:', error);
      socket.emit('gameError', { message: 'Invalid move: ' + error.message });
    }
  });

  socket.on('newGame', (data) => {
    const { roomCode } = data;
    const game = games.get(roomCode);

    if (!game) {
      socket.emit('gameError', { message: 'Room not found' });
      return;
    }

    game.board = gameLogic.initializeBoard();
    io.to(roomCode).emit('newGame', { board: game.board });
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);

    // Find and remove player from games
    for (const [roomCode, game] of games.entries()) {
      const playerIndex = game.players.findIndex(p => p.id === socket.id);
      if (playerIndex !== -1) {
        game.players.splice(playerIndex, 1);
        
        // Notify other players
        socket.to(roomCode).emit('playerLeft');
        
        // If no players left, remove game after a delay
        if (game.players.length === 0) {
          setTimeout(() => {
            if (games.get(roomCode) && games.get(roomCode).players.length === 0) {
              games.delete(roomCode);
            }
          }, 60000); // Remove after 1 minute
        }
        break;
      }
    }
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});


