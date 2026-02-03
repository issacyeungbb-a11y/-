import React from 'react';

interface MultiplicationTableProps {
  answers: Record<string, number>; // Key format: "r-c"
  activeCell: { r: number, c: number } | null;
  onCellClick: (r: number, c: number) => void;
  currentInput: string; // New prop to show what is being typed
}

export const MultiplicationTable: React.FC<MultiplicationTableProps> = ({ answers, activeCell, onCellClick, currentInput }) => {
  const range = [1, 2, 3, 4, 5, 6, 7, 8, 9];

  return (
    <div className="w-full max-w-lg overflow-x-auto bg-slate-800/80 p-2 rounded-xl border border-slate-600 shadow-2xl">
      <div className="grid grid-cols-10 gap-1 min-w-[300px]">
        {/* Header Row */}
        <div className="bg-slate-700/50 rounded flex items-center justify-center text-slate-400 font-bold text-xs">×</div>
        {range.map(c => (
          <div key={`h-${c}`} className="bg-slate-700/50 rounded flex items-center justify-center text-yellow-400 font-bold text-sm h-8">
            {c}
          </div>
        ))}

        {/* Rows */}
        {range.map(r => (
          <React.Fragment key={`row-${r}`}>
            {/* Row Header */}
            <div className="bg-slate-700/50 rounded flex items-center justify-center text-cyan-400 font-bold text-sm h-8">
              {r}
            </div>
            {/* Cells */}
            {range.map(c => {
              const key = `${r}-${c}`;
              const val = answers[key];
              const isCorrect = val === r * c;
              const isActive = activeCell?.r === r && activeCell?.c === c;

              return (
                <button
                  key={key}
                  onClick={() => onCellClick(r, c)}
                  className={`
                    rounded flex items-center justify-center text-sm font-bold transition-all relative overflow-hidden
                    ${isActive ? 'bg-indigo-600 ring-2 ring-yellow-400 scale-110 z-10 shadow-lg' : ''}
                    ${!isActive && val ? (isCorrect ? 'bg-green-600 text-white' : 'bg-red-600 text-white') : ''}
                    ${!isActive && !val ? 'bg-slate-700 hover:bg-slate-600 text-slate-300' : ''}
                    h-8
                  `}
                >
                  {/* If active, show what user is typing (currentInput), otherwise show saved value */}
                  {isActive ? (currentInput || '') : (val || '')}
                  
                  {/* Visual flourish for completed cells */}
                  {!isActive && isCorrect && (
                    <span className="absolute inset-0 bg-green-400 opacity-20 animate-pulse"></span>
                  )}
                </button>
              );
            })}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};