import React from 'react';

interface VisualGridProps {
  a: number;
  b: number;
}

export const VisualGrid: React.FC<VisualGridProps> = ({ a, b }) => {
  // Generate an array for rows (a) and columns (b)
  const rows = Array.from({ length: a }, (_, i) => i);
  const cols = Array.from({ length: b }, (_, i) => i);
  
  return (
    <div className="flex flex-col items-center animate-bounce-short">
      <div className="bg-slate-800 p-4 rounded-xl border-2 border-slate-600 shadow-inner">
        <div className="flex flex-col gap-2">
          {rows.map((rowIdx) => (
            <div key={rowIdx} className="flex gap-2 justify-center">
              {cols.map((colIdx) => (
                <div 
                  key={`${rowIdx}-${colIdx}`}
                  className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-yellow-400 flex items-center justify-center text-yellow-900 font-bold shadow-sm transform transition-all hover:scale-110"
                >
                  ★
                </div>
              ))}
              <span className="text-slate-400 self-center ml-2 text-sm">{b}</span>
            </div>
          ))}
        </div>
      </div>
      <p className="mt-2 text-slate-300 text-sm">
        {a} 行，每行 {b} 粒星星 = {a * b}
      </p>
    </div>
  );
};