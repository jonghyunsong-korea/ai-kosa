import React from 'react';
import { PuzzleLevel, GameStats } from '../types';
import { PUZZLES } from '../data/puzzles';
import { 
  Trophy, 
  HelpCircle, 
  Shuffle, 
  RotateCcw, 
  Sparkles,
  Award,
  CheckCircle2,
  Clock,
  Compass
} from 'lucide-react';

interface SidebarProps {
  currentLevelId: string;
  onSelectLevel: (levelId: string) => void;
  onGenerateInfinite: (size: number) => void;
  stats: GameStats;
  onResetStats: () => void;
}

export default function Sidebar({
  currentLevelId,
  onSelectLevel,
  onGenerateInfinite,
  stats,
  onResetStats
}: SidebarProps) {
  // Calculate completion percentage
  const totalHandcrafted = PUZZLES.length;
  const solvedHandcrafted = PUZZLES.filter(p => stats.levelStatuses[p.id] === 'solved').length;
  const progressPercent = Math.round((solvedHandcrafted / totalHandcrafted) * 100);

  // Format total playing time
  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const rs = secs % 60;
    return `${mins}분 ${rs}초`;
  };

  return (
    <aside id="game-sidebar" className="w-full lg:w-80 bg-slate-900 border-r border-slate-800 p-6 flex flex-col justify-between text-slate-100 gap-6">
      {/* Upper Brand / Logo */}
      <div className="flex flex-col gap-5">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-violet-600 to-indigo-600 rounded-xl shadow-lg ring-2 ring-violet-400/20">
            <Sparkles className="w-6 h-6 text-violet-200" />
          </div>
          <div>
            <h1 className="font-display font-bold text-lg tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-violet-200 to-indigo-100">
              낱말 맞추기 그리드
            </h1>
            <p className="text-xs text-slate-400 font-mono">KOREAN WORD GRID PUZZLE</p>
          </div>
        </div>

        {/* Info/Intro */}
        <div className="bg-slate-800/50 rounded-xl p-3 text-xs leading-relaxed text-slate-300 border border-slate-705/30 transition shadow-inner">
          <div className="flex items-center gap-1.5 font-semibold text-violet-300 mb-1">
            <Compass className="w-3.5 h-3.5" />
            <span>플레이 가이드</span>
          </div>
          <p>
            4자 이하의 명사들로 구성된 가로세로 그리드입니다. 
            선택된 칸에 맞개 한국어 단어들을 빈칸없이 채워보세요!
          </p>
          <p className="mt-1 text-[11px] text-slate-400">
            💡 격자 칸을 클릭한 후, 키보드로 바로 입력하거나 아래의 문자 키패드를 이용해 문자를 배치하세요.
          </p>
        </div>

        {/* Handcrafted Levels */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-400 tracking-wider uppercase mb-1">
            <span>캠페인 스테이지</span>
            <span className="text-violet-400 font-mono">{solvedHandcrafted}/{totalHandcrafted} 완료</span>
          </div>

          <div className="space-y-1.5 max-h-[220px] overflow-y-auto pr-1">
            {PUZZLES.map((level, idx) => {
              const isCurrent = currentLevelId === level.id;
              const isSolved = stats.levelStatuses[level.id] === 'solved';
              return (
                <button
                  key={level.id}
                  id={`btn-level-${level.id}`}
                  onClick={() => onSelectLevel(level.id)}
                  className={`w-full text-left p-3 rounded-xl border text-sm transition-all duration-200 flex items-center justify-between group ${
                    isCurrent
                      ? 'bg-gradient-to-r from-violet-600/30 to-indigo-600/20 border-violet-500 text-violet-100 shadow-md shadow-violet-900/10'
                      : 'bg-slate-800/40 border-slate-800/80 hover:bg-slate-800 hover:border-slate-700 text-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className="font-mono text-xs opacity-50">0{idx + 1}</span>
                    <span className="font-medium truncate max-w-[120px]">{level.name.split(':')[1]?.trim() || level.name}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700/50 uppercase">
                      {level.size}x{level.size}
                    </span>
                    {isSolved ? (
                      <CheckCircle2 className="w-4.5 h-4.5 text-emerald-400 shrink-0" />
                    ) : (
                      <div className="w-2 h-2 rounded-full bg-slate-600 group-hover:bg-violet-400 transition" />
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Infinite Mode Generation */}
        <div className="flex flex-col gap-2 pt-2 border-t border-slate-800/80">
          <div className="text-xs font-semibold text-slate-400 tracking-wider uppercase mb-1 flex items-center gap-1.5">
            <Shuffle className="w-3.5 h-3.5 text-violet-400" />
            <span>무한 연습 모드</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <button
              id="btn-gen-5"
              onClick={() => onGenerateInfinite(5)}
              className="px-3 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl text-xs font-semibold flex items-center justify-center gap-1 hover:border-violet-500/50 transition cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-violet-400" />
              <span>미니 5x5</span>
            </button>
            <button
              id="btn-gen-6"
              onClick={() => onGenerateInfinite(6)}
              className="px-3 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl text-xs font-semibold flex items-center justify-center gap-1 hover:border-violet-500/50 transition cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-purple-400" />
              <span>도전 6x6</span>
            </button>
          </div>
        </div>
      </div>

      {/* Lower Block: Stats & Trophy Room */}
      <div className="flex flex-col gap-4 border-t border-slate-850 pt-4 bg-slate-900">
        <div className="bg-slate-950/60 rounded-xl p-4 border border-slate-800/80 flex flex-col gap-3">
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-350 tracking-wide">
            <Trophy className="w-4 h-4 text-amber-500" />
            <span>기록 보관소</span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="bg-slate-900/50 p-2 rounded-lg border border-slate-800/50">
              <span className="text-[10px] text-slate-500 block">해결한 퍼즐</span>
              <span className="font-mono text-base font-bold text-slate-200">
                {stats.solvedCount} <span className="text-[11px] font-normal text-slate-500">개</span>
              </span>
            </div>
            <div className="bg-slate-900/50 p-2 rounded-lg border border-slate-800/50">
              <span className="text-[10px] text-slate-500 block">도움 힌트</span>
              <span className="font-mono text-base font-bold text-slate-200">
                {stats.hintsUsed} <span className="text-[11px] font-normal text-slate-500">회</span>
              </span>
            </div>
            <div className="col-span-2 bg-slate-900/50 p-2 rounded-lg border border-slate-800/50 flex justify-between items-center">
              <div>
                <span className="text-[10px] text-slate-500 block">총 누적 플레이 시간</span>
                <span className="font-mono text-sm font-semibold text-violet-300">
                  {formatTime(stats.totalTimeSec)}
                </span>
              </div>
              <Clock className="w-4 h-4 text-violet-400" />
            </div>
          </div>

          {/* Progress bar */}
          <div className="mt-1">
            <div className="flex justify-between text-[11px] text-slate-400 mb-1">
              <span>캠페인 정복률</span>
              <span className="font-semibold text-slate-300">{progressPercent}%</span>
            </div>
            <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-violet-500 to-indigo-500 transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        </div>

        {/* Reset stats buttons */}
        <button
          id="btn-reset-stats"
          onClick={onResetStats}
          className="text-slate-500 hover:text-red-400/80 text-[10px] flex items-center justify-center gap-1.5 font-mono py-1 rounded border border-transparent hover:border-red-500/10 hover:bg-red-500/5 transition cursor-pointer"
        >
          <RotateCcw className="w-3 h-3" />
          <span>기록 및 달성도 초기화</span>
        </button>
      </div>
    </aside>
  );
}
