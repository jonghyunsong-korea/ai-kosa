import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CellState, Orientation } from '../types';
import { Lock, Eye, AlertCircle, ArrowRight, Check } from 'lucide-react';

interface CrosswordGridProps {
  size: number;
  gridCells: CellState[][];
  onCellClick: (row: number, col: number) => void;
  selectedCell: { row: number; col: number } | null;
  activeOrientation: Orientation;
  // Visual configuration toggles
  showErrors: boolean;
  onInputChange: (row: number, col: number, char: string) => void;
}

export default function CrosswordGrid({
  size,
  gridCells,
  onCellClick,
  selectedCell,
  activeOrientation,
  showErrors,
  onInputChange
}: CrosswordGridProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  // Keyboard navigation directly inside the grid
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!selectedCell) return;
      const { row, col } = selectedCell;
      const cell = gridCells[row]?.[col];
      if (!cell || cell.isBlocked) return;

      const key = e.key;

      // Arrow keys navigation
      if (key === 'ArrowUp') {
        e.preventDefault();
        // Look up for closest white cell
        let currRow = row - 1;
        while (currRow >= 0 && gridCells[currRow][col].isBlocked) {
          currRow--;
        }
        if (currRow >= 0) onCellClick(currRow, col);
      } else if (key === 'ArrowDown') {
        e.preventDefault();
        let currRow = row + 1;
        while (currRow < size && gridCells[currRow][col].isBlocked) {
          currRow++;
        }
        if (currRow < size) onCellClick(currRow, col);
      } else if (key === 'ArrowLeft') {
        e.preventDefault();
        let currCol = col - 1;
        while (currCol >= 0 && gridCells[row][currCol].isBlocked) {
          currCol--;
        }
        if (currCol >= 0) onCellClick(row, currCol);
      } else if (key === 'ArrowRight') {
        e.preventDefault();
        let currCol = col + 1;
        while (currCol < size && gridCells[row][currCol].isBlocked) {
          currCol++;
        }
        if (currCol < size) onCellClick(row, currCol);
      } else if (key === 'Backspace') {
        e.preventDefault();
        // Clear current first
        onInputChange(row, col, '');
        // Move backward in active direction
        moveCursor(row, col, -1);
      } else if (key === 'Delete' || key === ' ' || key === 'Spacebar') {
        e.preventDefault();
        onInputChange(row, col, '');
      } else if (key.length === 1 && /^[a-zA-Zㄱ-ㅎㅏ-ㅣ가-힣0-9]$/.test(key)) {
        // Direct single character input
        e.preventDefault();
        if (!cell.isFixed) {
          onInputChange(row, col, key);
        }
        // Move forward in active direction
        moveCursor(row, col, 1);
      }
    };

    const moveCursor = (currentRow: number, currentCol: number, delta: 1 | -1) => {
      if (activeOrientation === 'horizontal') {
        let nextCol = currentCol + delta;
        // Jump over black blocks
        while (nextCol >= 0 && nextCol < size && gridCells[currentRow][nextCol].isBlocked) {
          nextCol += delta;
        }
        if (nextCol >= 0 && nextCol < size) {
          onCellClick(currentRow, nextCol);
        }
      } else {
        let nextRow = currentRow + delta;
        while (nextRow >= 0 && nextRow < size && gridCells[nextRow][currentCol].isBlocked) {
          nextRow += delta;
        }
        if (nextRow >= 0 && nextRow < size) {
          onCellClick(nextRow, currentCol);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedCell, activeOrientation, gridCells, size, onCellClick, onInputChange]);

  // Check if a cell is part of the currently active word
  const isCellInActiveWord = (cell: CellState) => {
    if (!selectedCell) return false;
    const sCell = gridCells[selectedCell.row]?.[selectedCell.col];
    if (!sCell) return false;

    const activeWordId = activeOrientation === 'horizontal' 
      ? sCell.wordIds.horizontal 
      : sCell.wordIds.vertical;

    if (!activeWordId) return false;

    const targetWordId = activeOrientation === 'horizontal'
      ? cell.wordIds.horizontal
      : cell.wordIds.vertical;

    return activeWordId === targetWordId;
  };

  // Check if cell is in active row/col cross-hairs
  const isCellInCrosshairs = (r: number, c: number) => {
    if (!selectedCell) return false;
    return r === selectedCell.row || c === selectedCell.col;
  };

  return (
    <div 
      ref={containerRef}
      id="crossword-grid-container" 
      className="flex justify-center items-center p-4 bg-slate-950 rounded-2xl border border-slate-800/80 shadow-emerald-500/5 select-none relative overflow-hidden"
    >
      {/* Decorative starry layout backdrop */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,#1e1b4b,transparent_60%)] opacity-20 pointer-events-none" />

      <div 
        className="grid gap-1.5 w-full max-w-[420px] aspect-square"
        style={{
          gridTemplateColumns: `repeat(${size}, minmax(0, 1fr))`,
          gridTemplateRows: `repeat(${size}, minmax(0, 1fr))`
        }}
      >
        {gridCells.map((rowCells, rIdx) =>
          rowCells.map((cell, cIdx) => {
            const isSelected = selectedCell?.row === rIdx && selectedCell?.col === cIdx;
            const inWord = isCellInActiveWord(cell);
            const inCross = isCellInCrosshairs(rIdx, cIdx);
            const isCorrect = cell.currentLetter && cell.currentLetter === cell.targetLetter;
            const hasError = showErrors && cell.currentLetter && cell.currentLetter !== cell.targetLetter;

            // Blocked cells are solid black blocks
            if (cell.isBlocked) {
              return (
                <div
                  key={`cell-${rIdx}-${cIdx}`}
                  id={`block-cell-${rIdx}-${cIdx}`}
                  className="bg-slate-900 border border-slate-950 rounded-lg shadow-inner relative"
                >
                  {/* Subtle technical lines inside blocks */}
                  <div className="absolute inset-2 border border-slate-950/40 rounded opacity-20" />
                </div>
              );
            }

            return (
              <motion.button
                key={`cell-${rIdx}-${cIdx}`}
                id={`cell-${rIdx}-${cIdx}`}
                whileTap={{ scale: 0.96 }}
                onClick={() => onCellClick(rIdx, cIdx)}
                className={`relative flex items-center justify-center rounded-xl border font-semibold select-none focus:outline-none transition-all duration-150 group cursor-pointer ${
                  isSelected
                    ? 'bg-gradient-to-br from-violet-600/90 to-indigo-700/90 text-white border-violet-400 ring-2 ring-violet-400/50 scale-100 z-10 shadow-lg shadow-violet-600/20'
                    : inWord
                    ? 'bg-violet-950/60 border-violet-600/60 text-slate-100 shadow-sm'
                    : inCross
                    ? 'bg-slate-900/80 border-slate-800 text-slate-200'
                    : 'bg-slate-950 border-slate-800 text-slate-300 hover:bg-slate-900 hover:border-slate-700'
                }`}
              >
                {/* Cell Number on top left */}
                {cell.cellNumber && (
                  <span className={`absolute top-1 left-1.5 font-mono font-bold text-[9px] ${
                    isSelected ? 'text-violet-200/90' : 'text-slate-500 group-hover:text-violet-400/80 transition'
                  }`}>
                    {cell.cellNumber}
                  </span>
                )}

                {/* Content character */}
                <div className="pt-2 text-lg sm:text-xl font-display font-semibold select-none">
                  {cell.currentLetter}
                </div>

                {/* Overrides & Little Indicator icons */}
                {cell.isFixed && (
                  <div className="absolute bottom-1 right-1 text-[8px]">
                    <Lock className={`w-2.5 h-2.5 ${isSelected ? 'text-violet-200/80' : 'text-slate-600'}`} />
                  </div>
                )}

                {/* Correct/Incorrect alert circles */}
                {hasError && !isSelected && (
                  <motion.div 
                    initial={{ scale: 0 }} 
                    animate={{ scale: 1 }} 
                    className="absolute -top-1 -right-1 bg-red-500 text-white p-0.5 rounded-full shadow border border-slate-950"
                  >
                    <AlertCircle className="w-2.5 h-2.5" />
                  </motion.div>
                )}

                {/* Small indicator when Auto-check is on and correctly solved */}
                {showErrors && isCorrect && !cell.isFixed && !isSelected && (
                  <motion.div 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -bottom-0.5 -right-0.5 bg-emerald-500 text-white p-0.5 rounded-full shadow border border-slate-950"
                  >
                    <Check className="w-2 h-2" />
                  </motion.div>
                )}
              </motion.button>
            );
          })
        )}
      </div>
    </div>
  );
}
