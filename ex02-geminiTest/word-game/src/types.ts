export type Orientation = 'horizontal' | 'vertical';

export interface WordInfo {
  id: string; // e.g., 'H1', 'V2'
  word: string; // The target word, e.g., '나무'
  clue: string; // Definition, e.g., '가지와 잎이 우거진 키 큰 식물'
  orientation: Orientation;
  row: number; // Start row index (0-based)
  col: number; // Start col index (0-based)
  length: number;
}

export interface CellState {
  row: number;
  col: number;
  targetLetter: string; // The correct letter
  currentLetter: string; // What the user has typed/entered
  isBlocked: boolean; // True if it's a black/blocked cell in the crossword
  isFixed: boolean; // True if the letter is pre-filled as a starting hint
  wordIds: {
    horizontal?: string;
    vertical?: string;
  };
  cellNumber?: number; // The crossword cell number displayed in the top-left (e.g., 1, 2, 3...)
}

export interface PuzzleLevel {
  id: string;
  name: string;
  size: number; // e.g., 5 for 5x5, 6 for 6x6, etc.
  words: WordInfo[];
  grid: {
    blockedCells: [number, number][]; // Coordinates of black cells
    fixedCells: { row: number; col: number; letter: string }[]; // Coordinates of pre-filled help letters
  };
}

export interface GameStats {
  solvedCount: number;
  hintsUsed: number;
  totalTimeSec: number;
  levelStatuses: Record<string, 'locked' | 'unlocked' | 'solved'>;
}
