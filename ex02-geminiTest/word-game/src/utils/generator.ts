import { PuzzleLevel, WordInfo } from '../types';
import { DICTIONARY } from '../data/puzzles';

/**
 * Procedurally generates a crossword-style puzzle level of specified size (typically 5x5 or 6x6)
 * from a dictionary of Korean nouns.
 */
export function generateProceduralLevel(levelId: string, size: number = 5): PuzzleLevel {
  // We'll run a simplified layout algorithm that selects a few intersecting words.
  // To protect performance, we will limit retries and fall back to a high-quality preset pattern if needed.
  let attempts = 0;
  
  while (attempts < 50) {
    attempts++;
    const wordsPlaced: WordInfo[] = [];
    const gridRepr: string[][] = Array(size).fill(null).map(() => Array(size).fill(''));

    // Step 1: Select a primary horizontal word to place in the middle row
    const middleRow = Math.floor(size / 2);
    const candidateWords = DICTIONARY.filter(
      (w) => w.word.length >= 3 && w.word.length <= size - 1
    );
    if (candidateWords.length === 0) break;
    const mainWordObj = candidateWords[Math.floor(Math.random() * candidateWords.length)];
    const mainWord = mainWordObj.word;
    
    // Choose start column to center it reasonably
    const startCol = Math.floor((size - mainWord.length) / 2);
    
    // Place on grid
    for (let i = 0; i < mainWord.length; i++) {
      gridRepr[middleRow][startCol + i] = mainWord[i];
    }
    
    wordsPlaced.push({
      id: `gen-H-${wordsPlaced.length}`,
      word: mainWord,
      clue: mainWordObj.clue,
      orientation: 'horizontal',
      row: middleRow,
      col: startCol,
      length: mainWord.length
    });

    // Step 2: Attempt to place 2 or 3 vertical intersecting words
    // For each letter in the main word, we can try to intersect
    let placedVertical = 0;
    const indices = Array.from({ length: mainWord.length }, (_, i) => i);
    // Shuffle indices to vary intersections
    indices.sort(() => Math.random() - 0.5);

    for (const letterIdx of indices) {
      if (placedVertical >= 2) break;
      const colOfIntersection = startCol + letterIdx;
      const intersectingLetter = mainWord[letterIdx];

      // Find dictionary words containing this letter that are of appropriate length
      const verticalCandidates = DICTIONARY.filter((w) => {
        if (w.word === mainWord) return false;
        // Should fit vertical height limitations
        if (w.word.length < 2 || w.word.length > size - 1) return false;
        // Contains our letter
        return w.word.includes(intersectingLetter);
      });

      if (verticalCandidates.length === 0) continue;
      
      // Shuffle vertical candidates
      verticalCandidates.sort(() => Math.random() - 0.5);
      
      let success = false;
      for (const vWordObj of verticalCandidates) {
        const vWord = vWordObj.word;
        // Find indices of intersection in the vertical word
        const vIntersectIdxs: number[] = [];
        for (let i = 0; i < vWord.length; i++) {
          if (vWord[i] === intersectingLetter) vIntersectIdxs.push(i);
        }
        
        vIntersectIdxs.sort(() => Math.random() - 0.5);
        for (const vIdx of vIntersectIdxs) {
          // Calculate starter row for this vertical word
          const startVRow = middleRow - vIdx;
          if (startVRow < 0 || startVRow + vWord.length > size) continue; // Out of bounds
          
          // Check for horizontal collisions with other cells
          let hasOverlapCollision = false;
          for (let i = 0; i < vWord.length; i++) {
            const currRow = startVRow + i;
            const existingLetter = gridRepr[currRow][colOfIntersection];
            
            // It can only overlap if it's the intersection letter, otherwise it must be empty
            if (currRow === middleRow) {
              if (existingLetter !== vWord[i]) {
                hasOverlapCollision = true;
                break;
              }
            } else {
              if (existingLetter !== '') {
                hasOverlapCollision = true;
                break;
              }
              // Ensure we don't block or stand adjacent to other non-empty cells horizontally
              // (except if it is a planned intersection)
              const touchLeft = colOfIntersection > 0 ? gridRepr[currRow][colOfIntersection - 1] : '';
              const touchRight = colOfIntersection < size - 1 ? gridRepr[currRow][colOfIntersection + 1] : '';
              if (touchLeft !== '' || touchRight !== '') {
                hasOverlapCollision = true;
                break;
              }
            }
          }
          
          if (!hasOverlapCollision) {
            // Place on grid representation
            for (let i = 0; i < vWord.length; i++) {
              gridRepr[startVRow + i][colOfIntersection] = vWord[i];
            }
            
            wordsPlaced.push({
              id: `gen-V-${wordsPlaced.length}`,
              word: vWord,
              clue: vWordObj.clue,
              orientation: 'vertical',
              row: startVRow,
              col: colOfIntersection,
              length: vWord.length
            });
            placedVertical++;
            success = true;
            break;
          }
        }
        if (success) break;
      }
    }

    // Step 3: Try to find a secondary horizontal word intersecting one of the vertical words
    const verticalWord = wordsPlaced.find(w => w.orientation === 'vertical');
    if (verticalWord && wordsPlaced.length < 4) {
      const vWord = verticalWord.word;
      const vCol = verticalWord.col;
      const vStartRow = verticalWord.row;
      
      // Look for intersections other than the middleRow
      const vWordIndices = Array.from({ length: vWord.length }, (_, i) => i)
        .filter(idx => vStartRow + idx !== middleRow);
      
      vWordIndices.sort(() => Math.random() - 0.5);
      
      let secHSuccess = false;
      for (const letterIdx of vWordIndices) {
        const rowOfIntersection = vStartRow + letterIdx;
        const intersectingLetter = vWord[letterIdx];
        
        // Find horizontal candidates
        const hCandidates = DICTIONARY.filter(w => {
          if (wordsPlaced.some(pw => pw.word === w.word)) return false;
          if (w.word.length < 2 || w.word.length > size - 1) return false;
          return w.word.includes(intersectingLetter);
        });
        
        hCandidates.sort(() => Math.random() - 0.5);
        
        for (const hWordObj of hCandidates) {
          const hWord = hWordObj.word;
          const hIntersects = [];
          for (let i = 0; i < hWord.length; i++) {
            if (hWord[i] === intersectingLetter) hIntersects.push(i);
          }
          
          hIntersects.sort(() => Math.random() - 0.5);
          for (const hIdx of hIntersects) {
            const startHCol = vCol - hIdx;
            if (startHCol < 0 || startHCol + hWord.length > size) continue;
            
            // Check collisions
            let hasOverlapCollision = false;
            for (let i = 0; i < hWord.length; i++) {
              const currCol = startHCol + i;
              const existingLetter = gridRepr[rowOfIntersection][currCol];
              
              if (currCol === vCol) {
                if (existingLetter !== hWord[i]) {
                  hasOverlapCollision = true;
                  break;
                }
              } else {
                if (existingLetter !== '') {
                  hasOverlapCollision = true;
                  break;
                }
                
                // Ensure no adjacent vertical touching except planned
                const touchUp = rowOfIntersection > 0 ? gridRepr[rowOfIntersection - 1][currCol] : '';
                const touchDown = rowOfIntersection < size - 1 ? gridRepr[rowOfIntersection + 1][currCol] : '';
                if (touchUp !== '' || touchDown !== '') {
                  hasOverlapCollision = true;
                  break;
                }
              }
            }
            
            if (!hasOverlapCollision) {
              // Place on grid
              for (let i = 0; i < hWord.length; i++) {
                gridRepr[rowOfIntersection][startHCol + i] = hWord[i];
              }
              
              wordsPlaced.push({
                id: `gen-H-${wordsPlaced.length}`,
                word: hWord,
                clue: hWordObj.clue,
                orientation: 'horizontal',
                row: rowOfIntersection,
                col: startHCol,
                length: hWord.length
              });
              secHSuccess = true;
              break;
            }
          }
          if (secHSuccess) break;
        }
        if (secHSuccess) break;
      }
    }

    // If we managed to place at least 3 words, we consider it a highly viable level!
    if (wordsPlaced.length >= 3) {
      // Build blocked cells from coordinates not covered by any placed word
      const blockedCells: [number, number][] = [];
      const wordCellSet = new Set<string>();
      
      for (const val of wordsPlaced) {
        for (let i = 0; i < val.length; i++) {
          const r = val.orientation === 'horizontal' ? val.row : val.row + i;
          const c = val.orientation === 'horizontal' ? val.col + i : val.col;
          wordCellSet.add(`${r},${c}`);
        }
      }
      
      for (let r = 0; r < size; r++) {
        for (let c = 0; c < size; c++) {
          if (!wordCellSet.has(`${r},${c}`)) {
            blockedCells.push([r, c]);
          }
        }
      }

      // Add 1 or 2 fixed/provided characters as starting hints
      const fixedCells: { row: number; col: number; letter: string }[] = [];
      const cellsArray = Array.from(wordCellSet).map(s => s.split(',').map(Number));
      cellsArray.sort(() => Math.random() - 0.5);
      
      // Limit pre-filled hints (e.g., 1 high value hint or none depending on difficulty)
      if (cellsArray.length > 0) {
        const [r, c] = cellsArray[0];
        fixedCells.push({ row: r, col: c, letter: gridRepr[r][c] });
      }

      return {
        id: levelId,
        name: `무한 도전: 새로운 조합 (${size}x${size})`,
        size,
        words: wordsPlaced,
        grid: {
          blockedCells,
          fixedCells
        }
      };
    }
  }

  // Fallback to random handcrafted level if generations fail
  const fallbackLevel = { ...DICTIONARY_FALLBACKS[Math.floor(Math.random() * DICTIONARY_FALLBACKS.length)] };
  fallbackLevel.id = levelId;
  fallbackLevel.name = `무한 도전: 행운 조합 (${fallbackLevel.size}x${fallbackLevel.size})`;
  return fallbackLevel;
}

// Solid template backups to guarantee puzzle is generated even if algorithms hit rare dead-ends
const DICTIONARY_FALLBACKS: PuzzleLevel[] = [
  {
    id: 'fallback-1',
    name: '무한 도전 (5x5)',
    size: 5,
    words: [
      {
        id: 'FB-H1',
        word: '사랑',
        clue: '소중히 보살피고 아끼는 따뜻한 마음이나 마음의 일렁임.',
        orientation: 'horizontal',
        row: 1,
        col: 1,
        length: 2
      },
      {
        id: 'FB-V1',
        word: '가족',
        clue: '피를 나누거나 인연으로 맺어진 보금자리 구성원.',
        orientation: 'vertical',
        row: 0,
        col: 1,
        length: 2
      },
      {
        id: 'FB-H2',
        word: '학교',
        clue: '선생님과 학생들이 교실에 모여 수업을 듣는 공적 공간.',
        orientation: 'horizontal',
        row: 3,
        col: 2,
        length: 2
      },
      {
        id: 'FB-V2',
        word: '교육',
        clue: '지식이나 인공적 기술 혹은 지혜를 가르치는 활동.',
        orientation: 'vertical',
        row: 2,
        col: 3,
        length: 2
      }
    ],
    grid: {
      blockedCells: [
        [0, 0], [0, 2], [0, 3], [0, 4],
        [1, 0], [1, 3], [1, 4],
        [2, 0], [2, 1], [2, 2], [2, 4],
        [3, 0], [3, 1], [3, 4],
        [4, 0], [4, 1], [4, 2], [4, 3], [4, 4]
      ],
      fixedCells: [
        { row: 1, col: 1, letter: '사' }
      ]
    }
  }
];
