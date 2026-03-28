import { create } from 'zustand';
import type { GameState } from '../types/engine.types';

interface StoreState extends GameState {
  setScore: (score: number) => void;
  setLives: (lives: number) => void;
  setGameOver: (isGameOver: boolean) => void;
  resetGame: () => void;
}

export const useGameStore = create<StoreState>((set) => ({
  score: 0,
  lives: 3,
  isGameOver: false,
  levelWidth: 800 * 3,
  levelHeight: 600,
  
  setScore: (score) => set({ score }),
  setLives: (lives) => set({ lives }),
  setGameOver: (isGameOver) => set({ isGameOver }),
  resetGame: () => set({ score: 0, lives: 3, isGameOver: false })
}));
