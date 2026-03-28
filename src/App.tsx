import React from 'react';
import { GameCanvas } from './components/GameCanvas';
import { HUD } from './components/HUD';
import { Watermark } from './components/Watermark';

export const App: React.FC = () => {
  return (
    <main className="relative w-full h-screen bg-black overflow-hidden font-mono text-white selection:bg-[var(--color-neon-violet)]">
      {/* Dynamic CRT Scanline Background logic could go here */}
      <HUD />
      <GameCanvas />
      <Watermark />
    </main>
  );
};

export default App;
