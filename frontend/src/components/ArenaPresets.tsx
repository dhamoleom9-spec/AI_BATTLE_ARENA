import React from 'react';
import { Code, Sparkles, Binary, Brain, ShieldAlert, Flame } from 'lucide-react';
import { playClickSound, playHoverSound } from '../utils/soundEffects';

export interface PresetTopic {
  id: string;
  category: string;
  iconName: string;
  title: string;
  prompt: string;
  badge: string;
}

export const PRESET_TOPICS: PresetTopic[] = [
  {
    id: '1',
    category: 'System Design',
    iconName: 'Code',
    title: 'High-Throughput Rate Limiter',
    prompt: 'Design a distributed rate limiter in TypeScript for 1,000,000 requests per minute with sliding window log and Redis cache fallback.',
    badge: 'Code Duel'
  },
  {
    id: '2',
    category: 'AI & Ethics',
    iconName: 'Brain',
    title: 'Autonomous AI Responsibility',
    prompt: 'Should fully autonomous decision-making AI systems possess legal personhood and moral responsibility when operating critical infrastructure?',
    badge: 'Deep Debate'
  },
  {
    id: '3',
    category: 'Sci-Fi Narrative',
    iconName: 'Sparkles',
    title: 'First Contact on Mars',
    prompt: 'Write an intense, suspenseful 3-paragraph narrative about an astronaut encountering an ancient sentient quantum AI core beneath Olympus Mons on Mars.',
    badge: 'Creative'
  },
  {
    id: '4',
    category: 'Quantum Computing',
    iconName: 'Binary',
    title: 'Shor Algorithm vs RSA 4096',
    prompt: 'Explain how Shor\'s quantum algorithm breaks RSA 4096 encryption and detail the leading post-quantum cryptographic algorithms designed to replace it.',
    badge: 'Quantum Physics'
  },
  {
    id: '5',
    category: 'Algorithmic Golf',
    iconName: 'Flame',
    title: 'Concurrency Deadlock Resolution',
    prompt: 'Identify the exact race condition and deadlock vulnerability in multi-threaded producer-consumer queues and provide the optimal lock-free fix.',
    badge: 'Bug Hunt'
  }
];

interface ArenaPresetsProps {
  onSelectPreset: (prompt: string) => void;
  disabled?: boolean;
}

export const ArenaPresets: React.FC<ArenaPresetsProps> = ({ onSelectPreset, disabled }) => {
  const getIcon = (name: string) => {
    switch (name) {
      case 'Code': return <Code className="w-4 h-4 text-cyan-400" />;
      case 'Brain': return <Brain className="w-4 h-4 text-purple-400" />;
      case 'Sparkles': return <Sparkles className="w-4 h-4 text-pink-400" />;
      case 'Binary': return <Binary className="w-4 h-4 text-emerald-400" />;
      case 'Flame': return <Flame className="w-4 h-4 text-amber-400" />;
      default: return <ShieldAlert className="w-4 h-4 text-cyan-400" />;
    }
  };

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-xs font-mono uppercase tracking-widest text-slate-400 flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
          Featured Battle Arenas
        </h3>
        <span className="text-[10px] text-slate-500 font-mono">Select a battle blueprint</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2.5">
        {PRESET_TOPICS.map((preset) => (
          <button
            key={preset.id}
            disabled={disabled}
            onMouseEnter={playHoverSound}
            onClick={() => {
              playClickSound();
              onSelectPreset(preset.prompt);
            }}
            className={`p-3 rounded-xl border border-slate-800 bg-slate-900/60 hover:bg-slate-800/80 hover:border-cyan-500/40 transition-all duration-300 text-left group relative overflow-hidden flex flex-col justify-between ${
              disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:shadow-lg hover:shadow-cyan-500/10'
            }`}
          >
            <div>
              <div className="flex items-center justify-between gap-1 mb-1.5">
                <span className="p-1 rounded-lg bg-slate-800/80 border border-slate-700/50 group-hover:border-cyan-500/30">
                  {getIcon(preset.iconName)}
                </span>
                <span className="text-[9px] font-mono uppercase tracking-wider px-1.5 py-0.5 rounded bg-cyan-950/60 text-cyan-300 border border-cyan-500/20">
                  {preset.badge}
                </span>
              </div>
              <h4 className="text-xs font-semibold text-slate-200 group-hover:text-cyan-300 transition-colors line-clamp-1">
                {preset.title}
              </h4>
            </div>

            <p className="text-[11px] text-slate-400 mt-2 line-clamp-2 leading-relaxed font-sans">
              {preset.prompt}
            </p>

            <div className="absolute inset-x-0 bottom-0 h-0.5 bg-gradient-to-r from-transparent via-cyan-500/0 to-transparent group-hover:via-cyan-400 transition-all duration-300" />
          </button>
        ))}
      </div>
    </div>
  );
};
