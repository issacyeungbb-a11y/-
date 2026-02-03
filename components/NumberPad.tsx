import React from 'react';

interface NumberPadProps {
  onInput: (num: number) => void;
  onDelete: () => void;
  disabled?: boolean;
}

export const NumberPad: React.FC<NumberPadProps> = ({ onInput, onDelete, disabled }) => {
  const buttons = [1, 2, 3, 4, 5, 6, 7, 8, 9, 0];

  return (
    <div className="grid grid-cols-3 gap-1 w-full max-w-[240px] mx-auto mt-2">
      {buttons.map((num) => (
        <button
          key={num}
          onClick={() => onInput(num)}
          disabled={disabled}
          className={`
            bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-2 rounded-md shadow-[0_2px_0_rgb(55,48,163)] active:shadow-none active:translate-y-0.5 transition-all text-xl
            ${num === 0 ? 'col-start-2' : ''}
          `}
        >
          {num}
        </button>
      ))}
      <button
        onClick={onDelete}
        disabled={disabled}
        className="col-start-3 row-start-4 bg-slate-600 hover:bg-slate-500 text-white font-bold py-2 rounded-md shadow-[0_2px_0_rgb(71,85,105)] active:shadow-none active:translate-y-0.5 transition-all text-xl"
      >
        ⌫
      </button>
    </div>
  );
};