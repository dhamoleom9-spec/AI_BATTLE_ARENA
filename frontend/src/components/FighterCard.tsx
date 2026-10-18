import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Cpu, Zap, Copy, Check, Terminal, Award, Sparkles, CheckCircle2 } from 'lucide-react';
import { playClickSound } from '../utils/soundEffects';

interface FighterCardProps {
  id: string;
  name: string;
  model: string;
  provider: string;
  avatarBg: string;
  themeColor: 'cyan' | 'magenta';
  solutionText: string;
  score?: number;
  reasoning?: string;
  isBattling: boolean;
  isWinner: boolean;
  isDraw?: boolean;
}

// Clean markdown formatter to ensure answers are crystal clear and beautifully formatted
function FormattedAnswer({ text }: { text: string }) {
  if (!text) return null;

  const lines = text.split('\n');
  const elements: React.ReactNode[] = [];
  let inCodeBlock = false;
  let codeBuffer: string[] = [];

  const formatInline = (str: string): React.ReactNode => {
    // Replace **bold** with strong
    const parts = str.split(/(\*\*[^*]+\*\*|`[^`]+`)/g);
    return parts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={i} className="text-white font-bold">{part.slice(2, -2)}</strong>;
      }
      if (part.startsWith('`') && part.endsWith('`')) {
        return (
          <code key={i} className="px-1.5 py-0.5 rounded bg-slate-800 text-cyan-300 font-mono text-xs border border-slate-700">
            {part.slice(1, -1)}
          </code>
        );
      }
      return part;
    });
  };

  lines.forEach((line, idx) => {
    if (line.trim().startsWith('```')) {
      if (inCodeBlock) {
        // End of code block
        elements.push(
          <div key={`code-${idx}`} className="my-3 p-3.5 rounded-xl bg-[#030612] border border-slate-700 font-mono text-xs text-cyan-200 overflow-x-auto shadow-inner">
            <pre className="leading-relaxed">{codeBuffer.join('\n')}</pre>
          </div>
        );
        codeBuffer = [];
        inCodeBlock = false;
      } else {
        inCodeBlock = true;
      }
      return;
    }

    if (inCodeBlock) {
      codeBuffer.push(line);
      return;
    }

    const trimmed = line.trim();
    if (!trimmed) {
      elements.push(<div key={`spacer-${idx}`} className="h-2" />);
      return;
    }

    // Headings
    if (trimmed.startsWith('### ')) {
      elements.push(
        <h4 key={`h3-${idx}`} className="text-sm font-bold text-cyan-300 mt-3 mb-1 uppercase tracking-wider font-mono">
          {trimmed.slice(4)}
        </h4>
      );
      return;
    }
    if (trimmed.startsWith('## ')) {
      elements.push(
        <h3 key={`h2-${idx}`} className="text-base font-bold text-white mt-4 mb-1 border-b border-slate-800 pb-1">
          {trimmed.slice(3)}
        </h3>
      );
      return;
    }
    if (trimmed.startsWith('# ')) {
      elements.push(
        <h2 key={`h1-${idx}`} className="text-lg font-extrabold text-white mt-4 mb-2">
          {trimmed.slice(2)}
        </h2>
      );
      return;
    }

    // Bullet points
    if (trimmed.startsWith('* ') || trimmed.startsWith('- ') || trimmed.startsWith('• ')) {
      elements.push(
        <div key={`li-${idx}`} className="flex items-start gap-2 my-1 pl-1">
          <span className="text-cyan-400 mt-1 text-xs">•</span>
          <p className="text-sm text-slate-200 leading-relaxed flex-1">
            {formatInline(trimmed.slice(2))}
          </p>
        </div>
      );
      return;
    }

    // Standard numbered list
    const numMatch = trimmed.match(/^(\d+\.)\s+(.+)$/);
    if (numMatch) {
      elements.push(
        <div key={`num-${idx}`} className="flex items-start gap-2 my-1 pl-1">
          <span className="font-mono text-xs text-cyan-400 font-bold mt-0.5">{numMatch[1]}</span>
          <p className="text-sm text-slate-200 leading-relaxed flex-1">
            {formatInline(numMatch[2])}
          </p>
        </div>
      );
      return;
    }

    // Regular paragraph
    elements.push(
      <p key={`p-${idx}`} className="text-sm text-slate-200 leading-relaxed my-1.5 font-normal">
        {formatInline(line)}
      </p>
    );
  });

  if (inCodeBlock && codeBuffer.length > 0) {
    elements.push(
      <div key="code-end" className="my-3 p-3.5 rounded-xl bg-[#030612] border border-slate-700 font-mono text-xs text-cyan-200 overflow-x-auto shadow-inner">
        <pre className="leading-relaxed">{codeBuffer.join('\n')}</pre>
      </div>
    );
  }

  return <div className="space-y-1">{elements}</div>;
}

export const FighterCard: React.FC<FighterCardProps> = ({
  name,
  model,
  provider,
  themeColor,
  solutionText,
  score,
  reasoning,
  isBattling,
  isWinner,
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    playClickSound();
    navigator.clipboard.writeText(solutionText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const isCyan = themeColor === 'cyan';
  const borderGlow = isWinner 
    ? 'border-amber-400/80 shadow-[0_0_30px_rgba(251,191,36,0.25)] ring-1 ring-amber-400/50' 
    : isCyan 
      ? 'border-cyan-500/50 shadow-[0_0_25px_rgba(6,182,212,0.15)]' 
      : 'border-pink-500/50 shadow-[0_0_25px_rgba(236,72,153,0.15)]';

  const wordCount = solutionText ? solutionText.trim().split(/\s+/).filter(Boolean).length : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className={`relative rounded-2xl border bg-[#0a0e24]/95 backdrop-blur-xl p-6 flex flex-col justify-between transition-all duration-300 ${borderGlow}`}
    >
      {/* Winner Aura Banner */}
      {isWinner && (
        <div className="absolute -top-3.5 left-1/2 transform -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 text-slate-950 font-black text-xs tracking-wider uppercase flex items-center gap-1.5 shadow-lg shadow-amber-500/40">
          <Award className="w-4 h-4 text-slate-950" />
          HIGHEST RATED ANSWER
        </div>
      )}

      {/* Top AI Model Header */}
      <div>
        <div className="flex items-center justify-between gap-3 mb-4 border-b border-slate-800/80 pb-4">
          <div className="flex items-center gap-3">
            <div className={`relative w-12 h-12 rounded-xl flex items-center justify-center border font-mono font-bold text-lg ${
              isCyan 
                ? 'bg-cyan-950/70 border-cyan-400/50 text-cyan-300 shadow-[0_0_15px_rgba(6,182,212,0.3)]' 
                : 'bg-pink-950/70 border-pink-400/50 text-pink-300 shadow-[0_0_15px_rgba(236,72,153,0.3)]'
            }`}>
              <Cpu className={`w-6 h-6 ${isCyan ? 'text-cyan-400' : 'text-pink-400'}`} />
              {isBattling && (
                <div className={`absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full border-2 border-slate-950 animate-ping ${
                  isCyan ? 'bg-cyan-400' : 'bg-pink-400'
                }`} />
              )}
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-black text-white tracking-wide">{name}</h3>
                <span className={`text-[10px] uppercase font-mono px-2.5 py-0.5 rounded border font-bold ${
                  isCyan 
                    ? 'bg-cyan-950/90 text-cyan-300 border-cyan-500/40' 
                    : 'bg-pink-950/90 text-pink-300 border-pink-500/40'
                }`}>
                  {provider}
                </span>
              </div>
              <p className="text-xs text-slate-400 font-mono mt-0.5 flex items-center gap-1">
                <Terminal className="w-3.5 h-3.5 text-slate-500" />
                Model: <span className="text-slate-300">{model}</span>
              </p>
            </div>
          </div>

          {/* Score Badge */}
          {score !== undefined && score !== null && (
            <div className="text-right bg-slate-900/80 px-3.5 py-1.5 rounded-xl border border-slate-800">
              <div className="text-2xl font-black font-mono tracking-tight flex items-baseline justify-end gap-1">
                <span className={isWinner ? 'text-amber-400' : isCyan ? 'text-cyan-400' : 'text-pink-400'}>
                  {score.toFixed(1)}
                </span>
                <span className="text-xs text-slate-500 font-normal">/10</span>
              </div>
              <span className="text-[9px] text-slate-400 font-mono uppercase tracking-widest block">
                JUDGE SCORE
              </span>
            </div>
          )}
        </div>

        {/* Word Count and Status Bar */}
        <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-2.5 px-1">
          <span className="flex items-center gap-1.5 text-slate-300 font-semibold">
            <Zap className={`w-3.5 h-3.5 ${isCyan ? 'text-cyan-400' : 'text-pink-400'}`} />
            Invoked Answer Output
          </span>
          <span className="text-[11px] bg-slate-900 px-2 py-0.5 rounded border border-slate-800 text-slate-300">
            {wordCount} WORDS
          </span>
        </div>

        {/* Full Visible Answer Display Area */}
        <div className="relative rounded-xl border border-slate-700/80 bg-[#070b1a] p-5 font-sans min-h-[340px] max-h-[550px] overflow-y-auto shadow-inner text-slate-100">
          {solutionText ? (
            <div>
              <div className="flex items-center justify-between border-b border-slate-800 pb-2.5 mb-3.5">
                <span className="text-xs font-mono text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  Live Model Output:
                </span>
                <button
                  onClick={handleCopy}
                  className="px-2.5 py-1 rounded-lg bg-slate-800/90 hover:bg-slate-700 border border-slate-600 text-slate-200 text-xs font-mono flex items-center gap-1.5 transition-colors cursor-pointer"
                  title="Copy full answer text"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  {copied ? 'Copied!' : 'Copy Answer'}
                </button>
              </div>

              {/* Formatted Answer */}
              <div className="text-slate-100 leading-relaxed text-sm select-text">
                <FormattedAnswer text={solutionText} />
              </div>
            </div>
          ) : isBattling ? (
            <div className="flex flex-col items-center justify-center h-64 gap-3 text-slate-300">
              <Sparkles className={`w-10 h-10 animate-spin ${isCyan ? 'text-cyan-400' : 'text-pink-400'}`} />
              <p className="animate-pulse text-sm font-mono text-slate-200 font-semibold">
                Invoking {name}... generating complete answer...
              </p>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-64 text-slate-500 gap-3">
              <Terminal className="w-10 h-10 opacity-30" />
              <p className="text-sm font-mono text-center text-slate-400">
                Awaiting battle challenge.<br />
                Type your question above and click <span className="text-cyan-400 font-bold">Dispatch Battle</span>!
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Judge Reasoning Box */}
      {reasoning && (
        <div className="mt-4 pt-3.5 border-t border-slate-800/80">
          <h4 className="text-[11px] font-mono uppercase tracking-wider text-amber-400 mb-1.5 flex items-center gap-1.5 font-bold">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            Judge Evaluation & Feedback
          </h4>
          <p className="text-xs text-slate-300 leading-relaxed bg-slate-900/60 p-3 rounded-xl border border-slate-800 font-sans">
            "{reasoning}"
          </p>
        </div>
      )}
    </motion.div>
  );
};
