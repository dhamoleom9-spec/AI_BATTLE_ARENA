import { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { ParticleBackground } from './components/ParticleBackground';
import { Navbar } from './components/Navbar';
import { BattleStage } from './components/BattleStage';
import { FighterCard } from './components/FighterCard';
import { 
  checkBackendHealth, 
  runBackendBattle 
} from './services/api';
import type { BattleResult } from './services/api';
import { 
  playChargeSound, 
  playClashSound, 
  playVictoryFanfare 
} from './utils/soundEffects';

export function App() {
  const [prompt, setPrompt] = useState('What is compilation in CD (Compiler Design)? Explain in detail.');
  const [isBattling, setIsBattling] = useState(false);
  const [battleResult, setBattleResult] = useState<BattleResult | null>(null);
  const [isBackendConnected, setIsBackendConnected] = useState(false);
  const [isAudioOn, setIsAudioOn] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Check backend health periodically
  useEffect(() => {
    async function verifyHealth() {
      const isAlive = await checkBackendHealth();
      setIsBackendConnected(isAlive);
    }
    verifyHealth();
    const interval = setInterval(verifyHealth, 5000);
    return () => clearInterval(interval);
  }, []);

  // Main Battle Execution Dispatcher
  const handleStartBattle = async () => {
    if (!prompt.trim() || isBattling) return;

    setIsBattling(true);
    setBattleResult(null);
    setErrorMessage(null);

    // Play SFX
    playChargeSound();

    try {
      console.log(`[ARENA] Sending question to backend: "${prompt}"`);
      const result = await runBackendBattle(prompt.trim());
      console.log(`[ARENA] Received answers from backend:`, result);

      playClashSound();

      // Set real answers from both models
      setBattleResult(result);
      setIsBattling(false);

      // Victory Fanfare & Confetti
      playVictoryFanfare();
      confetti({
        particleCount: 60,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#00f0ff', '#ff007f', '#ffd700'],
      });

    } catch (error: any) {
      console.error('Battle error:', error);
      setErrorMessage(error.message || 'Failed to connect to the backend server on http://localhost:3000.');
      setIsBattling(false);
    }
  };

  const score1 = battleResult?.judge?.solution_1_score ?? 0;
  const score2 = battleResult?.judge?.solution_2_score ?? 0;
  const isGroqWinner = battleResult ? score1 > score2 : false;
  const isCohereWinner = battleResult ? score2 > score1 : false;
  const isDraw = battleResult ? score1 === score2 : false;

  return (
    <div className="min-h-screen bg-[#05070f] text-slate-100 cyber-grid relative selection:bg-cyan-500 selection:text-slate-950 font-sans pb-16">
      
      {/* Animated Particle Arena Backdrop */}
      <ParticleBackground isBattling={isBattling} />

      {/* Navigation Header */}
      <Navbar
        isBackendConnected={isBackendConnected}
        isAudioOn={isAudioOn}
        setIsAudioOn={setIsAudioOn}
        isBattling={isBattling}
      />

      <main className="max-w-7xl mx-auto px-4 lg:px-8 pt-4 relative z-10 space-y-6">

        {/* Error Notification */}
        {errorMessage && (
          <div className="p-4 rounded-xl border border-red-500/50 bg-red-950/60 text-red-200 text-sm font-mono flex items-center justify-between shadow-xl">
            <div className="flex items-center gap-2">
              <span className="text-red-400 font-bold">ERROR:</span>
              <span>{errorMessage}</span>
            </div>
            <button
              onClick={() => setErrorMessage(null)}
              className="px-3 py-1 rounded bg-red-900/60 hover:bg-red-800 text-white text-xs uppercase font-mono cursor-pointer"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* 1. Challenge Prompt Input Box */}
        <BattleStage
          prompt={prompt}
          setPrompt={setPrompt}
          onStartBattle={handleStartBattle}
          isBattling={isBattling}
          disabled={isBattling}
        />

        {/* 2. The Battle Arena: Both AI Models and Their Invoked Answers */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Groq Combatant Card */}
          <FighterCard
            id="groq"
            name="Groq (LLaMA)"
            model="openai/gpt-oss-20b"
            provider="Groq Cloud"
            avatarBg="from-cyan-500 to-blue-600"
            themeColor="cyan"
            solutionText={battleResult?.solution_1 || ''}
            score={battleResult?.judge?.solution_1_score}
            reasoning={battleResult?.judge?.solution_1_reasoning}
            isBattling={isBattling}
            isWinner={isGroqWinner}
            isDraw={isDraw}
          />

          {/* Cohere Combatant Card */}
          <FighterCard
            id="cohere"
            name="Cohere (Command)"
            model="command-a-03-2025"
            provider="Cohere AI"
            avatarBg="from-pink-500 to-purple-600"
            themeColor="magenta"
            solutionText={battleResult?.solution_2 || ''}
            score={battleResult?.judge?.solution_2_score}
            reasoning={battleResult?.judge?.solution_2_reasoning}
            isBattling={isBattling}
            isWinner={isCohereWinner}
            isDraw={isDraw}
          />
        </div>

      </main>

    </div>
  );
}

export default App;
