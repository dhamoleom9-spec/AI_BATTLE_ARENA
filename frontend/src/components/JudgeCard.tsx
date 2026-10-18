import React from 'react';
import { motion } from 'framer-motion';
import { Trophy, Sparkles, Scale } from 'lucide-react';

interface JudgeCardProps {
  judgeData?: {
    solution_1_score: number;
    solution_2_score: number;
    solution_1_reasoning: string;
    solution_2_reasoning: string;
  };
  fighter1Name: string;
  fighter2Name: string;
  isEvaluating: boolean;
}

export const JudgeCard: React.FC<JudgeCardProps> = ({
  judgeData,
  fighter1Name,
  fighter2Name,
  isEvaluating,
}) => {
  if (!judgeData && !isEvaluating) return null;

  const score1 = judgeData?.solution_1_score ?? 0;
  const score2 = judgeData?.solution_2_score ?? 0;

  let winnerText = '';
  let winnerColor = '';

  if (score1 > score2) {
    winnerText = `${fighter1Name} (Groq) VICTORY`;
    winnerColor = 'text-cyan-400 border-cyan-500/50 glow-cyan';
  } else if (score2 > score1) {
    winnerText = `${fighter2Name} (Cohere) VICTORY`;
    winnerColor = 'text-pink-400 border-pink-500/50 glow-magenta';
  } else {
    winnerText = 'HONORABLE DRAW';
    winnerColor = 'text-amber-400 border-amber-500/50 glow-gold';
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="w-full rounded-2xl border border-amber-500/30 bg-[#0c0f24]/90 backdrop-blur-xl p-6 glow-gold my-6 relative overflow-hidden"
    >
      {/* Background Glow Orbs */}
      <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-96 h-96 rounded-full bg-amber-500/5 blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 border-b border-slate-800 pb-5 mb-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-500/20 to-emerald-500/20 border border-amber-400/50 flex items-center justify-center glow-gold">
            <Scale className="w-6 h-6 text-amber-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-extrabold text-slate-100 tracking-wide">
                JUDGE EVALUATION MATRIX
              </h2>
              <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-amber-950/80 text-amber-300 border border-amber-500/30">
                GEMINI REFEREE
              </span>
            </div>
            <p className="text-xs text-slate-400 font-mono mt-0.5">
              LangGraph Automated Multi-Criteria Evaluation Node
            </p>
          </div>
        </div>

        {/* Verdict Badge */}
        {judgeData && (
          <div className={`px-5 py-2 rounded-xl border bg-slate-950/90 font-mono text-sm font-bold tracking-wider uppercase flex items-center gap-2 ${winnerColor}`}>
            <Trophy className="w-4 h-4 text-amber-400 animate-bounce" />
            {winnerText}
          </div>
        )}
      </div>

      {isEvaluating ? (
        <div className="flex flex-col items-center justify-center py-10 gap-3 text-amber-300">
          <Sparkles className="w-10 h-10 animate-spin text-amber-400" />
          <p className="text-sm font-mono animate-pulse">
            Gemini Judge is evaluating solution accuracy, clarity, and effectiveness...
          </p>
        </div>
      ) : judgeData ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Fighter 1 Score Breakdown */}
          <div className="p-4 rounded-xl border border-cyan-500/30 bg-cyan-950/10 space-y-3">
            <div className="flex justify-between items-center">
              <span className="font-bold text-slate-200 text-sm">{fighter1Name}</span>
              <span className="font-mono text-xl font-black text-cyan-400">
                {score1.toFixed(1)} <span className="text-xs text-slate-500">/ 10</span>
              </span>
            </div>
            <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${(score1 / 10) * 100}%` }}
                transition={{ duration: 1, ease: 'easeOut' }}
                className="h-full bg-cyan-400 rounded-full shadow-cyan-500/50"
              />
            </div>
            <p className="text-xs text-slate-300 leading-relaxed font-sans pt-1">
              {judgeData.solution_1_reasoning}
            </p>
          </div>

          {/* Fighter 2 Score Breakdown */}
          <div className="p-4 rounded-xl border border-pink-500/30 bg-pink-950/10 space-y-3">
            <div className="flex justify-between items-center">
              <span className="font-bold text-slate-200 text-sm">{fighter2Name}</span>
              <span className="font-mono text-xl font-black text-pink-400">
                {score2.toFixed(1)} <span className="text-xs text-slate-500">/ 10</span>
              </span>
            </div>
            <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${(score2 / 10) * 100}%` }}
                transition={{ duration: 1, ease: 'easeOut' }}
                className="h-full bg-pink-400 rounded-full shadow-pink-500/50"
              />
            </div>
            <p className="text-xs text-slate-300 leading-relaxed font-sans pt-1">
              {judgeData.solution_2_reasoning}
            </p>
          </div>
        </div>
      ) : null}
    </motion.div>
  );
};
