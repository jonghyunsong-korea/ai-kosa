import React, { useMemo } from 'react';
import { motion } from 'motion/react';
import { HelpCircle, Trash2, Delete, Sparkles, Key } from 'lucide-react';

interface LetterKeypadProps {
  size: number;
  // All correct letters on the board
  correctGridLetters: string[];
  onLetterTap: (letter: string) => void;
  onBackspaceTap: () => void;
  onClearTap: () => void;
  onAutoHintTap: () => void;
}

export default function LetterKeypad({
  size,
  correctGridLetters,
  onLetterTap,
  onBackspaceTap,
  onClearTap,
  onAutoHintTap
}: LetterKeypadProps) {
  // Compute distinct letters in correct crossword board and mix in some Korean distractors
  const letterPool = useMemo(() => {
    const distinctCorrect = Array.from(new Set(correctGridLetters.filter((l) => l && l.trim() !== '')));
    
    // Some common distractor letters in Korean nouns
    const commonDistractors = ['수', '대', '인', '지', '천', '과', '공', '원', '국', '한', '산', '우', '하', '구', '교', '실', '방'];
    const filteredDistractors = commonDistractors.filter(d => !distinctCorrect.includes(d));
    
    // Add up to 5 distractors depending on level size
    const distractorCount = size <= 4 ? 4 : size === 5 ? 6 : 8;
    const chosenDistractors = filteredDistractors
      .sort(() => Math.random() - 0.5)
      .slice(0, distractorCount);
      
    // Combine and shuffle
    return [...distinctCorrect, ...chosenDistractors].sort(() => Math.random() - 0.5);
  }, [correctGridLetters, size]);

  return (
    <div id="letter-keypad" className="bg-slate-950 border border-slate-900 rounded-2xl p-5 shadow-inner relative overflow-hidden">
      {/* Decorative side badge */}
      <div className="flex items-center justify-between border-b border-slate-900 pb-3 mb-4">
        <div className="flex items-center gap-1.5">
          <Key className="w-4 h-4 text-violet-400" />
          <h4 className="text-xs font-bold font-display uppercase tracking-wider text-slate-400">
            글자 입력기
          </h4>
        </div>
        <p className="text-[10px] text-slate-505 font-mono text-slate-500">
          SUDOKU-STYLE LETTER CANDIDATES
        </p>
      </div>

      {/* Grid of characters */}
      <div className="grid grid-cols-6 sm:grid-cols-8 gap-2 mb-4">
        {letterPool.map((letter, idx) => (
          <motion.button
            key={`pool-key-${idx}`}
            id={`pool-key-${idx}`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onLetterTap(letter)}
            className="h-11 sm:h-12 bg-slate-900 border border-slate-800 text-slate-100 hover:border-violet-500 hover:text-violet-200 hover:bg-violet-955 rounded-xl font-display font-medium text-base shadow transition cursor-pointer select-none flex items-center justify-center group"
          >
            {letter}
          </motion.button>
        ))}
      </div>

      {/* Actions row: Backspace, Clear, Auto Hint */}
      <div className="grid grid-cols-3 gap-3">
        <button
          id="btn-keypad-clear"
          onClick={onClearTap}
          className="py-3 px-4 bg-slate-900 hover:bg-red-950/20 text-red-400 border border-slate-800 hover:border-red-500/30 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 shadow transition cursor-pointer"
        >
          <Trash2 className="w-4 h-4" />
          <span>지우기</span>
        </button>

        <button
          id="btn-keypad-backspace"
          onClick={onBackspaceTap}
          className="py-3 px-4 bg-slate-900 hover:bg-slate-850 border border-slate-800 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 shadow transition cursor-pointer text-slate-300"
        >
          <Delete className="w-4 h-4 text-violet-400" />
          <span>지우기/백스페이스</span>
        </button>

        <button
          id="btn-keypad-hint"
          onClick={onAutoHintTap}
          className="py-3 px-4 bg-gradient-to-r from-violet-600/20 to-indigo-600/30 text-violet-200 border border-violet-500/40 hover:border-violet-400 rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow transition hover:from-violet-600/30 glow-btn cursor-pointer"
        >
          <Sparkles className="w-4 h-4 text-yellow-400 shrink-0" />
          <span>단일 칸 힌트</span>
        </button>
      </div>
    </div>
  );
}
