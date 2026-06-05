import React from 'react';
import { WordInfo, CellState, Orientation } from '../types';
import { HelpCircle, Check, MapPin, Eye, ArrowDownRight, Grid } from 'lucide-react';

interface CluesPanelProps {
  words: WordInfo[];
  selectedCell: { row: number; col: number } | null;
  activeOrientation: Orientation;
  gridCells: CellState[][];
  onWordClick: (word: WordInfo) => void;
  onRevealWord: (word: WordInfo) => void;
}

export default function CluesPanel({
  words,
  selectedCell,
  activeOrientation,
  gridCells,
  onWordClick,
  onRevealWord
}: CluesPanelProps) {
  // Determine currently focused word based on selected cell and orientation
  const getSelectedWordId = () => {
    if (!selectedCell) return null;
    const cell = gridCells[selectedCell.row]?.[selectedCell.col];
    if (!cell) return null;
    return activeOrientation === 'horizontal' ? cell.wordIds.horizontal : cell.wordIds.vertical;
  };

  const selectedWordId = getSelectedWordId();

  // Helper: check if a word is fully completed in current typing grid (ignore correctness first, or check strictly)
  const isWordFinished = (word: WordInfo) => {
    for (let i = 0; i < word.length; i++) {
      const r = word.orientation === 'horizontal' ? word.row : word.row + i;
      const c = word.orientation === 'horizontal' ? word.col + i : word.col;
      const cell = gridCells[r]?.[c];
      if (!cell || !cell.currentLetter) return false;
    }
    return true;
  };

  // Helper: check if word is fully correct
  const isWordCorrect = (word: WordInfo) => {
    for (let i = 0; i < word.length; i++) {
      const r = word.orientation === 'horizontal' ? word.row : word.row + i;
      const c = word.orientation === 'horizontal' ? word.col + i : word.col;
      const cell = gridCells[r]?.[c];
      if (!cell || cell.currentLetter !== cell.targetLetter) return false;
    }
    return true;
  };

  const acrossWords = words.filter((w) => w.orientation === 'horizontal');
  const downWords = words.filter((w) => w.orientation === 'vertical');

  const renderClueSection = (sectionTitle: string, list: WordInfo[], orientation: Orientation) => {
    return (
      <div className="flex-1 min-w-[260px] flex flex-col gap-3">
        <div className="flex items-center justify-between border-b border-slate-800 pb-2">
          <div className="flex items-center gap-2">
            <span className={`w-2.5 h-2.5 rounded-full ${orientation === 'horizontal' ? 'bg-violet-500' : 'bg-indigo-500'}`} />
            <h3 className="font-display font-semibold text-sm tracking-wide text-slate-350">
              {sectionTitle} <span className="text-xs font-mono font-normal text-slate-500">({list.length})</span>
            </h3>
          </div>
          <span className="text-[10px] uppercase font-mono text-slate-500 bg-slate-900 px-1.5 py-0.5 rounded border border-slate-800">
            {orientation === 'horizontal' ? '가로' : '세로'}
          </span>
        </div>

        <div className="space-y-2 overflow-y-auto max-h-[360px] pr-1.5 scrollbar-thin">
          {list.map((word) => {
            const isFocused = word.id === selectedWordId;
            const completed = isWordFinished(word);
            const correct = isWordCorrect(word);

            return (
              <div
                key={word.id}
                id={`clue-card-${word.id}`}
                onClick={() => onWordClick(word)}
                className={`w-full p-3.5 rounded-xl border text-left transition-all duration-200 cursor-pointer flex flex-col justify-between gap-2.5 group relative hover:translate-y-[-1px] ${
                  isFocused
                    ? 'bg-slate-900 border-violet-500/80 shadow-md ring-1 ring-violet-500/30'
                    : completed
                    ? correct
                      ? 'bg-slate-900/40 border-emerald-950 text-slate-400 opacity-80'
                      : 'bg-slate-900/45 border-red-950 text-slate-350'
                    : 'bg-slate-950 border-slate-850 hover:bg-slate-900 hover:border-slate-800 text-slate-300'
                }`}
              >
                {/* Upper line metadata */}
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    {/* Index or Location visual marker */}
                    <div className={`text-[10px] font-mono font-bold w-5 h-5 rounded-md flex items-center justify-center border shrink-0 ${
                      isFocused 
                        ? 'bg-violet-600 border-violet-400 text-white' 
                        : completed && correct
                        ? 'bg-emerald-950 border-emerald-500/40 text-emerald-400'
                        : 'bg-slate-900 border-slate-800 text-slate-400'
                    }`}>
                      {word.id.split('-')[1] || word.id.slice(-2)}
                    </div>
                    
                    {/* Coords indicator */}
                    <span className="text-[10px] font-mono text-slate-500 group-hover:text-slate-400 transition flex items-center gap-0.5">
                      <MapPin className="w-2.5 h-2.5" />
                      {word.row + 1}, {word.col + 1}
                    </span>
                  </div>

                  {/* Solved Status tags */}
                  <div className="flex items-center gap-1.5">
                    {completed && correct && (
                      <span className="text-[9px] font-semibold text-emerald-400 bg-emerald-950/65 px-1.5 py-0.5 rounded-md border border-emerald-800/40 flex items-center gap-0.5">
                        <Check className="w-2.5 h-2.5" />
                        완료
                      </span>
                    )}

                    {completed && !correct && (
                      <span className="text-[9px] font-semibold text-indigo-400 bg-slate-900 px-1.5 py-0.5 rounded-md border border-slate-800 flex items-center gap-0.5 animate-pulse">
                        작성중
                      </span>
                    )}

                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-900 text-slate-500 font-semibold border border-slate-800/80">
                      {word.length}글자
                    </span>
                  </div>
                </div>

                {/* Definition Clue text */}
                <p className={`text-xs leading-relaxed font-sans ${
                  isFocused ? 'text-slate-100 font-medium' : 'text-slate-300'
                } ${completed && correct ? 'line-through text-slate-500 decoration-slate-600/40' : ''}`}>
                  {word.clue}
                </p>

                {/* Inline trigger actions */}
                <div className="flex items-center justify-between pt-1 mt-0.5 border-t border-slate-900/60 text-[10px]">
                  <span className="text-slate-505 font-mono text-slate-400 flex items-center gap-0.5">
                    <ArrowDownRight className="w-2.5 h-2.5 text-violet-400" />
                    단어 위치로 가기
                  </span>
                  
                  {/* Word Reveal Hint Action */}
                  <button
                    id={`btn-reveal-clue-${word.id}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      onRevealWord(word);
                    }}
                    disabled={completed && correct}
                    className={`font-semibold bg-slate-900 hover:bg-violet-900/20 text-violet-400 px-2 py-1 rounded border border-slate-800 cursor-pointer hover:border-violet-500/30 transition shadow-sm disabled:opacity-30 disabled:pointer-events-none flex items-center gap-1`}
                  >
                    <Eye className="w-3 h-3" />
                    단어 열기
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div 
      id="clues-panel-box" 
      className="p-5 bg-slate-950 border border-slate-850 rounded-2xl flex flex-col md:flex-row gap-6 shrink-0 relative overflow-hidden"
    >
      {/* Visual background lines */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,#312e81,transparent_55%)] opacity-10 pointer-events-none" />

      {renderClueSection('가로 열쇠 (Across)', acrossWords, 'horizontal')}
      {renderClueSection('세로 열쇠 (Down)', downWords, 'vertical')}
    </div>
  );
}
