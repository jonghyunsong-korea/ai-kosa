import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  PuzzleLevel, 
  CellState, 
  GameStats, 
  Orientation, 
  WordInfo 
} from './types';
import { PUZZLES } from './data/puzzles';
import { generateProceduralLevel } from './utils/generator';

// Import components
import Sidebar from './components/Sidebar';
import CrosswordGrid from './components/CrosswordGrid';
import CluesPanel from './components/CluesPanel';
import LetterKeypad from './components/LetterKeypad';

// Import design icons
import { 
  Sparkles, 
  Clock, 
  Trophy, 
  Compass, 
  ArrowRight, 
  RotateCcw, 
  Grid, 
  CheckCircle, 
  Undo,
  BookOpen,
  Info,
  HelpCircle,
  Lightbulb,
  CheckCircle2,
  Lock,
  Flame,
  Volume2
} from 'lucide-react';

const LOCAL_STORAGE_KEY = 'word_puzzle_grid_stats_v1';

const defaultStats: GameStats = {
  solvedCount: 0,
  hintsUsed: 0,
  totalTimeSec: 0,
  levelStatuses: {
    'level-1': 'unlocked',
    'level-2': 'unlocked',
    'level-3': 'unlocked',
    'level-4': 'unlocked',
    'level-5': 'unlocked',
  }
};

export default function App() {
  // Level & Grid States
  const [currentLevelId, setCurrentLevelId] = useState<string>('level-1');
  const [level, setLevel] = useState<PuzzleLevel>(PUZZLES[0]);
  const [gridCells, setGridCells] = useState<CellState[][]>([]);
  
  // Interaction/Focus States
  const [selectedCell, setSelectedCell] = useState<{ row: number; col: number } | null>(null);
  const [activeOrientation, setActiveOrientation] = useState<Orientation>('horizontal');
  const [showErrors, setShowErrors] = useState<boolean>(true); // Enabled by default to guide Korean vocabulary
  
  // Game Play Metadata & Stats
  const [stats, setStats] = useState<GameStats>(defaultStats);
  const [timerSecs, setTimerSecs] = useState<number>(0);
  const [isTimerActive, setIsTimerActive] = useState<boolean>(true);
  const [isLevelComplete, setIsLevelComplete] = useState<boolean>(false);
  const [infiniteCounter, setInfiniteCounter] = useState<number>(1);

  // Load persistent stats
  useEffect(() => {
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        setStats(parsed);
      }
    } catch (e) {
      console.error('Failed to load local storage statistics', e);
    }
  }, []);

  // Save Stats Helper
  const saveStats = (newStats: GameStats) => {
    setStats(newStats);
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(newStats));
    } catch (e) {
      console.warn('Failed to save state to localStorage', e);
    }
  };

  // Reset all stats completely
  const handleResetAllStatistics = () => {
    if (window.confirm('지금까지의 모든 해결 퍼즐 개수와 기록을 초기화하시겠습니까?')) {
      const reset: GameStats = {
        ...defaultStats,
        levelStatuses: PUZZLES.reduce((acc, p, idx) => {
          acc[p.id] = idx === 0 ? 'unlocked' : 'unlocked'; // Keep active elements playable
          return acc;
        }, {} as Record<string, 'locked' | 'unlocked' | 'solved'>)
      };
      saveStats(reset);
      setIsLevelComplete(false);
      loadPuzzle(PUZZLES[0]);
    }
  };

  // Timer Tick EFFECT
  useEffect(() => {
    let interval: any = null;
    if (isTimerActive && !isLevelComplete) {
      interval = setInterval(() => {
        setTimerSecs(t => t + 1);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isTimerActive, isLevelComplete]);

  // Load Level into operational grids
  const loadPuzzle = (pLevel: PuzzleLevel) => {
    setLevel(pLevel);
    setCurrentLevelId(pLevel.id);
    setSelectedCell(null);
    setTimerSecs(0);
    setIsTimerActive(true);
    setIsLevelComplete(false);

    const size = pLevel.size;
    const blockedSet = new Set(pLevel.grid.blockedCells.map(([r, c]) => `${r},${c}`));
    const fixedMap = new Map(pLevel.grid.fixedCells.map(f => [`${f.row},${f.col}`, f.letter]));

    // 1. Create base cells
    const tempCells: CellState[][] = Array(size).fill(null).map((_, r) =>
      Array(size).fill(null).map((_, c) => {
        const isBlocked = blockedSet.has(`${r},${c}`);
        const fixedLetter = fixedMap.get(`${r},${c}`);
        return {
          row: r,
          col: c,
          targetLetter: '', // Will be assigned from associated word definitions below
          currentLetter: fixedLetter || '',
          isBlocked,
          isFixed: !!fixedLetter,
          wordIds: {}
        };
      })
    );

    // 2. Map words into cell structures and compute spelling targets
    pLevel.words.forEach((w) => {
      for (let idx = 0; idx < w.length; idx++) {
        const r = w.orientation === 'horizontal' ? w.row : w.row + idx;
        const c = w.orientation === 'horizontal' ? w.col + idx : w.col;
        const cell = tempCells[r]?.[c];
        if (cell) {
          cell.targetLetter = w.word[idx];
          if (w.orientation === 'horizontal') {
            cell.wordIds.horizontal = w.id;
          } else {
            cell.wordIds.vertical = w.id;
          }
        }
      }
    });

    // 3. Apply cell starting numbers (traditional crossword numbering)
    // Scan cells horizontally rows, then cols
    let indexStarter = 1;
    const startSet = new Set<string>();
    pLevel.words.forEach((w) => {
      startSet.add(`${w.row},${w.col}`);
    });

    for (let r = 0; r < size; r++) {
      for (let c = 0; c < size; c++) {
        const cell = tempCells[r][c];
        if (!cell.isBlocked && startSet.has(`${r},${c}`)) {
          cell.cellNumber = indexStarter++;
        }
      }
    }

    setGridCells(tempCells);

    // Auto focus first active non-fixed/fixed cell in the list
    const firstWord = pLevel.words[0];
    if (firstWord) {
      setSelectedCell({ row: firstWord.row, col: firstWord.col });
      setActiveOrientation(firstWord.orientation);
    }
  };

  // Run on startup
  useEffect(() => {
    loadPuzzle(PUZZLES[0]);
  }, []);

  // Handle cell selection
  const handleCellClick = (row: number, col: number) => {
    const cell = gridCells[row]?.[col];
    if (!cell || cell.isBlocked) return;

    if (selectedCell?.row === row && selectedCell?.col === col) {
      // Toggle orientation if clicking same cell
      const nextOrientation = activeOrientation === 'horizontal' ? 'vertical' : 'horizontal';
      // Verify cell has a word assigned in that direction before switching
      if (nextOrientation === 'horizontal' && cell.wordIds.horizontal) {
        setActiveOrientation('horizontal');
      } else if (nextOrientation === 'vertical' && cell.wordIds.vertical) {
        setActiveOrientation('vertical');
      } else {
        // Fallback switches anyway or stays
        setActiveOrientation(nextOrientation);
      }
    } else {
      setSelectedCell({ row, col });
      // Suggest orientation based on available word connections
      if (cell.wordIds.horizontal && !cell.wordIds.vertical) {
        setActiveOrientation('horizontal');
      } else if (cell.wordIds.vertical && !cell.wordIds.horizontal) {
        setActiveOrientation('vertical');
      }
    }
  };

  // Word selection from Clue click
  const handleWordClick = (word: WordInfo) => {
    setSelectedCell({ row: word.row, col: word.col });
    setActiveOrientation(word.orientation);

    // Scroll table elements or focus visually
    const card = document.getElementById(`cell-${word.row}-${word.col}`);
    if (card) {
      card.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  };

  // Write letter to grid cell
  const handleInputChange = (row: number, col: number, char: string) => {
    const nextCells = [...gridCells.map(rowGroup => [...rowGroup])];
    const cell = nextCells[row]?.[col];
    if (!cell || cell.isBlocked || cell.isFixed) return;

    cell.currentLetter = char.trim().slice(-1); // Only store last single character

    setGridCells(nextCells);
    checkCompletionState(nextCells);
  };

  // Keypad taps
  const handleLetterTap = (letter: string) => {
    if (!selectedCell) return;
    const { row, col } = selectedCell;
    const cell = gridCells[row]?.[col];
    if (!cell || cell.isBlocked || cell.isFixed) return;

    handleInputChange(row, col, letter);

    // Auto advance focus to next empty cell in identical word block
    advanceCursor(row, col, 1);
  };

  // Backspace / Clear
  const handleBackspaceTap = () => {
    if (!selectedCell) return;
    const { row, col } = selectedCell;
    handleInputChange(row, col, '');
    advanceCursor(row, col, -1);
  };

  const handleClearCellTap = () => {
    if (!selectedCell) return;
    handleInputChange(selectedCell.row, selectedCell.col, '');
  };

  const advanceCursor = (currentRow: number, currentCol: number, delta: 1 | -1) => {
    if (activeOrientation === 'horizontal') {
      let nextCol = currentCol + delta;
      while (nextCol >= 0 && nextCol < level.size && gridCells[currentRow][nextCol].isBlocked) {
        nextCol += delta;
      }
      if (nextCol >= 0 && nextCol < level.size) {
        setSelectedCell({ row: currentRow, col: nextCol });
      }
    } else {
      let nextRow = currentRow + delta;
      while (nextRow >= 0 && nextRow < level.size && gridCells[nextRow][currentCol].isBlocked) {
        nextRow += delta;
      }
      if (nextRow >= 0 && nextRow < level.size) {
        setSelectedCell({ row: nextRow, col: currentCol });
      }
    }
  };

  // Reveal a single focused cell as a micro-hint
  const handleAutoHintTap = () => {
    if (!selectedCell) return alert("힌트를 사용할 칸을 빈 격자에서 먼저 선택해주세요!");
    const { row, col } = selectedCell;
    const cell = gridCells[row]?.[col];
    if (!cell || cell.isBlocked || cell.isFixed) return;

    if (cell.currentLetter === cell.targetLetter) {
      return alert("선택한 칸은 이미 올바른 글자가 적혀있습니다!");
    }

    const nextCells = [...gridCells.map(rowGroup => [...rowGroup])];
    nextCells[row][col].currentLetter = cell.targetLetter;
    
    // Auto flag as fixed to highlight selection
    nextCells[row][col].isFixed = true; 

    setGridCells(nextCells);
    
    // Save hint stats
    saveStats({
      ...stats,
      hintsUsed: stats.hintsUsed + 1
    });

    checkCompletionState(nextCells);
  };

  // Reveal a full word (spent hint point)
  const handleRevealWord = (word: WordInfo) => {
    const nextCells = [...gridCells.map(rowGroup => [...rowGroup])];
    let cellsUpdated = 0;

    for (let idx = 0; idx < word.length; idx++) {
      const r = word.orientation === 'horizontal' ? word.row : word.row + idx;
      const c = word.orientation === 'horizontal' ? word.col + idx : word.col;
      const cell = nextCells[r]?.[c];
      if (cell && !cell.isBlocked && cell.currentLetter !== cell.targetLetter) {
        cell.currentLetter = cell.targetLetter;
        cell.isFixed = true; // highlight as revealed static
        cellsUpdated++;
      }
    }

    if (cellsUpdated > 0) {
      setGridCells(nextCells);
      saveStats({
        ...stats,
        hintsUsed: stats.hintsUsed + (cellsUpdated)
      });
      checkCompletionState(nextCells);
    }
  };

  // Check if grid letters match spelling exactly
  const checkCompletionState = (testCells: CellState[][]) => {
    for (let r = 0; r < level.size; r++) {
      for (let c = 0; c < level.size; c++) {
        const cell = testCells[r]?.[c];
        if (cell && !cell.isBlocked) {
          if (!cell.currentLetter || cell.currentLetter !== cell.targetLetter) {
            return; // Not complete yet
          }
        }
      }
    }

    // Success! Completed perfectly
    setIsLevelComplete(true);
    setIsTimerActive(false);

    // Save success metrics
    const updatedStatuses = { ...stats.levelStatuses };
    updatedStatuses[level.id] = 'solved';
    
    // Unlock next handcrafted level
    const currentIdx = PUZZLES.findIndex(p => p.id === level.id);
    if (currentIdx !== -1 && currentIdx + 1 < PUZZLES.length) {
      const nextLevel = PUZZLES[currentIdx + 1];
      if (updatedStatuses[nextLevel.id] !== 'solved') {
        updatedStatuses[nextLevel.id] = 'unlocked';
      }
    }

    // Accumulate total metrics
    saveStats({
      ...stats,
      solvedCount: stats.solvedCount + 1,
      totalTimeSec: stats.totalTimeSec + timerSecs,
      levelStatuses: updatedStatuses
    });
  };

  // Load level by choosing from sidebar list
  const handleSelectLevel = (levelId: string) => {
    const target = PUZZLES.find(p => p.id === levelId);
    if (target) {
      loadPuzzle(target);
    }
  };

  // Procedural infinite generation challenge
  const handleGenerateInfinite = (size: number) => {
    const nextCounter = infiniteCounter + 1;
    setInfiniteCounter(nextCounter);
    const generated = generateProceduralLevel(`infinite-${nextCounter}`, size);
    loadPuzzle(generated);
  };

  // Gather correct characters on board to feeds candidate pool list
  const collectTargetLetters = useMemo(() => {
    const collection: string[] = [];
    gridCells.forEach(row => {
      row.forEach(cell => {
        if (!cell.isBlocked && cell.targetLetter) {
          collection.push(cell.targetLetter);
        }
      });
    });
    return collection;
  }, [gridCells]);

  // Current statistics average helper
  const computeLevelPercentage = () => {
    let nonBlockedCount = 0;
    let filledCorrectCount = 0;
    gridCells.forEach(row => {
      row.forEach(cell => {
        if (!cell.isBlocked) {
          nonBlockedCount++;
          if (cell.currentLetter === cell.targetLetter) {
            filledCorrectCount++;
          }
        }
      });
    });
    return nonBlockedCount > 0 ? Math.round((filledCorrectCount / nonBlockedCount) * 100) : 0;
  };

  return (
    <div className="min-h-screen bg-slate-950 font-sans flex flex-col lg:flex-row relative">
      {/* Sidebar navigation */}
      <Sidebar
        currentLevelId={currentLevelId}
        onSelectLevel={handleSelectLevel}
        onGenerateInfinite={handleGenerateInfinite}
        stats={stats}
        onResetStats={handleResetAllStatistics}
      />

      {/* Main Board Area */}
      <main className="flex-1 flex flex-col justify-between overflow-y-auto max-h-screen p-4 sm:p-6 lg:p-8 gap-6 relative">
        
        {/* Floating confetti-backdrop star animation */}
        <AnimatePresence>
          {isLevelComplete && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-950/95 z-40 flex items-center justify-center p-4 backdrop-blur-md"
            >
              <motion.div 
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                className="max-w-md w-full bg-slate-900 border border-violet-500 rounded-3xl p-8 text-center shadow-2xl relative overflow-hidden flex flex-col gap-6"
              >
                {/* Glowing border effects */}
                <div className="absolute inset-0 bg-gradient-to-br from-violet-600/10 to-emerald-500/10 pointer-events-none" />

                <div className="mx-auto bg-gradient-to-br from-violet-500 to-indigo-500 p-4 rounded-2xl shadow-lg ring-4 ring-violet-500/30">
                  <Trophy className="w-10 h-10 text-yellow-300 animate-bounce" />
                </div>

                <div className="space-y-2">
                  <h2 className="text-2xl font-bold font-display text-slate-100 tracking-tight">
                    퍼즐 완료!축하합니다 🎉
                  </h2>
                  <p className="text-sm text-slate-400">
                    모든 가로세로 한국어 명사 퍼즐을 오류 없이 완벽하게 해결했습니다.
                  </p>
                </div>

                {/* Match stats logs */}
                <div className="grid grid-cols-2 gap-3 bg-slate-950/80 p-4 rounded-2xl border border-slate-800">
                  <div className="text-center p-2">
                    <span className="text-[10px] text-slate-500 block uppercase font-mono">해결 속도</span>
                    <span className="font-mono text-lg font-bold text-slate-200">
                      {Math.floor(timerSecs / 60)}분 {timerSecs % 60}초
                    </span>
                  </div>
                  <div className="text-center p-2">
                    <span className="text-[10px] text-slate-500 block uppercase font-mono">퍼즐 명칭</span>
                    <span className="font-sans text-xs font-semibold text-violet-300 truncate block mt-0.5">
                      {level.name.split(':')[1]?.trim() || level.name}
                    </span>
                  </div>
                </div>

                {/* Options panel */}
                <div className="flex flex-col gap-2">
                  {PUZZLES.findIndex(p => p.id === level.id) !== -1 && PUZZLES.findIndex(p => p.id === level.id) + 1 < PUZZLES.length ? (
                    <button
                      id="btn-modal-next"
                      onClick={() => {
                        const idx = PUZZLES.findIndex(p => p.id === level.id);
                        loadPuzzle(PUZZLES[idx + 1]);
                      }}
                      className="w-full py-3.5 bg-gradient-to-r from-violet-600 to-indigo-600 text-white rounded-xl font-bold hover:shadow-lg hover:shadow-violet-600/30 hover:scale-[1.01] transition duration-200 shadow flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <span>다음 단계 도전하기</span>
                      <ArrowRight className="w-5 h-5" />
                    </button>
                  ) : (
                    <button
                      id="btn-modal-inf"
                      onClick={() => handleGenerateInfinite(5)}
                      className="w-full py-3.5 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl font-bold hover:shadow-lg hover:shadow-emerald-600/30 hover:scale-[1.01] transition duration-200 shadow flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <Sparkles className="w-5 h-5 text-yellow-300" />
                      <span>무한 랜덤 모드 플레이</span>
                    </button>
                  )}

                  <button
                    id="btn-modal-retry"
                    onClick={() => loadPuzzle(level)}
                    className="w-full py-3 bg-slate-800 hover:bg-slate-750 text-slate-300 rounded-xl font-semibold border border-slate-700 transition cursor-pointer"
                  >
                    현재 단계 다시하기
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Master Header with interactive options */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/40 p-4 rounded-2xl border border-slate-850">
          <div>
            <div className="flex items-center gap-2.5">
              <span className="text-xs font-bold uppercase tracking-widest text-violet-400 font-mono bg-violet-950/80 px-2 py-0.5 rounded border border-violet-800/30">
                ACTIVE PUZZLE
              </span>
              <h2 className="text-xl font-bold font-display text-slate-100 tracking-tight">
                {level.name}
              </h2>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              칸을 채우면 우측 열쇠의 빈칸 문장들이 회색이나 중간선으로 완성 체크되어 나갑니다.
            </p>
          </div>

          {/* Time logs & helpers block */}
          <div className="flex items-center gap-4">
            {/* Real-time precision percentage bar */}
            <div className="flex flex-col min-w-[100px] text-right">
              <div className="flex justify-between items-center text-[10px] text-slate-500 mb-1">
                <span>정답 일치율</span>
                <span className="font-mono text-slate-300 font-bold">{computeLevelPercentage()}%</span>
              </div>
              <div className="w-24 h-1 bg-slate-800 rounded-full overflow-hidden self-end">
                <style>{`.pct-fill { width: ${computeLevelPercentage()}% }`}</style>
                <div 
                  className="h-full bg-emerald-500 transition-all duration-300 pct-fill"
                />
              </div>
            </div>

            {/* Timer card block */}
            <div className="bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 flex items-center gap-2.5 font-mono">
              <Clock className="w-4 h-4 text-violet-400 animate-pulse" />
              <div className="text-right">
                <span className="text-[9px] text-slate-500 block leading-none">TIME</span>
                <span className="text-base font-bold text-slate-200 leading-tight">
                  {Math.floor(timerSecs / 60).toString().padStart(2, '0')}:
                  {(timerSecs % 60).toString().padStart(2, '0')}
                </span>
              </div>
            </div>

            {/* Reset puzzle level layout */}
            <button
              id="btn-reset-current"
              onClick={() => {
                if (window.confirm("현재 작성한 모든 빈칸 문자를 제거하고 처음부터 다시 도전하겠습니까?")) {
                  loadPuzzle(level);
                }
              }}
              className="p-2.5 bg-slate-950 hover:bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 rounded-xl transition cursor-pointer hover:shadow"
              title="현재 퍼즐 초기화"
            >
              <RotateCcw className="w-4.5 h-4.5" />
            </button>
          </div>
        </header>

        {/* Central interactive body: Grid left, Clues right */}
        <div className="flex flex-col xl:flex-row gap-6 items-start">
          <div className="w-full xl:w-auto xl:flex-1 flex flex-col gap-6">
            
            {/* Grid system component */}
            <CrosswordGrid
              size={level.size}
              gridCells={gridCells}
              onCellClick={handleCellClick}
              selectedCell={selectedCell}
              activeOrientation={activeOrientation}
              showErrors={showErrors}
              onInputChange={handleInputChange}
            />

            {/* Candidate Keypad list board */}
            <LetterKeypad
              size={level.size}
              correctGridLetters={collectTargetLetters}
              onLetterTap={handleLetterTap}
              onBackspaceTap={handleBackspaceTap}
              onClearTap={handleClearCellTap}
              onAutoHintTap={handleAutoHintTap}
            />
          </div>

          {/* Definition Clues right column inside workspace */}
          <div className="w-full xl:w-[480px]">
            <CluesPanel
              words={level.words}
              selectedCell={selectedCell}
              activeOrientation={activeOrientation}
              gridCells={gridCells}
              onWordClick={handleWordClick}
              onRevealWord={handleRevealWord}
            />
          </div>
        </div>

        {/* Humble visual footer note */}
        <footer className="text-center text-[11px] text-slate-500 pt-4 border-t border-slate-900/60 font-mono">
          © KOREAN 낱말 맞추기 그리드 게임 SYSTEM — DESIGN FOR WORKSPACE
        </footer>
      </main>
    </div>
  );
}
