import React from 'react';
import { Swords, Volume2, VolumeX, Activity, Zap, Cpu } from 'lucide-react';
import { playClickSound, toggleSound } from '../utils/soundEffects';

interface NavbarProps {
  isBackendConnected: boolean;
  isAudioOn: boolean;
  setIsAudioOn: (val: boolean) => void;
  onOpenHistory?: () => void;
  isBattling: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  isBackendConnected,
  isAudioOn,
  setIsAudioOn,
  isBattling,
}) => {
  const handleAudioToggle = () => {
    const nextState = !isAudioOn;
    toggleSound(nextState);
    setIsAudioOn(nextState);
    if (nextState) playClickSound();
  };

  return (
    <header className="sticky top-0 z-40 backdrop-blur-xl bg-[#070a18]/90 border-b border-cyan-500/20 px-4 lg:px-8 py-3.5 transition-all duration-300">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        
        {/* Brand Logo & Title */}
        <div className="flex items-center gap-3 cursor-pointer">
          <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500/20 to-magenta-500/20 border border-cyan-400/40 glow-cyan">
            <Swords className="w-5 h-5 text-cyan-400" />
            <div className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-xl tracking-wider bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-pink-500 to-amber-300 text-glow-cyan">
                AI BATTLE ARENA
              </span>
            </div>
            <p className="text-xs text-slate-400 font-mono flex items-center gap-1.5">
              <Cpu className="w-3 h-3 text-cyan-400" />
              Groq LLaMA 3.3 vs Cohere Command R+
            </p>
          </div>
        </div>

        {/* Center Live Status */}
        <div className="flex items-center gap-3">
          <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-mono tracking-wide ${
            isBattling 
              ? 'bg-pink-950/40 border-pink-500/40 text-pink-300 animate-pulse glow-magenta'
              : 'bg-slate-900/60 border-slate-800 text-slate-400'
          }`}>
            <Zap className={`w-3.5 h-3.5 ${isBattling ? 'text-pink-400 animate-bounce' : 'text-slate-500'}`} />
            <span>{isBattling ? 'BATTLES IN PROGRESS...' : 'ARENA READY'}</span>
          </div>

          <div className={`hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-mono ${
            isBackendConnected 
              ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-400'
              : 'bg-amber-950/40 border-amber-500/40 text-amber-300'
          }`}>
            <Activity className={`w-3.5 h-3.5 ${isBackendConnected ? 'text-emerald-400 animate-pulse' : 'text-amber-400'}`} />
            <span>{isBackendConnected ? 'BACKEND ONLINE' : 'SIMULATION MODE'}</span>
          </div>

          {/* Audio SFX Toggle */}
          <button
            onClick={handleAudioToggle}
            className={`p-2 rounded-xl border transition-all duration-200 flex items-center gap-2 text-xs font-mono ${
              isAudioOn 
                ? 'bg-cyan-950/40 border-cyan-500/40 text-cyan-400 hover:bg-cyan-900/50 glow-cyan' 
                : 'bg-slate-900/50 border-slate-800 text-slate-500 hover:text-slate-300'
            }`}
            title="Toggle Sound Effects"
          >
            {isAudioOn ? <Volume2 className="w-4 h-4 text-cyan-400 animate-pulse" /> : <VolumeX className="w-4 h-4" />}
            <span className="hidden sm:inline">{isAudioOn ? 'SFX ON' : 'SFX OFF'}</span>
          </button>
        </div>

      </div>
    </header>
  );
};
