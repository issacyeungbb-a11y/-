import React, { useState, useEffect } from 'react';
import { AppMode, Problem, Student } from './types';
import { getEncouragement } from './services/geminiService';
import { VisualGrid } from './components/VisualGrid';
import { NumberPad } from './components/NumberPad';
import { MultiplicationTable } from './components/MultiplicationTable';
import { VerticalDrill } from './components/VerticalDrill';

// --- Student Data Definition ---
const STUDENTS: Student[] = [
  { id: 1, classInfo: "P4-4", name: "朱琸永", group: 2 },
  { id: 2, classInfo: "P4-16", name: "黃駿逸", group: 2 },
  { id: 3, classInfo: "P5-3", name: "馮晞晴", group: 3 },
  { id: 4, classInfo: "P5-5", name: "羅允琳", group: 3 },
  { id: 5, classInfo: "P5-12", name: "江俊宏", group: 2 },
  { id: 6, classInfo: "P5-15", name: "伍尚恒", group: 2 },
  { id: 7, classInfo: "P5-16", name: "曾仲軒", group: 2 },
  { id: 8, classInfo: "P6A-7", name: "陳祉佑", group: 1 },
  { id: 9, classInfo: "P6A-8", name: "張敬恒", group: 2 },
  { id: 10, classInfo: "P6A-11", name: "林千承", group: 1 },
  { id: 11, classInfo: "P6A-15", name: "尤尚政", group: 1 },
  { id: 12, classInfo: "P6B-7", name: "周嘉浠", group: 1 },
  { id: 13, classInfo: "P6B-9", name: "李梓綱", group: 2 },
  { id: 14, classInfo: "P6B-10", name: "岑錠南", group: 1 },
  { id: 15, classInfo: "P6B-11", name: "邵熙朗", group: 2 },
  { id: 16, classInfo: "P6B-13", name: "曾梓軒", group: 2 },
  { id: 17, classInfo: "P6B-14", name: "黃苡澧", group: 2 },
  { id: 18, classInfo: "P6B-15", name: "鄭景元", group: 2 },
];

const App: React.FC = () => {
  // Start at LOGIN mode
  const [mode, setMode] = useState<AppMode>(AppMode.LOGIN);
  
  // Current Student
  const [currentUser, setCurrentUser] = useState<Student | null>(null);

  // --- Game State & Progression ---
  const [targetNumber, setTargetNumber] = useState<number>(1); 
  const [currentStep, setCurrentStep] = useState<number>(1); 
  const [problem, setProblem] = useState<Problem>({ factorA: 1, factorB: 1, answer: 1 });
  
  // Badges to track completion of each module
  const [earnedBadges, setEarnedBadges] = useState<Set<string>>(new Set());
  const [completedDrills, setCompletedDrills] = useState<number[]>([]); // For L1 internal progress

  // --- Vertical Mode Specific State ---
  const [verticalDifficulty, setVerticalDifficulty] = useState<'NO_CARRY' | 'CARRY'>('NO_CARRY');
  const [verticalInputs, setVerticalInputs] = useState<string[]>(['', '', '', '']);
  const [userCarries, setUserCarries] = useState<{ tens: string, hundreds: string }>({ tens: '', hundreds: '' });
  const [verticalStep, setVerticalStep] = useState<'UNITS' | 'CARRY_TENS' | 'TENS' | 'CARRY_HUNDREDS' | 'HUNDREDS' | 'THOUSANDS' | 'DONE'>('UNITS');
  
  // Quest Progress State
  const [questProgress, setQuestProgress] = useState<number>(0);
  const QUEST_TARGET = 10; // Target for L3 and L4

  // Input State
  const [userInput, setUserInput] = useState<string>('');
  const [message, setMessage] = useState<string>('');
  const [isWrong, setIsWrong] = useState(false);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);

  // Grid Challenge State
  const [gridAnswers, setGridAnswers] = useState<Record<string, number>>({});
  
  // AI & Help
  const [aiExplanation, setAiExplanation] = useState<string>('');
  
  // Sound Function
  const playSound = (type: 'correct' | 'wrong' | 'complete' | 'victory') => {
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    
    const now = ctx.currentTime;
    
    if (type === 'correct') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(500, now);
      osc.frequency.exponentialRampToValueAtTime(1000, now + 0.1);
      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
      osc.start();
      osc.stop(now + 0.3);
    } else if (type === 'complete') {
      // Level Complete Fanfare
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(300, now);
      osc.frequency.linearRampToValueAtTime(600, now + 0.2);
      osc.frequency.linearRampToValueAtTime(400, now + 0.4);
      osc.frequency.linearRampToValueAtTime(800, now + 0.6);
      gain.gain.setValueAtTime(0.2, now);
      gain.gain.linearRampToValueAtTime(0, now + 1.0);
      osc.start();
      osc.stop(now + 1.0);
    } else if (type === 'victory') {
      // Grand Prize Sound
      osc.type = 'sine';
      osc.frequency.setValueAtTime(400, now);
      osc.frequency.linearRampToValueAtTime(600, now + 0.2);
      osc.frequency.linearRampToValueAtTime(800, now + 0.4);
      osc.frequency.linearRampToValueAtTime(1200, now + 1.5);
      gain.gain.setValueAtTime(0.3, now);
      gain.gain.linearRampToValueAtTime(0, now + 2.0);
      osc.start();
      osc.stop(now + 2.0);
    } else {
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(200, now);
      osc.frequency.linearRampToValueAtTime(100, now + 0.2);
      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
      osc.start();
      osc.stop(now + 0.3);
    }
  };

  // Badge Logic
  const awardBadge = (badgeId: string) => {
      if (!earnedBadges.has(badgeId)) {
          const newBadges = new Set(earnedBadges);
          newBadges.add(badgeId);
          setEarnedBadges(newBadges);
          playSound('complete');
      }
  };

  useEffect(() => {
    // Check L1 completion
    if (completedDrills.length === 9 && !earnedBadges.has('L1')) {
        awardBadge('L1');
    }
  }, [completedDrills, earnedBadges]);

  const handleLogin = (student: Student) => {
    setCurrentUser(student);
    setMode(AppMode.MENU);
    // Reset progress when switching users potentially
    setEarnedBadges(new Set());
    setCompletedDrills([]);
    setStreak(0);
    setScore(0);
    setQuestProgress(0);
  };

  // --- Logic Controllers ---

  const startDrillSelection = () => {
    setMode(AppMode.DRILL_SELECT);
    setMessage('');
  };

  const startVerticalSelection = () => {
    setMode(AppMode.VERTICAL_SELECT);
    setMessage('選擇建造任務');
  };

  const startVerticalGameRound = (diff: 'NO_CARRY' | 'CARRY') => {
      setVerticalDifficulty(diff);
      setQuestProgress(0); // Reset progress
      nextVerticalProblem(diff, 0);
  }

  const nextVerticalProblem = (diff: 'NO_CARRY' | 'CARRY', currentProgress: number) => {
    // Check if Quest Completed
    if (currentProgress >= QUEST_TARGET) {
        if (diff === 'NO_CARRY') awardBadge('L3_EASY');
        else awardBadge('L3_HARD');
        
        setMessage('任務完成！火箭組裝成功！🚀');
        setTimeout(() => setMode(AppMode.VERTICAL_SELECT), 2500);
        return;
    }

    let a, b;
    let attempts = 0;
    while(true) {
        attempts++;
        a = Math.floor(Math.random() * 89) + 11; // 11 to 99
        b = Math.floor(Math.random() * 8) + 2;   // 2 to 9
        
        const unitsA = a % 10;
        const tensA = Math.floor(a / 10);
        
        const isUnitsProductCarry = (unitsA * b) >= 10;
        const isTensProductCarry = (tensA * b) >= 10; 
        
        if (diff === 'NO_CARRY') {
            if (!isUnitsProductCarry && !isTensProductCarry) break;
        } else {
            if (isUnitsProductCarry) break;
        }
        
        if (attempts > 200) {
             if (diff === 'NO_CARRY') { a = 12; b = 3; }
             else { a = 15; b = 4; }
             break;
        }
    }

    const ans = a * b;
    setProblem({ factorA: a, factorB: b, answer: ans });
    
    setVerticalInputs(['', '', '', '']); 
    setUserCarries({ tens: '', hundreds: '' });
    setVerticalStep('UNITS');
    
    setMode(AppMode.VERTICAL_PLAY);
    setMessage(`任務進度：${currentProgress + 1} / ${QUEST_TARGET}`);
    setIsWrong(false);
  };

  const startVertical3D = () => {
    setQuestProgress(0); // Reset progress
    nextVertical3DProblem(0);
  };

  const nextVertical3DProblem = (currentProgress: number) => {
    if (currentProgress >= QUEST_TARGET) {
        awardBadge('L4');
        setMessage('穿越蟲洞成功！任務完成！🌌');
        setTimeout(() => setMode(AppMode.MENU), 2500);
        return;
    }

    const a = Math.floor(Math.random() * 899) + 101; // 101 to 999
    const b = Math.floor(Math.random() * 8) + 2;     // 2 to 9
    
    const ans = a * b;
    setProblem({ factorA: a, factorB: b, answer: ans });
    
    setVerticalInputs(['', '', '', '']); 
    setUserCarries({ tens: '', hundreds: '' });
    setVerticalStep('UNITS');

    setMode(AppMode.VERTICAL_3D_PLAY);
    setMessage(`任務進度：${currentProgress + 1} / ${QUEST_TARGET}`);
    setIsWrong(false);
  }

  const startSequentialDrill = (num: number) => {
    if (num > 1 && !completedDrills.includes(num - 1)) return;
    setTargetNumber(num);
    setCurrentStep(1);
    setProblem({ factorA: num, factorB: 1, answer: num * 1 });
    setUserInput('');
    setIsWrong(false);
    setMessage(`準備好！開始 ${num} 的特訓！`);
    setAiExplanation('');
    setScore(0);
    setStreak(0);
    setMode(AppMode.DRILL_PLAY);
  };

  const startGridChallenge = () => {
    setMode(AppMode.GRID_CHALLENGE);
    setGridAnswers({});
    setTargetNumber(1);
    setCurrentStep(1);
    setProblem({ factorA: 1, factorB: 1, answer: 1 });
    setUserInput('');
    setStreak(0); // Reset streak for Quest L2
    setMessage('在地圖上連續答對 5 題獲得徽章！');
  };

  const nextSequenceStep = () => {
    if (currentStep >= 9) {
      playSound('complete');
      if (!completedDrills.includes(targetNumber)) {
        setCompletedDrills(prev => [...prev, targetNumber]);
      }
      if (targetNumber === 9) {
          setMessage('太強了！所有乘數表特訓完成！🏆');
      } else {
          setMessage(`${targetNumber} 的特訓完成！下一關已解鎖！🔓`);
      }
      getEncouragement(9).then(msg => setAiExplanation(msg));
      setTimeout(() => setMode(AppMode.DRILL_SELECT), 3500);
    } else {
      const next = currentStep + 1;
      setCurrentStep(next);
      setProblem({ factorA: targetNumber, factorB: next, answer: targetNumber * next });
      setUserInput('');
      setIsWrong(false);
      setMessage('下一題！');
    }
  };

  const handleGridCellClick = (r: number, c: number) => {
    setTargetNumber(r);
    setCurrentStep(c);
    setProblem({ factorA: r, factorB: c, answer: r * c });
    setUserInput('');
    setIsWrong(false);
    setMessage(`${r} × ${c} = ?`);
  };

  // --- Input Handling ---

  const handleWrong = () => {
    playSound('wrong');
    setIsWrong(true);
    setTimeout(() => setIsWrong(false), 500);
  };

  const completeVerticalProblem = () => {
    setStreak(streak + 1);
    setScore(score + 20);
    const newProgress = questProgress + 1;
    setQuestProgress(newProgress);

    setMessage(`好耶！完成第 ${newProgress} 題！`);
    const is3D = mode === AppMode.VERTICAL_3D_PLAY;
    
    setTimeout(() => {
        if (is3D) nextVertical3DProblem(newProgress);
        else nextVerticalProblem(verticalDifficulty, newProgress);
    }, 1200);
  };

  const handleInput = (num: number) => {
    if (isWrong) return;

    // === Vertical Mode Logic (Both 2D and 3D) ===
    if (mode === AppMode.VERTICAL_PLAY || mode === AppMode.VERTICAL_3D_PLAY) {
        const unitsA = problem.factorA % 10;
        const tensA = Math.floor((problem.factorA % 100) / 10);
        const hundredsA = Math.floor(problem.factorA / 100);
        const b = problem.factorB;
        
        const is3D = mode === AppMode.VERTICAL_3D_PLAY;

        // --- Step 1: Units ---
        if (verticalStep === 'UNITS') {
            const unitsProduct = unitsA * b;
            const correctUnit = unitsProduct % 10;
            const carry = Math.floor(unitsProduct / 10);

            if (num === correctUnit) {
                playSound('correct');
                const newInputs = [...verticalInputs];
                newInputs[3] = num.toString(); 
                setVerticalInputs(newInputs);
                
                if (carry > 0) {
                    setVerticalStep('CARRY_TENS');
                    setMessage('有進位！');
                } else {
                    setVerticalStep('TENS');
                    setMessage('下一步：十位');
                }
            } else {
                handleWrong();
            }
        }
        // --- Step 2: Carry to Tens ---
        else if (verticalStep === 'CARRY_TENS') {
            const unitsProduct = unitsA * b;
            const correctCarry = Math.floor(unitsProduct / 10);
            
            if (num === correctCarry) {
                 playSound('correct');
                 setUserCarries(prev => ({...prev, tens: num.toString()}));
                 setVerticalStep('TENS');
                 setMessage('好！計埋個十位！');
            } else {
                handleWrong();
            }
        }
        // --- Step 3: Tens ---
        else if (verticalStep === 'TENS') {
            const carryVal = userCarries.tens ? parseInt(userCarries.tens) : 0;
            const tensTotal = (tensA * b) + carryVal;
            const correctTensDigit = tensTotal % 10;
            const carryToHundreds = Math.floor(tensTotal / 10);

            if (num === correctTensDigit) {
                playSound('correct');
                const newInputs = [...verticalInputs];
                newInputs[2] = num.toString(); 
                setVerticalInputs(newInputs);

                if (is3D) {
                    if (carryToHundreds > 0) {
                        setVerticalStep('CARRY_HUNDREDS');
                         setMessage('有進位！');
                    } else {
                        setVerticalStep('HUNDREDS');
                         setMessage('下一步：百位');
                    }
                } else {
                    // For 2D, we are finishing up.
                    if (carryToHundreds > 0) {
                         setVerticalStep('HUNDREDS'); 
                    } else {
                         completeVerticalProblem();
                    }
                }
            } else {
                handleWrong();
            }
        }
        // --- Step 4: Carry to Hundreds (3D Only) ---
        else if (verticalStep === 'CARRY_HUNDREDS') {
            const carryVal = userCarries.tens ? parseInt(userCarries.tens) : 0;
            const tensTotal = (tensA * b) + carryVal;
            const correctCarry = Math.floor(tensTotal / 10);

            if (num === correctCarry) {
                playSound('correct');
                setUserCarries(prev => ({...prev, hundreds: num.toString()}));
                setVerticalStep('HUNDREDS');
                setMessage('好！計埋個百位！');
            } else {
                handleWrong();
            }
        }
        // --- Step 5: Hundreds ---
        else if (verticalStep === 'HUNDREDS') {
             if (is3D) {
                 const carryVal = userCarries.hundreds ? parseInt(userCarries.hundreds) : 0;
                 const hundredsTotal = (hundredsA * b) + carryVal;
                 const correctHundredsDigit = hundredsTotal % 10;
                 const thousandsDigit = Math.floor(hundredsTotal / 10);
                 
                 if (num === correctHundredsDigit) {
                     playSound('correct');
                     const newInputs = [...verticalInputs];
                     newInputs[1] = num.toString(); 
                     setVerticalInputs(newInputs);
                     
                     if (thousandsDigit > 0) {
                         setVerticalStep('THOUSANDS');
                     } else {
                         completeVerticalProblem();
                     }
                 } else {
                     handleWrong();
                 }
             } else {
                 // 2D Mode filling
                 const carryVal = userCarries.tens ? parseInt(userCarries.tens) : 0;
                 const tensTotal = (tensA * b) + carryVal;
                 const correctHundreds = Math.floor(tensTotal / 10);
                 
                 if (num === correctHundreds) {
                     playSound('correct');
                     const newInputs = [...verticalInputs];
                     newInputs[1] = num.toString();
                     setVerticalInputs(newInputs);
                     completeVerticalProblem();
                 } else {
                     handleWrong();
                 }
             }
        }
        // --- Step 6: Thousands (3D Only) ---
        else if (verticalStep === 'THOUSANDS') {
             const carryVal = userCarries.hundreds ? parseInt(userCarries.hundreds) : 0;
             const hundredsTotal = (hundredsA * b) + carryVal;
             const correctThousands = Math.floor(hundredsTotal / 10);

             if (num === correctThousands) {
                 playSound('correct');
                 const newInputs = [...verticalInputs];
                 newInputs[0] = num.toString();
                 setVerticalInputs(newInputs);
                 completeVerticalProblem();
             } else {
                 handleWrong();
             }
        }

        return;
    }

    // === Standard Mode Logic ===
    if (userInput.length >= 3) return;

    const newInput = userInput + num.toString();
    const strAnswer = problem.answer.toString();
    
    setUserInput(newInput);

    if (parseInt(newInput) === problem.answer) {
      playSound('correct');
      const newStreak = streak + 1;
      setScore(score + 10);
      setStreak(newStreak);

      if (mode === AppMode.GRID_CHALLENGE) {
        setGridAnswers(prev => ({
          ...prev,
          [`${problem.factorA}-${problem.factorB}`]: problem.answer
        }));
        setUserInput('');
        
        let questMessage = '';

        // Quest Logic for L2
        if (newStreak >= 5 && !earnedBadges.has('L2')) {
            awardBadge('L2');
            questMessage = '地圖任務完成！獲得徽章！✨';
        } else {
            questMessage = `正確！連勝 ${newStreak}`;
        }
        setMessage(questMessage);

        // Auto-advance Logic
        const nextC = problem.factorB + 1;
        let nextR = problem.factorA;
        let targetC = nextC;
        
        if (targetC > 9) {
            targetC = 1;
            nextR = nextR + 1;
        }

        if (nextR <= 9) {
            // Updated to 150ms for faster auto-jump
            setTimeout(() => {
                setTargetNumber(nextR);
                setCurrentStep(targetC);
                setProblem({ factorA: nextR, factorB: targetC, answer: nextR * targetC });
                if (!questMessage.includes('徽章')) setMessage(`${nextR} × ${targetC} = ?`);
            }, 150);
        } else {
            setMessage('恭喜！完成所有題目！');
        }

      } else if (mode === AppMode.DRILL_PLAY) {
        setMessage('正確！👏');
        setTimeout(nextSequenceStep, 500); 
      }
      return;
    }

    if (strAnswer.startsWith(newInput)) {
      return;
    }

    handleWrong();
    setStreak(0); // Reset streak on wrong
    setTimeout(() => {
        setIsWrong(false);
        setUserInput('');
    }, 500);
  };

  const handleDelete = () => {
    if (!isWrong) {
        if (mode === AppMode.VERTICAL_PLAY || mode === AppMode.VERTICAL_3D_PLAY) {
            // No delete needed
        } else {
            setUserInput(prev => prev.slice(0, -1));
        }
    }
  };

  const getVerticalHint = () => {
    if (mode !== AppMode.VERTICAL_PLAY && mode !== AppMode.VERTICAL_3D_PLAY) return '';
    
    const unitsA = problem.factorA % 10;
    const tensA = Math.floor((problem.factorA % 100) / 10);
    const hundredsA = Math.floor(problem.factorA / 100);
    const b = problem.factorB;
    const carryTens = userCarries.tens ? parseInt(userCarries.tens) : 0;
    const carryHundreds = userCarries.hundreds ? parseInt(userCarries.hundreds) : 0;

    if (verticalStep === 'UNITS') {
      return `${unitsA} × ${b}`;
    }
    if (verticalStep === 'CARRY_TENS') {
      return `進位`;
    }
    if (verticalStep === 'TENS') {
      return `(${tensA} × ${b}) + ${carryTens}`;
    }
    if (verticalStep === 'CARRY_HUNDREDS') {
      return `進位`;
    }
    if (verticalStep === 'HUNDREDS') {
      return `(${hundredsA} × ${b}) + ${carryHundreds}`;
    }
    if (verticalStep === 'THOUSANDS') {
      return `千位`;
    }
    return '';
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white p-4 font-sans select-none flex flex-col items-center">
      
      {/* HEADER BAR - Show in all modes except LOGIN */}
      {mode !== AppMode.LOGIN && (
        <div className="w-full max-w-4xl flex justify-between items-center mb-6 bg-slate-800/50 p-2 rounded-full border border-slate-700">
           <div className="flex items-center gap-2">
             <div className="w-10 h-10 rounded-full bg-indigo-500 flex items-center justify-center font-bold text-lg">
               {currentUser?.name[0]}
             </div>
             <div className="flex flex-col">
               <span className="text-sm font-bold text-indigo-300">{currentUser?.name}</span>
               <span className="text-xs text-slate-400">{currentUser?.classInfo}</span>
             </div>
           </div>
           
           <div className="flex gap-4 pr-4">
              {mode !== AppMode.MENU && (
                  <button onClick={() => setMode(AppMode.MENU)} className="text-xs bg-slate-700 px-3 py-1 rounded-full hover:bg-slate-600">
                    回到主選單
                  </button>
              )}
           </div>
        </div>
      )}

      {/* LOGIN MODE */}
      {mode === AppMode.LOGIN && (
        <div className="flex flex-col items-center animate-fade-in w-full max-w-2xl">
           <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-indigo-500 mb-8 mt-10">
             星際乘數探險隊
           </h1>
           <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 w-full">
             {STUDENTS.map(s => (
               <button
                 key={s.id}
                 onClick={() => handleLogin(s)}
                 className="bg-slate-800 hover:bg-indigo-900 border border-slate-700 hover:border-indigo-500 p-4 rounded-xl transition-all flex flex-col items-center gap-2 group"
               >
                 <div className="w-12 h-12 rounded-full bg-slate-700 group-hover:bg-indigo-600 flex items-center justify-center text-xl font-bold transition-colors">
                   {s.name[0]}
                 </div>
                 <span className="font-bold text-slate-200">{s.name}</span>
                 <span className="text-xs text-slate-500 bg-slate-900 px-2 py-0.5 rounded">{s.classInfo}</span>
               </button>
             ))}
           </div>
        </div>
      )}

      {/* MENU MODE */}
      {mode === AppMode.MENU && (
        <div className="flex flex-col items-center gap-6 w-full max-w-md animate-fade-in">
           <h2 className="text-2xl font-bold text-indigo-300 mb-4">選擇任務</h2>
           
           <button 
             onClick={startDrillSelection}
             className="w-full bg-gradient-to-r from-blue-600 to-blue-500 p-6 rounded-2xl shadow-lg hover:scale-105 transition-transform flex items-center gap-4 relative overflow-hidden"
           >
             <div className="text-4xl">📚</div>
             <div className="text-left z-10">
               <div className="font-black text-xl">Level 1: 基礎特訓 (1-9)</div>
               <div className="text-sm text-blue-200">順序練習，打好基礎</div>
             </div>
             {earnedBadges.has('L1') && <div className="absolute right-4 top-1/2 -translate-y-1/2 text-4xl opacity-50">🏆</div>}
           </button>

           <button 
             onClick={startGridChallenge}
             className="w-full bg-gradient-to-r from-purple-600 to-purple-500 p-6 rounded-2xl shadow-lg hover:scale-105 transition-transform flex items-center gap-4 relative overflow-hidden"
           >
             <div className="text-4xl">🗺️</div>
             <div className="text-left z-10">
               <div className="font-black text-xl">Level 2: 星際地圖挑戰</div>
               <div className="text-sm text-purple-200">填滿乘數表，解鎖徽章</div>
             </div>
             {earnedBadges.has('L2') && <div className="absolute right-4 top-1/2 -translate-y-1/2 text-4xl opacity-50">✨</div>}
           </button>

           <button 
             onClick={startVerticalSelection}
             className="w-full bg-gradient-to-r from-orange-600 to-orange-500 p-6 rounded-2xl shadow-lg hover:scale-105 transition-transform flex items-center gap-4 relative overflow-hidden"
           >
             <div className="text-4xl">🚀</div>
             <div className="text-left z-10">
               <div className="font-black text-xl">Level 3: 火箭建造工程</div>
               <div className="text-sm text-orange-200">直式乘法 (2位數 x 1位數)</div>
             </div>
             {(earnedBadges.has('L3_EASY') && earnedBadges.has('L3_HARD')) && <div className="absolute right-4 top-1/2 -translate-y-1/2 text-4xl opacity-50">🚀</div>}
           </button>

           <button 
             onClick={startVertical3D}
             className="w-full bg-gradient-to-r from-pink-600 to-pink-500 p-6 rounded-2xl shadow-lg hover:scale-105 transition-transform flex items-center gap-4 relative overflow-hidden"
           >
             <div className="text-4xl">🌌</div>
             <div className="text-left z-10">
               <div className="font-black text-xl">Level 4: 穿越蟲洞</div>
               <div className="text-sm text-pink-200">進階直式 (3位數 x 1位數)</div>
             </div>
             {earnedBadges.has('L4') && <div className="absolute right-4 top-1/2 -translate-y-1/2 text-4xl opacity-50">🌌</div>}
           </button>
        </div>
      )}

      {/* DRILL SELECT */}
      {mode === AppMode.DRILL_SELECT && (
        <div className="w-full max-w-md animate-fade-in text-center">
          <h2 className="text-xl text-slate-300 mb-6">Level 1: 選擇要練習的數字</h2>
          <div className="grid grid-cols-3 gap-4">
             {[1,2,3,4,5,6,7,8,9].map(n => {
               const locked = n > 1 && !completedDrills.includes(n-1);
               const done = completedDrills.includes(n);
               return (
                 <button
                   key={n}
                   onClick={() => startSequentialDrill(n)}
                   disabled={locked}
                   className={`
                     aspect-square rounded-2xl text-3xl font-black shadow-lg transition-all relative
                     ${locked ? 'bg-slate-800 text-slate-600 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-500 text-white hover:scale-105 active:scale-95'}
                     ${done ? 'ring-4 ring-green-500' : ''}
                   `}
                 >
                   {n}
                   {locked && <span className="absolute inset-0 flex items-center justify-center text-4xl opacity-50">🔒</span>}
                   {done && <span className="absolute bottom-2 right-2 text-sm">✅</span>}
                 </button>
               )
             })}
          </div>
        </div>
      )}

      {/* DRILL PLAY (SEQUENTIAL) */}
      {mode === AppMode.DRILL_PLAY && (
          <div className="flex flex-col items-center w-full max-w-md animate-fade-in px-4">
             <button onClick={() => setMode(AppMode.DRILL_SELECT)} className="self-start text-sm text-slate-400 mb-4">
              ← 返回
             </button>
             
             <div className="flex flex-col items-center mb-6">
                <span className="text-xl text-yellow-400 font-bold mb-2">Level 1: 特訓中 ({targetNumber})</span>
                <div className="text-6xl font-bold text-white tracking-widest text-shadow-glow">
                  {problem.factorA} × {problem.factorB} = ?
                </div>
                <div className="mt-4 scale-90 origin-top">
                    <VisualGrid a={problem.factorA} b={problem.factorB} />
                </div>
             </div>

             <div className="w-full text-center h-8 mb-2 text-yellow-300 font-bold text-lg animate-pulse">
               {message}
             </div>

             <div className="w-full flex justify-center mb-4">
                <div className="text-4xl font-mono bg-slate-800 px-8 py-4 rounded-xl border-2 border-slate-600 min-w-[150px] text-center tracking-widest">
                  {userInput || "?"}
                </div>
             </div>
             
             <NumberPad onInput={handleInput} onDelete={handleDelete} />
             
             {aiExplanation && (
               <div className="mt-4 bg-indigo-900/50 p-4 rounded-lg text-sm text-indigo-200 border border-indigo-700/50">
                 🤖 小老師: {aiExplanation}
               </div>
             )}
          </div>
      )}

      {/* GRID CHALLENGE */}
      {mode === AppMode.GRID_CHALLENGE && (
        <div className="flex flex-col items-center w-full max-w-2xl animate-fade-in">
           <div className="flex justify-between w-full mb-2 px-4">
             <div className="text-yellow-400 font-bold">Level 2 | 連勝: {streak}</div>
             <div className="text-slate-400 text-sm">目標: 填滿地圖</div>
           </div>
           
           <MultiplicationTable 
             answers={gridAnswers} 
             activeCell={{r: targetNumber, c: currentStep}} 
             onCellClick={handleGridCellClick}
             currentInput={userInput}
           />

           <div className="w-full text-center h-8 mt-2 text-yellow-300 font-bold text-lg">
              {message}
           </div>

           <NumberPad onInput={handleInput} onDelete={handleDelete} />
        </div>
      )}

      {/* VERTICAL SELECT */}
      {mode === AppMode.VERTICAL_SELECT && (
         <div className="flex flex-col gap-6 w-full max-w-sm animate-fade-in">
             <h2 className="text-2xl text-center font-bold mb-4">Level 3: 選擇難度</h2>
             <button onClick={() => startVerticalGameRound('NO_CARRY')} className="bg-green-600 p-6 rounded-xl shadow-lg hover:bg-green-500 transition-all text-left group">
                <div className="text-xl font-bold">初級工程師</div>
                <div className="text-green-200 text-sm">無進位 (e.g. 23 x 3)</div>
                {earnedBadges.has('L3_EASY') && <span className="float-right text-2xl">🏆</span>}
             </button>
             <button onClick={() => startVerticalGameRound('CARRY')} className="bg-red-600 p-6 rounded-xl shadow-lg hover:bg-red-500 transition-all text-left group">
                <div className="text-xl font-bold">高級工程師</div>
                <div className="text-red-200 text-sm">有進位 (e.g. 45 x 3)</div>
                {earnedBadges.has('L3_HARD') && <span className="float-right text-2xl">🏆</span>}
             </button>
         </div>
      )}

      {/* VERTICAL PLAY (2D & 3D) */}
      {(mode === AppMode.VERTICAL_PLAY || mode === AppMode.VERTICAL_3D_PLAY) && (
        <div className="flex flex-col items-center w-full max-w-lg animate-fade-in">
           <div className="w-full flex justify-between px-4 mb-2">
              <div className="bg-slate-800 px-3 py-1 rounded-full text-sm font-bold text-pink-300">
                 {mode === AppMode.VERTICAL_3D_PLAY ? 'Lv 4' : 'Lv 3'} | 分數: {score}
              </div>
              <div className="bg-slate-800 px-3 py-1 rounded-full text-sm text-yellow-400">
                 {message}
              </div>
           </div>

           <VerticalDrill 
             a={problem.factorA} 
             b={problem.factorB} 
             userInputs={verticalInputs} 
             userCarries={userCarries} 
             activeField={verticalStep}
             hintText={getVerticalHint()}
           />
           
           <NumberPad onInput={handleInput} onDelete={handleDelete} />
        </div>
      )}

    </div>
  );
};

export default App;