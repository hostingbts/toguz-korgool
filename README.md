# Toguz Korgool

A web-based implementation of the traditional Kyrgyz board game Toguz Korgool (also known as Togyzkumalak). Play this ancient game of strategy and calculation online!

## Features

- 🎮 Multiple game modes: vs Computer, Online Multiplayer, Pass & Play
- 🌍 Multi-language support: Kyrgyz, Kazakh, Russian, and English
- 📱 Fully responsive design for mobile, tablet, and desktop
- 🎨 Beautiful animations and intuitive UI
- 📚 Complete rules and history documentation
- 🤖 AI opponent with adjustable difficulty levels

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/YOUR_USERNAME/toguz-korgool.git
cd toguz-korgool
```

2. Install dependencies:
```bash
cd client
npm install
```

3. Start the development server:
```bash
npm start
```

The app will open at [http://localhost:3000](http://localhost:3000)

### Building for Production

```bash
cd client
npm run build
```

This creates an optimized production build in the `build` folder.

## Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed instructions on deploying to GitHub Pages.

Quick deployment:
```bash
cd client
npm run deploy
```

## Project Structure

```
toguz-korgool/
├── client/                 # React frontend application
│   ├── public/            # Static files
│   ├── src/
│   │   ├── components/   # React components
│   │   ├── pages/        # Page components
│   │   ├── game/         # Game logic
│   │   ├── i18n/         # Internationalization
│   │   └── styles/       # Global styles
│   └── package.json
├── server/                # Node.js backend (if applicable)
└── README.md
```

## Technologies Used

- **React** - UI framework
- **React Router** - Client-side routing
- **i18next** - Internationalization
- **Socket.io** - Real-time multiplayer (if server is running)
- **CSS3** - Styling and animations

## Game Rules

Toguz Korgool is a traditional mancala game played with 9 pits per player and 162 stones total. The objective is to capture more stones than your opponent.

Key rules:
- Players take turns picking up stones from their pits
- Stones are distributed counter-clockwise, one per pit
- Capture occurs when the last stone lands in an opponent's pit with an even number
- A "tuz" (special pit) can be created under certain conditions
- The game ends when a player cannot make a move

See the [Rules page](./client/src/pages/Rules.js) for complete game rules.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is open source and available under the MIT License.

## Contact

- Instagram: [@9korgool.kg](https://www.instagram.com/9korgool.kg/)
- Email: hosting.bts@gmail.com

## Acknowledgments

- Traditional Toguz Korgool players and enthusiasts
- The Kyrgyz, Kazakh, and Central Asian communities who have preserved this game
