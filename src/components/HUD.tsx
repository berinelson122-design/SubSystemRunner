import React, { useEffect } from 'react';
import { useGameStore } from '../store/useGameStore';
import { Terminal } from 'lucide-react';

export const HUD: React.FC = () => {
  const { score, isGameOver, resetGame } = useGameStore();

  // Handle global reboot hotkey
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
        if (isGameOver && e.code === 'Space') {
            resetGame();
        }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isGameOver, resetGame]);

  return (
    <div className="absolute top-0 left-0 w-full p-6 flex justify-between items-start pointer-events-none z-10">
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-3 text-[var(--color-neon-violet)] text-xl font-bold tracking-wider drop-shadow-[0_0_8px_var(--color-neon-violet)]">
            <Terminal className="w-6 h-6" />
            <span>SUBSYSTEM_RUNNER.EXE</span>
        </div>
        <div className="text-white/70 text-sm">
            [ARROWS] MOVEMENT // [UP/SPACE] LOGIC JUMP // [SHIFT] DATA DASH
        </div>
      </div>

      <div className="flex flex-col items-end gap-1">
        <div className="text-white/50 text-sm tracking-widest">DATA EXTRACTED</div>
        <div className="text-3xl text-[var(--color-neon-violet)] font-bold drop-shadow-[0_0_5px_var(--color-neon-violet)]">
            {score.toString().padStart(6, '0')}
        </div>
      </div>
    </div>
  );
};
