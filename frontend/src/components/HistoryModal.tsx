import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, History, RotateCcw, Trash2 } from 'lucide-react';
import { playClickSound } from '../utils/soundEffects';
import type { BattleResult } from '../services/api';

export interface HistoryItem extends BattleResult {
  id: string;
  timestamp: string;
}

interface HistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  history: HistoryItem[];
  onSelectPrompt: (prompt: string) => void;
  onClearHistory: () => void;
}

export const HistoryModal: React.FC<HistoryModalProps> = ({
  isOpen,
  onClose,
  history,
  onSelectPrompt,
  onClearHistory,
}) => {
  if (!isOpen) return null;

  // Calculate statistics
  const totalBattles = history.length;
  let groqWins = 0;
  let cohereWins = 0;

  history.forEach((item) => {
    const s1 = item.judge?.solution_1_score ?? 0;
    const s2 = item.judge?.solution_2_score ?? 0;
    if (s1 > s2) groqWins++;
    else if (s2 > s1) cohereWins++;
  });

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="relative w-full max-w-3xl max-h-[85vh] rounded-2xl border border-cyan-500/30 bg-[#090d20] p-6 shadow-2xl glow-cyan flex flex-col"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-cyan-950/80 border border-cyan-500/40 text-cyan-400">
                <History className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-100 font-mono tracking-wide">
                  BATTLE LOGS & ANALYTICS
                </h3>
                <p className="text-xs text-slate-400 font-sans">
                  Local archives of past AI confrontations
                </p>
              </div>
            </div>

            <button
              onClick={() => {
                playClickSound();
                onClose();
              }}
              className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-100 hover:border-slate-700 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Stats Bar */}
          <div className="grid grid-cols-3 gap-3 mb-5">
            <div className="p-3 rounded-xl border border-cyan-500/20 bg-cyan-950/20 text-center">
              <span className="text-[10px] font-mono uppercase text-slate-400 block">Groq Wins</span>
              <span className="text-xl font-bold font-mono text-cyan-400">{groqWins}</span>
            </div>
            <div className="p-3 rounded-xl border border-pink-500/20 bg-pink-950/20 text-center">
              <span className="text-[10px] font-mono uppercase text-slate-400 block">Cohere Wins</span>
              <span className="text-xl font-bold font-mono text-pink-400">{cohereWins}</span>
            </div>
            <div className="p-3 rounded-xl border border-amber-500/20 bg-amber-950/20 text-center">
              <span className="text-[10px] font-mono uppercase text-slate-400 block">Total Battles</span>
              <span className="text-xl font-bold font-mono text-amber-400">{totalBattles}</span>
            </div>
          </div>

          {/* History List */}
          <div className="flex-1 overflow-y-auto space-y-3 pr-1">
            {history.length === 0 ? (
              <div className="text-center py-12 text-slate-500 font-mono text-xs">
                No past battle records found. Dispatch your first battle!
              </div>
            ) : (
              history.map((item) => {
                const s1 = item.judge?.solution_1_score ?? 0;
                const s2 = item.judge?.solution_2_score ?? 0;
                const isGroqWin = s1 > s2;
                const isCohereWin = s2 > s1;

                return (
                  <div
                    key={item.id}
                    className="p-4 rounded-xl border border-slate-800 bg-slate-900/60 hover:border-slate-700 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono text-slate-500">
                          {item.timestamp}
                        </span>
                        <span className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded border ${
                          isGroqWin 
                            ? 'bg-cyan-950 text-cyan-300 border-cyan-500/30' 
                            : isCohereWin 
                              ? 'bg-pink-950 text-pink-300 border-pink-500/30' 
                              : 'bg-amber-950 text-amber-300 border-amber-500/30'
                        }`}>
                          {isGroqWin ? 'Groq Victory' : isCohereWin ? 'Cohere Victory' : 'Draw'}
                        </span>
                      </div>
                      <p className="text-xs text-slate-200 line-clamp-2 font-sans font-medium">
                        "{item.problem}"
                      </p>
                      <div className="text-[11px] font-mono text-slate-400 flex items-center gap-3">
                        <span className="text-cyan-400">Groq: {s1.toFixed(1)}</span>
                        <span className="text-pink-400">Cohere: {s2.toFixed(1)}</span>
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        playClickSound();
                        onSelectPrompt(item.problem);
                        onClose();
                      }}
                      className="px-3 py-1.5 rounded-lg border border-cyan-500/30 bg-cyan-950/40 hover:bg-cyan-900/60 text-cyan-300 text-xs font-mono flex items-center gap-1.5 self-start sm:self-center transition-colors"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      RE-RUN
                    </button>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer Actions */}
          {history.length > 0 && (
            <div className="mt-4 pt-3 border-t border-slate-800 flex justify-end">
              <button
                onClick={() => {
                  playClickSound();
                  onClearHistory();
                }}
                className="px-3 py-1.5 rounded-lg border border-red-500/30 bg-red-950/30 hover:bg-red-900/50 text-red-400 text-xs font-mono flex items-center gap-1.5 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                CLEAR LOGS
              </button>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
