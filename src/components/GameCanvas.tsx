import React, { useEffect, useRef } from 'react';
import { Engine } from '../engine/CoreLoop';
import { useGameStore } from '../store/useGameStore';

export const GameCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const engineRef = useRef<Engine | null>(null);
  const isGameOver = useGameStore(state => state.isGameOver);

  useEffect(() => {
    if (!canvasRef.current) return;
    
    // Core Engine Handshake
    engineRef.current = new Engine(canvasRef.current);
    engineRef.current.start();

    return () => {
      engineRef.current?.stop();
    };
  }, []); // Boot once

  // Restart Logic hook
  useEffect(() => {
    if (!isGameOver && engineRef.current) {
        // If state changed back to alive, re-init engine
        engineRef.current.stop();
        if (canvasRef.current) {
            engineRef.current = new Engine(canvasRef.current);
            engineRef.current.start();
        }
    }
  }, [isGameOver]);

  return (
    <div className="relative w-full h-screen flex items-center justify-center bg-black overflow-hidden">
        <canvas
            ref={canvasRef}
            width={800}
            height={600}
            className="border-2 border-[var(--color-neon-violet)] shadow-[0_0_20px_var(--color-neon-violet)]"
            style={{ imageRendering: 'pixelated' }}
        />
        {isGameOver && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 backdrop-blur-sm pointer-events-none">
                <h1 className="text-4xl text-[var(--color-cyber-red)] font-bold mb-4 tracking-widest drop-shadow-[0_0_10px_var(--color-cyber-red)]">SYSTEM FAILURE</h1>
                <p className="text-white text-lg">PRESS [SPACE] TO REBOOT PROTOCOL</p>
            </div>
        )}
    </div>
  );
};
