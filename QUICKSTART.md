# Quick Start Guide

Get the Toguz Korgool game running in 5 minutes!

## Step 1: Install Dependencies

```bash
# Install root dependencies
npm install

# Install client dependencies
cd client
npm install

# Install server dependencies
cd ../server
npm install

# Return to root
cd ..
```

Or use the convenience script:
```bash
npm run install-all
```

## Step 2: Start the Application

### Option A: Run Both Servers Together
```bash
npm run dev
```

This starts both the backend (port 5000) and frontend (port 3000) simultaneously.

### Option B: Run Separately

**Terminal 1 - Backend:**
```bash
npm run server
```

**Terminal 2 - Frontend:**
```bash
npm run client
```

## Step 3: Play!

Open your browser and go to:
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000

## Game Modes

1. **Play vs Computer**: Choose difficulty and play against AI
2. **Play Online**: Create or join a room to play with friends
3. **Pass & Play**: Two players take turns on the same device

## Language Support

Click the language buttons in the header to switch between:
- English (EN)
- Russian (RU)
- Kyrgyz (KY)

## Troubleshooting

### Port Already in Use
If port 3000 or 5000 is already in use:
- **Frontend**: Set `PORT=3001` in `client/.env`
- **Backend**: Set `PORT=5001` in `server/.env` or use `PORT=5001 npm run server`

### Socket.io Connection Issues
- Make sure the backend is running before starting the frontend
- Check that `REACT_APP_SERVER_URL` in `client/.env` matches your backend URL

### Build Errors
- Make sure you're using Node.js v14 or higher
- Delete `node_modules` and reinstall: `rm -rf node_modules && npm install`

## Next Steps

- Read [README.md](./README.md) for detailed documentation
- Check [GAME_LOGIC.md](./GAME_LOGIC.md) to understand the game implementation
- See [DEPLOYMENT.md](./DEPLOYMENT.md) for production deployment

Enjoy playing Toguz Korgool! 🎮


