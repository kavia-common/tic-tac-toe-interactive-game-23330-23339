# Tic Tac Toe — Ocean Professional

A modern, clean React Tic Tac Toe game UI. Features a centered 3×3 game board, game status header, and controls, with a professional blue and amber theme.

## Features
- Player vs Player and Player vs Computer modes
- Win/Draw/Next Turn status display
- Reset board and end game controls
- Smooth transitions, subtle shadows, rounded corners, and soft gradients
- Minimal dependencies (React + CSS)

## Getting Started

In the project directory:

### `npm start`
Runs the app in development mode.  
Open http://localhost:3000 to view it in your browser.

### `npm test`
Runs the tests in watch mode.

### `npm run build`
Builds the app for production to the `build` folder.

## How to Play
1. Choose a mode: “Player vs Player” or “Player vs Computer”.
2. Click “Start Game” to begin.
3. Click a cell in the 3×3 grid to place your mark.
   - PvP: Players alternate as X and O.
   - PvC: You play as X; the computer plays as O with a simple but effective AI.
4. The status badge shows whose turn it is, or announces a win/draw.
5. Use “Reset Board” to clear the current board. Use “End Game” to exit back to the pre-start state.

## Design Theme: Ocean Professional
- Background: `#f9fafb`
- Surface: `#ffffff`
- Text: `#111827`
- Primary (Blue): `#2563EB`
- Secondary (Amber): `#F59E0B`
- Error: `#EF4444`
- Gradient: from-blue-500/10 to gray-50 effect via layered radial and linear backgrounds

The UI emphasizes clarity and depth with:
- Subtle shadows
- Rounded corners
- Soft gradients and smooth transitions

## Code Structure
- `src/App.js` — Game logic and UI components (board, controls, status)
- `src/App.css` — Ocean Professional theme styles and component styling
- `src/index.js` / `src/index.css` — App bootstrapping and base styles
- `src/App.test.js` — Basic UI tests

No external UI frameworks are used, keeping the app lightweight and easy to customize.
