# Game Logic Documentation

This document explains how the Toguz Korgool game logic is implemented.

## File Structure

### Client-Side Game Logic
- `client/src/game/gameLogic.js` - Core game rules and move execution
- `client/src/game/ai.js` - AI opponent implementation

### Server-Side Validation
- `server/gameLogic.js` - Server-side move validation for online games

## Core Components

### Board State

The board is represented as an object with:
- `pits`: Array of 18 numbers (stone counts in each pit)
- `kazans`: Object with `white` and `black` scores
- `tuz`: Object with `white` and `black` pit indices (null if no tuz)
- `currentPlayer`: Current player ('white' or 'black')
- `moveHistory`: Array of move records
- `gameOver`: Boolean indicating if game is finished
- `winner`: Winner ('white', 'black', or 'draw')

### Pit Indexing

- Pits 0-8: White player's pits (top row, left to right)
- Pits 9-17: Black player's pits (bottom row, left to right)
- Kazans are separate scoring areas, not part of the pits array

### Move Execution Flow

1. **Validation**: Check if move is legal
   - Must be player's turn
   - Must be player's pit
   - Pit must not be a tuz
   - Pit must have stones

2. **Sowing**: Distribute stones anticlockwise
   - If source pit had >1 stone, first stone goes back to source
   - Remaining stones distributed one per pit anticlockwise

3. **Capture Check**: If last stone lands in opponent's pit
   - If resulting count is even and >0, capture all stones

4. **Tuz Check**: If last stone lands in opponent's pit
   - If resulting count is exactly 3, may create tuz
   - Check restrictions (not rightmost, not opposite to opponent's tuz, player doesn't have tuz)

5. **Tuz Collection**: Move stones from player's tuz to kazan

6. **Turn Switch**: Change current player

7. **Game Over Check**: Check if either player has no legal moves

## AI Implementation

### Difficulty Levels

- **Easy**: Random legal move
- **Medium**: Greedy with 2-ply lookahead (minimax)
- **Hard**: Deep search with 4-ply lookahead and alpha-beta pruning

### Evaluation Function

The AI evaluates positions based on:
- Stone count difference in kazans
- Presence of tuz (bonus/penalty)
- Potential future captures (stones in pits)

## Localization

Translation files are in `client/src/i18n/locales/`:
- `en.json` - English
- `ru.json` - Russian
- `ky.json` - Kyrgyz

All UI text is driven by these translation files. To add a new language:
1. Create a new JSON file with all translation keys
2. Register it in `client/src/i18n/i18n.js`

## Online Multiplayer

### Server Architecture

- Uses Socket.io for real-time communication
- Games stored in memory (Map structure)
- Room codes are 6-character alphanumeric strings
- Automatic cleanup of old games (1 hour timeout)

### Message Protocol

**Client → Server:**
- `createRoom`: Create a new game room
- `joinRoom`: Join an existing room
- `move`: Send a move to the server
- `newGame`: Start a new game in the room

**Server → Client:**
- `roomCreated`: Room created successfully
- `roomJoined`: Successfully joined a room
- `playerJoined`: Another player joined
- `playerLeft`: A player left the room
- `move`: Broadcast move to all players
- `gameError`: Error occurred

### Security

- Server validates all moves before accepting them
- Board state is validated (total stones, structure)
- Prevents cheating by validating move legality

## Adding New Features

### Adding a New Game Mode

1. Add mode constant to `GAME_MODES` in `gameLogic.js`
2. Add UI option in `GameModeSelector.js`
3. Implement mode-specific logic in `Play.js`
4. Add translations for the new mode

### Modifying Game Rules

1. Update `makeMove()` function in `gameLogic.js`
2. Update server-side validation in `server/gameLogic.js`
3. Update rules documentation in `Rules.js`
4. Add/update translations

### Improving AI

1. Modify evaluation function in `evaluateBoard()`
2. Adjust search depth in `ai.js`
3. Add opening book or endgame tablebase (optional)


