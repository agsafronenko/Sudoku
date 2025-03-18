# Sudoku App

**[Play Sudoku Online](https://sudoku-app-demo.example.com)** - Try the live demo!

## Overview

Sudoku App is a modern, interactive Sudoku game and solver built with React + JavaScript. It features both a gameplay mode with multiple difficulty levels and a solver mode that can solve any valid Sudoku puzzle.

![Sudoku App Screenshot](public/screenshot.png)

## Features

### Game Mode
- Multiple difficulty levels (Very Easy, Easy, Medium, Hard, Expert)
- Hint system with limited hints based on difficulty
- Note-taking mode for planning your moves
- Check for incorrect cells with limited checks
- Keyboard navigation and input support
- Animations for cell selection, number input, and game completion
- Sound effects with mute option

### Solver Mode
- Input any Sudoku puzzle to solve
- Automatic validation to ensure the puzzle is solvable
- Quick solving with the efficient backtracking algorithm
- Clear visual presentation of the solution

## Controls

### Game Mode
- **Mouse**: Click cells to select, click numbers to input
- **Keyboard**:
  - **1-9**: Input numbers
  - **Delete/Backspace**: Clear selected cell
  - **Arrow Keys**: Navigate the board
  - **P**: Toggle pen/pencil (note) mode
  - **H**: Get a hint (if available)
  - **C**: Check for incorrect cells (if available)
  - **N**: Start a new game

### Solver Mode
- **Mouse**: Click cells to select, click numbers to input
- **Keyboard**:
  - **1-9**: Input numbers
  - **Delete/Backspace**: Clear selected cell
  - **Arrow Keys**: Navigate the board
  - **N**: Clear the board

## Technical Structure

The app is built with a clean architecture that separates concerns:

### Components
- `GameBoard`: Main component for game mode
- `SolverPage`: Main component for solver mode
- `Cell`: Individual cell rendering with highlighting
- `Controls`: Game controls UI
- `NumberPad`: Input pad for numbers
- `Modal`: Reusable modal for game messages
- `DifficultySelector`: Difficulty level selection

### Custom Hooks
- `useBoardState`: Manages the Sudoku board state
- `useInputHandler`: Handles user input logic
- `useKeyboardInput`: Manages keyboard interactions
- `useModal`: Controls modal state and actions
- `useAnimations`: Manages board animations

### Utilities
- `sudokuGenerator.js`: Generates random Sudoku puzzles
- `sudokuSolver.js`: Solves Sudoku puzzles using backtracking
- `soundUtils.js`: Manages sound effects

## Installation

```bash
# Clone the repository
git clone https://github.com/username/sudoku-app.git

# Navigate to the project directory
cd sudoku-app

# Install dependencies
npm install

# Start the development server
npm start
```

## Usage

After starting the app, you can:

1. Choose between "Play" and "Solve" modes
2. In Play mode, select a difficulty level to start a new game
3. In Solve mode, input your puzzle and click "Solve"

## Technologies Used

- React (Hooks)
- CSS3 (with animations)
- Audio APIs for sound effects

## Future Improvements

- Timer and score tracking
- User accounts and statistics
- More advanced solving techniques
- Mobile touch optimization
- Theme customization

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Thanks to all Sudoku enthusiasts and algorithm developers who shared their knowledge
- Inspired by classic Sudoku games and modern web app design
