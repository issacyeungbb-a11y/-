import React, { useState } from 'react';

interface VerticalDrillProps {
  a: number;
  b: number;
  userInputs: string[]; // Answer digits: [Thousands, Hundreds, Tens, Units] (Fixed size 4)
  userCarries: { tens: string; hundreds: string }; // Carries for specific columns
  activeField: 'UNITS' | 'CARRY_TENS' | 'TENS' | 'CARRY_HUNDREDS' | 'HUNDREDS' | 'THOUSANDS' | 'DONE'; 
  hintText: string;
}

export const VerticalDrill: React.FC<VerticalDrillProps> = ({ a, b, userInputs, userCarries, activeField, hintText }) => {
  const hundredsA = Math.floor(a / 100);
  const tensA = Math.floor((a % 100) / 10);
  const unitsA = a % 10;
  
  const isThreeDigit = a >= 100;

  // Helpers to determine which numbers to circle/highlight
  const highlightUnits = activeField === 'UNITS';
  const highlightTens = activeField === 'TENS';
  const highlightHundreds = activeField === 'HUNDREDS' || activeField === 'THOUSANDS'; 
  
  const [activeHint, setActiveHint] = useState<boolean>(false);

  // Helper to render answer box
  const renderAnswerBox = (val: string, isActive: boolean, placeholder: string = "?") => (
    <div 
      className={`
        w-14 h-16 md:w-20 md:h-24 rounded-xl border-4 flex items-center justify-center text-3xl md:text-5xl transition-all font-mono font-bold relative
        ${isActive 
          ? 'border-yellow-400 bg-indigo-900 shadow-[0_0_15px_rgba(250,204,21,0.5)] scale-110 z-10' 
          : val 
            ? 'border-green-500 bg-green-900/30 text-green-300' 
            : 'border-slate-700 bg-slate-900/30 text-slate-600'}
      `}
    >
      {isActive && !val ? <span className="animate-pulse text-yellow-500/50">{placeholder}</span> : val}
    </div>
  );

  // Helper to render carry box
  const renderCarryBox = (val: string, isActive: boolean) => (
     <div 
       className={`
         w-8 h-8 md:w-10 md:h-10 border-2 rounded-lg flex items-center justify-center text-lg md:text-xl font-bold transition-all mx-auto
         ${isActive 
            ? 'border-yellow-400 bg-yellow-900/50 text-yellow-300 animate-pulse scale-125 shadow-[0_0_10px_orange] z-30' 
            : val 
              ? 'border-green-500/50 text-green-400 bg-green-900/20' 
              : 'border-slate-700/30 text-transparent'}
       `}
     >
       {val}
       {isActive && hintText && (
           <div className="absolute -top-14 left-1/2 -translate-x-1/2 whitespace-nowrap z-50 animate-bounce-short pointer-events-none">
            <div className="bg-yellow-400 text-indigo-900 px-3 py-1 rounded-lg font-bold text-sm shadow-md relative">
              {hintText}
              <div className="absolute bottom-[-6px] left-1/2 -translate-x-1/2 w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[6px] border-t-yellow-400"></div>
            </div>
          </div>
       )}
     </div>
  );

  // Helper to render operand digits with "Circling" style
  const renderOperand = (val: number, isHighlighted: boolean) => (
    <div 
      className={`
        relative flex items-center justify-center w-12 h-12 md:w-20 md:h-20 transition-all duration-300 rounded-full mx-auto
        ${isHighlighted 
          ? 'ring-4 ring-pink-500 bg-pink-500/20 shadow-[0_0_20px_rgba(236,72,153,0.4)] cursor-pointer scale-110 z-20' 
          : 'text-cyan-300'}
      `}
      onMouseEnter={() => isHighlighted && setActiveHint(true)}
      onMouseLeave={() => setActiveHint(false)}
      onClick={() => isHighlighted && setActiveHint(!activeHint)}
    >
      <span className="text-5xl md:text-7xl font-mono font-black">{val}</span>
      
      {/* Tooltip Hint */}
      {isHighlighted && activeHint && hintText && (
         <div className="absolute -top-16 left-1/2 -translate-x-1/2 whitespace-nowrap z-50 animate-bounce-short pointer-events-none">
           <div className="bg-pink-600 text-white px-4 py-2 rounded-xl font-bold text-xl shadow-xl border-2 border-white relative">
             {hintText}
             <div className="absolute bottom-[-8px] left-1/2 -translate-x-1/2 w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-t-[8px] border-t-pink-600"></div>
           </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="flex flex-col items-center">
      <div className="bg-slate-800/90 p-4 md:p-8 rounded-3xl border-4 border-slate-600 shadow-2xl relative mt-4 md:mt-8">
        
        {/* Grid Layout: 5 Columns [Op, Thousands, Hundreds, Tens, Units] */}
        <div className="grid grid-cols-[2rem_auto_auto_auto_auto] gap-x-1 md:gap-x-2 gap-y-1 text-right items-center justify-items-center">
          
          {/* --- Row 0: Carry Row --- */}
          <div></div> {/* Op */}
          <div></div> {/* Th */}
          <div className="flex justify-center w-full h-10 items-end pb-1 relative">
             {/* Carry for Hundreds (above Hundreds col) */}
             {renderCarryBox(userCarries.hundreds, activeField === 'CARRY_HUNDREDS')}
          </div>
          <div className="flex justify-center w-full h-10 items-end pb-1 relative">
             {/* Carry for Tens (above Tens col) */}
             {renderCarryBox(userCarries.tens, activeField === 'CARRY_TENS')}
          </div>
          <div></div> {/* Units */}

          {/* --- Row 1: Headers --- */}
          <div></div> 
          <div className="text-slate-500 font-bold text-center text-xs md:text-sm w-full">千</div>
          <div className="text-slate-500 font-bold text-center text-xs md:text-sm w-full">百</div>
          <div className="text-slate-500 font-bold text-center text-xs md:text-sm w-full">十</div>
          <div className="text-slate-500 font-bold text-center text-xs md:text-sm w-full">個</div>

          {/* --- Row 2: Factor A --- */}
          <div></div>
          <div></div> 
          <div className="flex justify-center w-full">
             {isThreeDigit ? renderOperand(hundredsA, highlightHundreds) : <div className="w-12 md:w-20"></div>}
          </div>
          <div className="flex justify-center w-full">
             {renderOperand(tensA, highlightTens)}
          </div>
          <div className="flex justify-center w-full">
             {renderOperand(unitsA, highlightUnits)}
          </div>

          {/* --- Row 3: Factor B --- */}
          <div className="text-yellow-400 text-3xl md:text-4xl font-bold flex justify-center items-center pt-2">×</div>
          <div></div>
          <div></div>
          <div></div>
          <div className="flex justify-center w-full">
            {renderOperand(b, highlightUnits || highlightTens || highlightHundreds)}
          </div>

          {/* --- Row 4: Divider --- */}
          <div className="col-span-5 h-1.5 bg-slate-400 rounded-full my-3 w-full"></div>

          {/* --- Row 5: Answer Inputs --- */}
          <div></div> {/* Op Col Empty */}
          
          {/* Thousands Place */}
          <div className="flex justify-center">
             {renderAnswerBox(userInputs[0], activeField === 'THOUSANDS')}
          </div>

          {/* Hundreds Place */}
          <div className="flex justify-center">
             {renderAnswerBox(userInputs[1], activeField === 'HUNDREDS')}
          </div>

          {/* Tens Place */}
          <div className="flex justify-center">
             {renderAnswerBox(userInputs[2], activeField === 'TENS')}
          </div>

          {/* Units Place */}
          <div className="flex justify-center">
             {renderAnswerBox(userInputs[3], activeField === 'UNITS')}
          </div>

        </div>
      </div>
      
      <div className="mt-6 text-slate-300 text-center text-sm font-bold bg-slate-800 px-6 py-3 rounded-full border border-slate-600 shadow-lg">
         {(activeField === 'CARRY_TENS' || activeField === 'CARRY_HUNDREDS') 
            ? '進位記在頭頂！' 
            : '請計算粉紅色圈住的數字 (指住睇提示)'}
      </div>
    </div>
  );
};