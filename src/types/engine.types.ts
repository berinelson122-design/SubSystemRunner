export interface Vector2 {
  x: number;
  y: number;
}

export interface Box {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface PhysicalEntity extends Box {
  vx: number;
  vy: number;
  color: string;
}

export interface Player extends PhysicalEntity {
  isGrounded: boolean;
  wallSlideDir: number; // -1 for left wall, 1 for right wall, 0 for none
  dashCooldown: number;
  dashDuration: number;
  jumpsLeft: number;
}

export interface Enemy extends PhysicalEntity {
  id: string;
  patrolCenter: number;
  patrolRadius: number;
  hp: number;
}

export interface Camera {
  x: number;
  y: number;
}

export interface GameState {
  score: number;
  lives: number;
  isGameOver: boolean;
  levelWidth: number;
  levelHeight: number;
}
