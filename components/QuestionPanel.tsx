import React, { useState, useEffect, useRef } from 'react';
import { Question } from '../types';

interface Props {
  question: Question;
  onSubmit: (answer: number) => void;
  lastAnswerCorrect: boolean | null;
  hint: string;
}

export const QuestionPanel: React.FC<Props> = ({ question, onSubmit, lastAnswerCorrect, hint }) => {
  const [input, setInput] = useState('');
  const [flash, setFlash] = useState<'correct' | 'wrong' | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setInput('');
    setFlash(null);
    inputRef.current?.focus();
  }, [question]);

  useEffect(() => {
    if (lastAnswerCorrect === null) return;
    setFlash(lastAnswerCorrect ? 'correct' : 'wrong');
    const t = setTimeout(() => setFlash(null), 600);
    return () => clearTimeout(t);
  }, [lastAnswerCorrect, question]);

  const handleSubmit = () => {
    const val = parseInt(input, 10);
    if (isNaN(val)) return;
    onSubmit(val);
    setInput('');
  };

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSubmit();
  };

  const numpadKeys = ['7','8','9','4','5','6','1','2','3','⌫','0','✓'];

  const handlePad = (key: string) => {
    if (key === '⌫') {
      setInput(prev => prev.slice(0, -1));
    } else if (key === '✓') {
      handleSubmit();
    } else {
      if (input.length < 5) setInput(prev => prev + key);
    }
  };

  const flashBg = flash === 'correct' ? 'bg-emerald-500/20 ring-2 ring-emerald-400' : flash === 'wrong' ? 'bg-rose-500/20 ring-2 ring-rose-400 animate-shake' : 'bg-slate-800/50 ring-1 ring-slate-600';

  return (
    <div className="glass rounded-2xl p-4 w-full flex flex-col gap-3">
      <div className={`rounded-xl p-4 text-center transition-all duration-200 ${flashBg}`}>
        <p className="text-3xl font-black text-white tracking-wider">{question.display}</p>
        {flash === 'correct' && <p className="text-emerald-400 font-bold mt-1 text-sm animate-pop">✓ 啱！打咗怪獸！</p>}
        {flash === 'wrong' && <p className="text-rose-400 font-bold mt-1 text-sm animate-pop">✗ 錯！受到傷害！</p>}
      </div>

      {hint && (
        <div className="bg-indigo-900/40 border border-indigo-500/30 rounded-lg px-3 py-2 text-sm text-indigo-200">
          💡 {hint}
        </div>
      )}

      <div className="flex gap-2">
        <input
          ref={inputRef}
          type="number"
          value={input}
          onChange={e => setInput(e.target.value.replace(/[^0-9]/g, '').slice(0, 5))}
          onKeyDown={handleKey}
          placeholder="輸入答案"
          className="flex-1 bg-slate-800 border border-slate-600 rounded-xl px-4 py-3 text-xl font-bold text-white text-center focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <button
          onClick={handleSubmit}
          className="bg-indigo-600 hover:bg-indigo-500 active:scale-95 text-white font-bold px-5 rounded-xl transition-all"
        >
          攻擊！
        </button>
      </div>

      <div className="grid grid-cols-3 gap-2">
        {numpadKeys.map(k => (
          <button
            key={k}
            onClick={() => handlePad(k)}
            className={`py-3 rounded-xl font-bold text-lg transition-all active:scale-95 ${
              k === '✓'
                ? 'bg-indigo-600 hover:bg-indigo-500 text-white'
                : k === '⌫'
                ? 'bg-slate-700 hover:bg-slate-600 text-slate-200'
                : 'bg-slate-700 hover:bg-slate-600 text-white'
            }`}
          >
            {k}
          </button>
        ))}
      </div>
    </div>
  );
};
