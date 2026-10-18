import React from 'react';
import { motion } from 'framer-motion';
import { Swords, RefreshCw, Terminal } from 'lucide-react';
import { playClickSound, playHoverSound } from '../utils/soundEffects';

interface BattleStageProps {
  prompt: string;
  setPrompt: (val: string) => void;
  onStartBattle: () => void;
  isBattling: boolean;
  disabled?: boolean;
}

export const BattleStage: React.FC<BattleStageProps> = ({
  prompt,
  setPrompt,
  onStartBattle,
  isBattling,
  disabled,
}) => {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      if (prompt.trim() && !disabled && !isBattling) {
        onStartBattle();
      }
    }
  };

  return (
    <div className="w-full my-4">
      {/* Central Input Box */}
      <div className="relative rounded-2xl border border-cyan-500/30 bg-[#0b0e22]/90 backdrop-blur-xl p-4 sm:p-5 glow-cyan transition-all duration-300">
        <div className="flex items-center justify-between mb-2">
          <label className="text-xs font-mono uppercase tracking-widest text-cyan-400 flex items-center gap-1.5">
            <Terminal className="w-4 h-4 text-cyan-400" />
            Arena Challenge Prompt
          </label>
          <span className="text-[10px] text-slate-400 font-mono">
            Press <kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-cyan-300 border border-slate-700">Ctrl + Enter</kbd> to launch
          </span>
        </div>

        <div className="relative">
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={disabled || isBattling}
            placeholder="Enter a problem, algorithmic challenge, creative scenario, or philosophy question for the AI models to battle over..."
            rows={3}
            className="w-full bg-[#060814] border border-slate-800 rounded-xl p-3.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 font-sans leading-relaxed resize-none transition-all duration-200"
          />

          <div className="flex flex-wrap items-center justify-between gap-3 mt-3">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  playClickSound();
                  setPrompt('');
                }}
                disabled={!prompt || isBattling}
                className="px-3 py-1.5 rounded-lg border border-slate-800 bg-slate-900/60 hover:bg-slate-800 text-xs font-mono text-slate-400 hover:text-slate-200 transition-colors disabled:opacity-40"
              >
                CLEAR
              </button>
              <span className="text-[11px] text-slate-500 font-mono">
                {prompt.length} CHARS
              </span>
            </div>

            {/* Launch Battle Button */}
            <button
              type="button"
              onMouseEnter={playHoverSound}
              onClick={() => {
                playClickSound();
                onStartBattle();
              }}
              disabled={!prompt.trim() || disabled || isBattling}
              className={`px-6 py-2.5 rounded-xl font-mono font-bold text-xs uppercase tracking-wider flex items-center gap-2 transition-all duration-300 cursor-pointer ${
                isBattling
                  ? 'bg-pink-600 text-white animate-pulse glow-magenta'
                  : prompt.trim()
                    ? 'bg-gradient-to-r from-cyan-500 via-teal-400 to-cyan-500 text-slate-950 hover:brightness-110 glow-cyan shadow-lg shadow-cyan-500/25'
                    : 'bg-slate-800 text-slate-500 border border-slate-700 cursor-not-allowed'
              }`}
            >
              {isBattling ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-white" />
                  BATTLE IN PROGRESS...
                </>
              ) : (
                <>
                  <Swords className="w-4 h-4" />
                  DISPATCH BATTLE
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* VS Emblem & Energy Discharge Node */}
      <div className="relative flex items-center justify-center my-6">
        <div className="w-full h-px bg-gradient-to-r from-transparent via-cyan-500/40 to-transparent" />
        
        <div className="absolute z-10 flex items-center justify-center">
          <motion.div
            animate={{
              scale: isBattling ? [1, 1.2, 1] : 1,
              rotate: isBattling ? 360 : 0,
            }}
            transition={{
              duration: isBattling ? 3 : 20,
              repeat: Infinity,
              ease: 'linear',
            }}
            className={`w-14 h-14 rounded-full border-2 flex items-center justify-center bg-[#070a1a] shadow-2xl transition-colors duration-500 ${
              isBattling
                ? 'border-pink-500 glow-magenta'
                : 'border-cyan-400 glow-cyan'
            }`}
          >
            <span className={`font-mono font-black text-lg tracking-widest ${
              isBattling ? 'text-pink-400' : 'text-cyan-400'
            }`}>
              VS
            </span>
          </motion.div>
        </div>
      </div>
    </div>
  );
};
