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

  useEffect(() => {
    resetGame();
  }, [boardSize]);

  const isUnderAttack = (board, row, col) => {
    const n = board.length;
    
    for (let i = 0; i < n; i++) {
      if (board[row][i] && i !== col) return true;
      if (board[i][col] && i !== row) return true;
    }

    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) {
        if (board[i][j] && (i !== row || j !== col)) {
          if (Math.abs(i - row) === Math.abs(j - col)) return true;
        }
      }
    }

    return false;
  };

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

  const handleSquareClick = (row, col) => {
    if (gameWon) return;

    const newBoard = board.map(row => [...row]);
    newBoard[row][col] = !newBoard[row][col];
    setBoard(newBoard);

    const newConflicts = updateConflicts(newBoard);
    
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

  const resetGame = () => {
    setBoard(Array(boardSize).fill().map(() => Array(boardSize).fill(false)));
    setConflicts(Array(boardSize).fill().map(() => Array(boardSize).fill(false)));
    setAttempts(10);
    setGameWon(false);
    setMessage('');
    setSelectedSquare(null);
    setShowSolutions(false);
  };

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

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-6">
  <div className="bg-white rounded-lg shadow-2xl p-8 w-full max-w-5xl mx-auto">
    <h1 className="text-4xl font-bold text-center text-gray-900 mb-6">N-Queens Game</h1>

    <div className="flex flex-wrap justify-center gap-4 mb-6">
      <select
        value={boardSize}
        onChange={(e) => setBoardSize(Number(e.target.value))}
        className="px-5 py-3 text-lg border rounded-lg bg-yellow-200 hover:bg-yellow-200 text-black focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all"
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

        {showInstructions && (
          <div className="mb-4 p-5 bg-blue-100 text-gray-800 rounded-lg shadow-md">
            {instructionMode === 'rules' ? (
              <>
                <h2 className="font-bold mb-3 text-lg text-blue-700">How to Play:</h2>
                <ul className="list-disc pl-6 space-y-2 marker:text-blue-500">
                  <li>Place exactly {boardSize} queens on the board</li>
                  <li>No two queens can attack each other</li>
                  <li>Queens can move horizontally, vertically, and diagonally</li>
                  <li className="text-red-500 font-semibold">Red highlights show conflicting positions</li>
                  <li>Click a square to place or remove a queen</li>
                  <li>You have {attempts} attempts remaining</li>
                </ul>
              </>
            ) : (
              <>
                <h2 className="font-bold mb-3 text-lg text-blue-700">N-Queens Problem Explained</h2>
                <p className="mb-3 leading-relaxed">
                  The N-Queens problem is a classic algorithmic challenge of placing N queens on an N×N chessboard so that no two queens threaten each other.
                </p>
                <ul className="list-disc pl-6 space-y-2 marker:text-blue-500">
                  <li>Queens can attack horizontally, vertically, and diagonally</li>
                  <li>No two queens can share the same row, column, or diagonal</li>
                  <li className="font-semibold">Requires backtracking algorithm to find solutions</li>
                  <li>Complexity increases exponentially with board size</li>
                  <li className="font-bold text-blue-600">Total solutions vary: 2 for 4x4, 92 for 8x8 board</li>
                </ul>
              </>
            )}
          </div>
        )}

        {/* Game Board with Fixed Sizing */}
        <div className="flex justify-center w-full">
          <div className="w-[480px] h-[480px] max-w-full aspect-square mx-auto">
            <div 
              className="grid h-full w-full"
              style={{ 
                gridTemplateColumns: `repeat(${boardSize}, 1fr)`,
                gap: '2px'
              }}
            >
              {board.map((row, i) => (
                row.map((hasQueen, j) => (
                  <button
                    key={`${i}-${j}`}
                    className={`relative w-full h-full flex items-center justify-center
                      ${conflicts[i][j] ? 'bg-red-200 hover:bg-red-300' :
                      selectedSquare?.row === i && selectedSquare?.col === j ? 'bg-yellow-200 hover:bg-yellow-300' :
                      (i + j) % 2 === 0 ? 'bg-blue-200 hover:bg-blue-300' : 'bg-green-200 hover:bg-green-300'}
                      transition-colors`}
                      style={{ width: `${480 / boardSize}px`, height: `${480 / boardSize}px` }}
                    onClick={() => handleSquareClick(i, j)}
                    onMouseEnter={() => setSelectedSquare({ row: i, col: j })}
                    onMouseLeave={() => setSelectedSquare(null)}
                    disabled={attempts === 0 || gameWon}
                  >
                    {hasQueen && (
                      <Crown 
                        className={`w-6 h-6 ${conflicts[i][j] ? 'text-red-600' : 'text-purple-700'}`}
                      />
                    )}
                  </button>
                ))
              ))}
            </div>
          </div>
        </div>

        {showSolutions && (
          <div className="mt-4">
            <h3 className="text-xl font-bold text-center mb-3">Possible Solutions</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {solutions.slice(0, 6).map((solution, solutionIndex) => (
                <div 
                  key={solutionIndex}
                  className="aspect-square"
                >
                  <div className="grid h-full w-full" style={{ 
                    gridTemplateColumns: `repeat(${boardSize}, 1fr)`,
                    gap: '1px'
                  }}>
                    {solution.map((row, i) => (
                      row.map((hasQueen, j) => (
                        <div
                          key={`${i}-${j}`}
                          className={`flex items-center justify-center
                            ${hasQueen ? 'bg-purple-200' : (i + j) % 2 === 0 ? 'bg-blue-100' : 'bg-green-100'}`}
                        >
                          {hasQueen && <Crown className="w-6 h-6 text-purple-700" />}
                        </div>
                      ))
                    ))}
                  </div>
                </div>
              ))}
            </div>
            {solutions.length > 6 && (
              <p className="text-center text-sm text-gray-600 mt-2">
                ... and {solutions.length - 6} more solutions
              </p>
            )}
          </div>
        )}

        <div className="text-center space-y-2 mt-4">
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