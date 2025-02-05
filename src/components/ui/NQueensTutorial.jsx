import React, { useState } from 'react';
import { Crown, ArrowRight, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

const TutorialStep = ({ title, content, board = null }) => (
  <div className="space-y-4">
    <h3 className="text-xl font-bold">{title}</h3>
    <p>{content}</p>
    {board && (
      <div className="grid gap-1 mx-auto" 
        style={{ 
          gridTemplateColumns: 'repeat(4, minmax(0, 1fr))',
          width: '200px'
        }}>
        {board.map((row, i) => (
          <React.Fragment key={i}>
            {row.map((cell, j) => (
              <div
                key={`${i}-${j}`}
                className={`aspect-square border ${
                  (i + j) % 2 === 0 ? 'bg-blue-200' : 'bg-green-200'
                } flex items-center justify-center ${
                  cell === 2 ? 'bg-yellow-200' : ''
                }`}
              >
                {cell === 1 && <Crown size={16} className="text-purple-700" />}
              </div>
            ))}
          </React.Fragment>
        ))}
      </div>
    )}
  </div>
);

const NQueensTutorial = () => {
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    {
      title: "Understanding the N-Queens Problem",
      content: "The N-Queens puzzle is about placing N chess queens on an N×N chessboard so that no two queens threaten each other. This means no two queens can share the same row, column, or diagonal.",
      board: [
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0]
      ]
    },
    {
      title: "Queen's Movement",
      content: "A queen can move horizontally, vertically, and diagonally. The highlighted squares show where a queen can attack.",
      board: [
        [1, 2, 2, 2],
        [2, 2, 2, 2],
        [2, 2, 2, 2],
        [2, 2, 2, 2]
      ]
    },
    {
      title: "Backtracking Approach",
      content: "We solve this puzzle using backtracking. We start by placing a queen in the first column, then try to place queens in subsequent columns. If we can't place a queen safely, we go back and try a different position.",
      board: [
        [1, 0, 0, 0],
        [0, 0, 1, 0],
        [0, 0, 0, 0],
        [0, 1, 0, 0]
      ]
    },
    {
      title: "Complete Solution",
      content: "Here's one complete solution for a 4×4 board. Notice how no queen can attack another queen.",
      board: [
        [0, 1, 0, 0],
        [0, 0, 0, 1],
        [1, 0, 0, 0],
        [0, 0, 1, 0]
      ]
    }
  ];

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <TutorialStep 
        title={steps[currentStep].title}
        content={steps[currentStep].content}
        board={steps[currentStep].board}
      />
      
      <div className="flex justify-between mt-6">
        <Button
          variant="outline"
          onClick={() => setCurrentStep(prev => Math.max(0, prev - 1))}
          disabled={currentStep === 0}
        >
          <ArrowLeft className="mr-2" /> Previous
        </Button>
        <Button
          variant="outline"
          onClick={() => setCurrentStep(prev => Math.min(steps.length - 1, prev + 1))}
          disabled={currentStep === steps.length - 1}
        >
          Next <ArrowRight className="ml-2" />
        </Button>
      </div>
    </div>
  );
};

export default NQueensTutorial;
