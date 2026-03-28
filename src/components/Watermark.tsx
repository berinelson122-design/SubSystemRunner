import React from 'react';

export const Watermark: React.FC = () => {
  return (
    <div className="absolute bottom-4 right-6 text-white/30 text-xs tracking-[0.3em] font-mono select-none pointer-events-none z-50 mix-blend-screen">
      ARCHITECT // VOID_WEAVER
    </div>
  );
};
