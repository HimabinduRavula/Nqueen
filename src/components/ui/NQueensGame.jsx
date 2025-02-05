import React, { useState, useEffect } from 'react';
import { Crown, Info, HelpCircle, RotateCcw, CheckCircle } from 'lucide-react';

const EnhancedNQueensGame = () => {
  const [boardSize, setBoardSize] = useState(4);
  const [board, setBoard] = useState(Array(4).fill().map(() => Array(4).fill(false)));
  const [attempts, setAttempts] = useState(10);
  const [message, setMessage] = useState('');
  const [gameWon, setGameWon] = useState(false);
  const [showInstructions, setShowInstructions] = useState(false);
  const [conflicts, setConflicts] = useState(Array(4).fill().map(() => Array(4).fill(false)));
  const [selectedSquare, setSelectedSquare] = useState(null);
  const [showSolutions, setShowSolutions] = useState(false);
  const [solutions, setSolutions] = useState([]);
  const [instructionMode, setInstructionMode] = useState('rules');

  // Initialize or reset the board when size changes
  useEffect(() => {
    resetGame();
  }, [boardSize]);

  // Check if a position is under attack
  const isUnderAttack = (board, row, col) => {
    const n = board.length;
    
    // Check row and column
    for (let i = 0; i < n; i++) {
      if (board[row][i] && i !== col) return true;
      if (board[i][col] && i !== row) return true;
    }

    // Check diagonals
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) {
        if (board[i][j] && (i !== row || j !== col)) {
          if (Math.abs(i - row) === Math.abs(j - col)) return true;
        }
      }
    }

    return false;
  };

  // Update conflict highlights
  const updateConflicts = (newBoard) => {
    const n = newBoard.length;
    const newConflicts = Array(n).fill().map(() => Array(n).fill(false));

    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) {
        if (newBoard[i][j]) {
          if (isUnderAttack(newBoard, i, j)) {
            newConflicts[i][j] = true;
          }
        }
      }
    }

    setConflicts(newConflicts);
    return newConflicts;
  };

  // Handle queen placement
  const handleSquareClick = (row, col) => {
    if (gameWon) return;

    const newBoard = board.map(row => [...row]);
    newBoard[row][col] = !newBoard[row][col];
    setBoard(newBoard);

    const newConflicts = updateConflicts(newBoard);
    
    // Count queens and check for valid solution
    const queensCount = newBoard.flat().filter(cell => cell).length;
    const hasConflicts = newConflicts.flat().some(cell => cell);

    if (queensCount === boardSize && !hasConflicts) {
      setGameWon(true);
      setMessage('Congratulations! You solved the puzzle! 🎉');
    } else if (queensCount > boardSize) {
      setMessage(`Too many queens! You need exactly ${boardSize} queens.`);
    } else {
      setMessage('');
    }

    setAttempts(prev => prev - 1);
  };

  // Reset game state
  const resetGame = () => {
    setBoard(Array(boardSize).fill().map(() => Array(boardSize).fill(false)));
    setConflicts(Array(boardSize).fill().map(() => Array(boardSize).fill(false)));
    setAttempts(10);
    setGameWon(false);
    setMessage('');
    setSelectedSquare(null);
    setShowSolutions(false);
  };

  // Get square background color
  const getSquareColor = (row, col, hasQueen, hasConflict) => {
    if (hasConflict) return 'bg-red-200 hover:bg-red-300';
    if (selectedSquare?.row === row && selectedSquare?.col === col) {
      return 'bg-yellow-200 hover:bg-yellow-300';
    }
    return (row + col) % 2 === 0 ? 'bg-blue-200 hover:bg-blue-300' : 'bg-green-200 hover:bg-green-300';
  };

  // Generate solutions
  const generateSolutions = () => {
    const solveNQueens = (n) => {
      const solutions = [];
      
      const isSafe = (board, row, col) => {
        for (let i = 0; i < row; i++) {
          if (board[i] === col || 
              board[i] - i === col - row || 
              board[i] + i === col + row) {
            return false;
          }
        }
        return true;
      };

      const solve = (board, row) => {
        if (row === board.length) {
          solutions.push([...board]);
          return;
        }

        for (let col = 0; col < board.length; col++) {
          if (isSafe(board, row, col)) {
            board[row] = col;
            solve(board, row + 1);
            board[row] = -1;
          }
        }
      };

      const initialBoard = new Array(n).fill(-1);
      solve(initialBoard, 0);

      return solutions.map(solution => 
        solution.map((col, row) => 
          Array(n).fill(false).map((_, colIndex) => colIndex === col)
        )
      );
    };

    const foundSolutions = solveNQueens(boardSize);
    setSolutions(foundSolutions);
    setShowSolutions(true);
  };

  const renderSolutionBoard = (solution) => (
    <div 
      key={Math.random()}
      className="grid gap-1 mx-auto mb-2" 
      style={{ 
        gridTemplateColumns: `repeat(${boardSize}, minmax(0, 1fr))`,
        width: '100%',
        maxWidth: '300px'
      }}
    >
      {solution.map((row, i) => (
        row.map((hasQueen, j) => (
          <div
            key={`${i}-${j}`}
            className={`aspect-square border 
              ${hasQueen ? 'bg-purple-200' : (i + j) % 2 === 0 ? 'bg-blue-100' : 'bg-green-100'}
              transition-all duration-200 flex items-center justify-center`}
          >
            {hasQueen && <Crown className="w-6 h-6 text-purple-700" />}
          </div>
        ))
      ))}
    </div>
  );

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-2xl">
        <h1 className="text-3xl font-bold text-center mb-6">N-Queens Game</h1>
        
        <div className="flex justify-center gap-4 mb-4">
          <select 
            value={boardSize}
            onChange={(e) => setBoardSize(Number(e.target.value))}
            className="px-4 py-2 border rounded bg-white hover:bg-gray-50"
          >
            <option value={4}>4 x 4</option>
            <option value={6}>6 x 6</option>
            <option value={8}>8 x 8</option>
          </select>

          <button 
            onClick={() => {
              setShowInstructions(!showInstructions);
              setInstructionMode('rules');
            }}
            className="flex items-center px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            {showInstructions ? <Info className="mr-2" /> : <HelpCircle className="mr-2" />}
            {showInstructions ? 'Hide Rules' : 'Show Rules'}
          </button>

          <button 
            onClick={() => {
              setShowInstructions(!showInstructions);
              setInstructionMode('explanation');
            }}
            className="flex items-center px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600"
          >
            Problem Explanation
          </button>

          <button 
            onClick={resetGame}
            className="flex items-center px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            <RotateCcw className="mr-2" />
            Reset
          </button>

          {attempts <= 5 && (
            <button 
              onClick={generateSolutions}
              className="flex items-center px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
            >
              <CheckCircle className="mr-2" />
              Show Solutions
            </button>
          )}
        </div>

        {showInstructions && instructionMode === 'rules' && (
          <div className="mb-4 p-4 bg-blue-50 rounded">
            <h2 className="font-bold mb-2">How to Play:</h2>
            <ul className="list-disc pl-5 space-y-1">
              <li>Place exactly {boardSize} queens on the board</li>
              <li>No two queens can attack each other</li>
              <li>Queens can move horizontally, vertically, and diagonally</li>
              <li>Red highlights show conflicting positions</li>
              <li>Click a square to place or remove a queen</li>
              <li>You have {attempts} attempts to solve the puzzle</li>
            </ul>
          </div>
        )}

        {showInstructions && instructionMode === 'explanation' && (
          <div className="mb-4 p-4 bg-purple-50 rounded">
            <h2 className="font-bold mb-2">N-Queens Problem Explained</h2>
            <p className="mb-2">
              The N-Queens problem is a classic algorithmic challenge of placing N queens on an N×N chessboard so that no two queens threaten each other.
            </p>
            <h3 className="font-semibold mt-2">Key Problem Characteristics:</h3>
            <ul className="list-disc pl-5 space-y-1">
              <li>Queens can attack horizontally, vertically, and diagonally</li>
              <li>No two queens can share the same row, column, or diagonal</li>
              <li>Requires backtracking algorithm to find solutions</li>
              <li>Complexity increases exponentially with board size</li>
              <li>Total solutions vary: 2 for 4x4, 92 for 8x8 board</li>
            </ul>
            <p className="mt-2 text-sm italic">
              Solving this puzzle requires strategic thinking and understanding of queen movements.
            </p>
          </div>
        )}

        <div 
          className="grid gap-1 mx-auto mb-4" 
          style={{ 
            gridTemplateColumns: `repeat(${boardSize}, minmax(0, 1fr))`,
            width: '100%',
            maxWidth: '500px'
          }}
        >
          {board.map((row, i) => (
            row.map((hasQueen, j) => (
              <button
                key={`${i}-${j}`}
                className={`aspect-square border ${getSquareColor(i, j, hasQueen, conflicts[i][j])} 
                  transition-all duration-200 flex items-center justify-center
                  ${attempts === 0 || gameWon ? 'cursor-not-allowed opacity-80' : 'hover:opacity-90'}`}
                onClick={() => handleSquareClick(i, j)}
                onMouseEnter={() => setSelectedSquare({ row: i, col: j })}
                onMouseLeave={() => setSelectedSquare(null)}
                disabled={attempts === 0 || gameWon}
              >
                {hasQueen && <Crown className={`w-8 h-8 ${conflicts[i][j] ? 'text-red-600' : 'text-purple-700'}`} />}
              </button>
            ))
          ))}
        </div>

        {showSolutions && (
          <div className="mt-4">
            <h3 className="text-xl font-bold text-center mb-3">Possible Solutions</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {solutions.slice(0, 6).map(renderSolutionBoard)}
            </div>
            {solutions.length > 6 && (
              <p className="text-center text-sm text-gray-600 mt-2">
                ... and {solutions.length - 6} more solutions
              </p>
            )}
          </div>
        )}

        <div className="text-center space-y-2">
          <p className="text-lg font-semibold">
            Attempts left: <span className={attempts <= 3 ? 'text-red-500' : ''}>{attempts}</span>
          </p>
          {message && (
            <p className={`text-lg font-medium ${gameWon ? 'text-green-600' : 'text-blue-600'}`}>
              {message}
            </p>
          )}
          {attempts === 0 && !gameWon && (
            <p className="text-red-500 font-medium">Game Over! Try again?</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default EnhancedNQueensGame;