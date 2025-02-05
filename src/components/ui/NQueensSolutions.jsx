import React from 'react';

const NQueensSolutions = ({ size = 4 }) => {
  // Pre-calculated solutions for different board sizes
  const solutions = {
    4: [
      [[0,1,0,0],[0,0,0,1],[1,0,0,0],[0,0,1,0]],
      [[0,0,1,0],[1,0,0,0],[0,0,0,1],[0,1,0,0]]
    ],
    6: [
      [[0,0,0,1,0,0],[1,0,0,0,0,0],[0,0,0,0,1,0],[0,1,0,0,0,0],[0,0,0,0,0,1],[0,0,1,0,0,0]],
      [[0,0,1,0,0,0],[0,0,0,0,1,0],[0,1,0,0,0,0],[0,0,0,0,0,1],[1,0,0,0,0,0],[0,0,0,1,0,0]]
    ],
    8: [
      [[1,0,0,0,0,0,0,0],[0,0,0,0,1,0,0,0],[0,0,0,0,0,0,0,1],[0,0,0,0,0,1,0,0],
       [0,0,1,0,0,0,0,0],[0,0,0,0,0,0,1,0],[0,1,0,0,0,0,0,0],[0,0,0,1,0,0,0,0]],
      [[0,0,0,0,0,0,1,0],[0,0,1,0,0,0,0,0],[1,0,0,0,0,0,0,0],[0,0,0,0,1,0,0,0],
       [0,1,0,0,0,0,0,0],[0,0,0,1,0,0,0,0],[0,0,0,0,0,0,0,1],[0,0,0,0,0,1,0,0]]
    ]
  };

  // If solutions for the given size don't exist, return a message
  if (!solutions[size]) {
    return (
      <div className="p-4 text-center">
        <p className="text-red-500">No solutions available for {size}x{size} board.</p>
      </div>
    );
  }

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Sample Solutions for {size}x{size} Board</h2>
      <div className="flex flex-wrap gap-8 justify-center">
        {solutions[size].map((solution, solutionIndex) => (
          <div key={solutionIndex} className="border rounded p-4">
            <h3 className="text-center mb-2">Solution {solutionIndex + 1}</h3>
            <div className="grid gap-1" 
              style={{ 
                gridTemplateColumns: `repeat(${size}, minmax(0, 1fr))`,
                width: '200px'
              }}>
              {solution.map((row, i) => (
                <React.Fragment key={i}>
                  {row.map((cell, j) => (
                    <div
                      key={`${i}-${j}`}
                      className={`aspect-square border ${
                        (i + j) % 2 === 0 ? 'bg-blue-200' : 'bg-green-200'
                      } flex items-center justify-center`}
                    >
                      {cell === 1 && <div className="text-purple-700 text-xl">♕</div>}
                    </div>
                  ))}
                </React.Fragment>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NQueensSolutions;
