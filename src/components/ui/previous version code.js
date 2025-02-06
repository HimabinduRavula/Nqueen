
import React, { useState, useEffect, useCallback } from 'react';
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
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    resetGame();
  }, [boardSize]);

  const isUnderAttack = useCallback((board, row, col) => {
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
  }, []);

  const updateConflicts = useCallback((newBoard) => {
    const n = newBoard.length;
    const newConflicts = Array(n).fill().map(() => Array(n).fill(false));

    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) {
        if (newBoard[i][j] && isUnderAttack(newBoard, i, j)) {
          newConflicts[i][j] = true;
        }
      }
    }

    setConflicts(newConflicts);
    return newConflicts;
  }, [isUnderAttack]);

  const handleSquareClick = useCallback((row, col) => {
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
  }, [board, boardSize, gameWon, updateConflicts]);

  const handleTouchStart = (row, col) => {
    setSelectedSquare({ row, col });
  };

  const handleTouchEnd = () => {
    setSelectedSquare(null);
  };

  const resetGame = useCallback(() => {
    setBoard(Array(boardSize).fill().map(() => Array(boardSize).fill(false)));
    setConflicts(Array(boardSize).fill().map(() => Array(boardSize).fill(false)));
    setAttempts(10);
    setGameWon(false);
    setMessage('');
    setSelectedSquare(null);
    setShowSolutions(false);
  }, [boardSize]);

  const getSquareColor = (row, col, hasQueen, hasConflict) => {
    if (hasConflict) return 'bg-red-200 hover:bg-red-300';
    if (selectedSquare?.row === row && selectedSquare?.col === col) {
      return 'bg-yellow-200 hover:bg-yellow-300';
    }
    return (row + col) % 2 === 0 ? 'bg-blue-200 hover:bg-blue-300' : 'bg-green-200 hover:bg-green-300';
  };

  const generateSolutions = useCallback(() => {
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
  }, [boardSize]);

  const renderSolutionBoard = useCallback((solution) => (
    <div 
      key={Math.random()}
      className="grid gap-0.5 sm:gap-1 mx-auto mb-2" 
      style={{ 
        gridTemplateColumns: `repeat(${boardSize}, minmax(0, 1fr))`,
        width: '100%',
        maxWidth: isMobile ? '150px' : '300px'
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
            {hasQueen && <Crown className="w-3 h-3 sm:w-4 sm:h-4 md:w-6 md:h-6 text-purple-700" />}
          </div>
        ))
      ))}
    </div>
  ), [boardSize, isMobile]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-2 sm:p-4">
      <div className="bg-white rounded-lg shadow-xl p-3 sm:p-6 w-full max-w-2xl">
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-center mb-3 sm:mb-6">
          N-Queens Game
        </h1>
        
        <div className="flex flex-col sm:flex-row justify-center gap-2 sm:gap-4 mb-4">
          <select 
            value={boardSize}
            onChange={(e) => setBoardSize(Number(e.target.value))}
            className="px-3 sm:px-4 py-2 border rounded bg-white hover:bg-gray-50 text-sm sm:text-base"
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
            className="flex items-center justify-center px-3 sm:px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm sm:text-base"
          >
            {showInstructions ? <Info className="mr-1 sm:mr-2 w-4 h-4 sm:w-5 sm:h-5" /> : <HelpCircle className="mr-1 sm:mr-2 w-4 h-4 sm:w-5 sm:h-5" />}
            {showInstructions ? 'Hide Rules' : 'Show Rules'}
          </button>

          <button 
            onClick={resetGame}
            className="flex items-center justify-center px-3 sm:px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 text-sm sm:text-base"
          >
            <RotateCcw className="mr-1 sm:mr-2 w-4 h-4 sm:w-5 sm:h-5" />
            Reset
          </button>

          {attempts <= 5 && (
            <button 
              onClick={generateSolutions}
              className="flex items-center justify-center px-3 sm:px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 text-sm sm:text-base"
            >
              <CheckCircle className="mr-1 sm:mr-2 w-4 h-4 sm:w-5 sm:h-5" />
              Solutions
            </button>
          )}
        </div>

        {showInstructions && (
          <div className="mb-4 p-3 sm:p-4 bg-blue-50 rounded text-sm sm:text-base">
            <h2 className="font-bold mb-2">How to Play:</h2>
            <ul className="list-disc pl-4 sm:pl-5 space-y-1">
              <li>Place exactly {boardSize} queens on the board</li>
              <li>No two queens can attack each other</li>
              <li>Queens can move horizontally, vertically, and diagonally</li>
              <li>Red highlights show conflicting positions</li>
              <li>Click a square to place or remove a queen</li>
              <li>You have {attempts} attempts to solve the puzzle</li>
            </ul>
          </div>
        )}

        <div 
          className="grid gap-0.5 sm:gap-1 mx-auto mb-4" 
          style={{ 
            gridTemplateColumns: `repeat(${boardSize}, minmax(0, 1fr))`,
            width: '100%',
            maxWidth: isMobile ? '90vw' : '500px',
            padding: '0 0.5rem'
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
                onTouchStart={() => handleTouchStart(i, j)}
                onTouchEnd={handleTouchEnd}
                onMouseEnter={() => setSelectedSquare({ row: i, col: j })}
                onMouseLeave={() => setSelectedSquare(null)}
                disabled={attempts === 0 || gameWon}
              >
                {hasQueen && (
                  <Crown 
                    className={`w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8 
                      ${conflicts[i][j] ? 'text-red-600' : 'text-purple-700'}`} 
                  />
                )}
              </button>
            ))
          ))}
        </div>

        {showSolutions && (
          <div className="mt-4">
            <h3 className="text-lg md:text-xl font-bold text-center mb-2 sm:mb-3">
              Possible Solutions
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-4">
              {solutions.slice(0, 6).map(renderSolutionBoard)}
            </div>
            {solutions.length > 6 && (
              <p className="text-center text-xs sm:text-sm text-gray-600 mt-2">
                ... and {solutions.length - 6} more solutions
              </p>
            )}
          </div>
        )}

        <div className="text-center space-y-1 sm:space-y-2">
          <p className="text-sm sm:text-lg font-semibold">
            Attempts left: <span className={attempts <= 3 ? 'text-red-500' : ''}>{attempts}</span>
          </p>
          {message && (
            <p className={`text-sm sm:text-lg font-medium ${gameWon ? 'text-green-600' : 'text-blue-600'}`}>
              {message}
            </p>
          )}
          {attempts === 0 && !gameWon && (
            <p className="text-sm sm:text-lg text-red-500 font-medium">Game Over! Try again?</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default EnhancedNQueensGame;