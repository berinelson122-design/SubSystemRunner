import type { Player, Box } from '../types/engine.types';
import { TILE_SIZE } from './LevelGenerator';

const GRAVITY = 0.5;
const TERM_VEL_Y = 15;
const ACCEL_X = 1.3;
const FRICTION = 0.8;
const MAX_VEL_X = 6;
const JUMP_FORCE = -10;
const WALL_JUMP_X = 8;
const WALL_JUMP_Y = -9;
const WALL_SLIDE_SPEED = 3;
const DASH_SPEED = 20;

export class PhysicsEngine {
  private level: number[][];
  private cols: number;
  private rows: number;

  constructor(level: number[][]) {
    this.level = level;
    this.rows = level.length;
    this.cols = level[0]?.length || 0;
  }

  // Update logic sequence:
  // 1. Dash handling
  // 2. X Movement & Collision
  // 3. Y Movement & Collision
  public updatePlayer(player: Player, keys: { [key: string]: boolean }, justPressed: { [key: string]: boolean }) {
    
    // DASH STATE
    if (player.dashCooldown > 0) player.dashCooldown--;
    if (justPressed['ShiftLeft'] && player.dashCooldown <= 0 && player.dashDuration <= 0) {
      player.dashDuration = 10; // Frames of dash
      player.dashCooldown = 60; // Frames before next dash
    }

    const isDashing = player.dashDuration > 0;
    if (isDashing) {
      player.dashDuration--;
      player.vy = 0; // suspend gravity
      // Dash direction
      const dashDir = keys['ArrowLeft'] ? -1 : keys['ArrowRight'] ? 1 : player.vx < 0 ? -1 : 1;
      player.vx = dashDir * DASH_SPEED;
    } else {
      // NORMAL X MOVEMENT
      if (keys['ArrowLeft']) player.vx -= ACCEL_X;
      else if (keys['ArrowRight']) player.vx += ACCEL_X;
      else player.vx *= FRICTION;

      // Cap speed
      if (Math.abs(player.vx) > MAX_VEL_X) {
        player.vx = Math.sign(player.vx) * MAX_VEL_X;
      }
      
      // Stop completely if almost stopped
      if (Math.abs(player.vx) < 0.1) player.vx = 0;

      // GRAVITY
      if (player.wallSlideDir !== 0 && player.vy > 0) {
         player.vy = Math.min(player.vy + GRAVITY * 0.5, WALL_SLIDE_SPEED);
      } else {
         player.vy = Math.min(player.vy + GRAVITY, TERM_VEL_Y);
      }
    }

    // JUMP LOGIC
    if (justPressed['ArrowUp'] || justPressed['Space']) {
      if (player.isGrounded) {
        player.vy = JUMP_FORCE;
        player.isGrounded = false;
        player.jumpsLeft = 1; // Allow double jump
      } else if (player.wallSlideDir !== 0) {
        // Wall jump
        player.vy = WALL_JUMP_Y;
        player.vx = -player.wallSlideDir * WALL_JUMP_X;
        player.jumpsLeft = 1;
      } else if (player.jumpsLeft > 0) {
        // Double jump
        player.vy = JUMP_FORCE;
        player.jumpsLeft--;
      }
    }

    // APPLY X
    player.x += player.vx;
    this.resolveCollision(player, 'x');

    // APPLY Y
    player.y += player.vy;
    this.resolveCollision(player, 'y');
  }

  private resolveCollision(entity: Player, axis: 'x' | 'y') {
    const minCol = Math.floor(entity.x / TILE_SIZE);
    const maxCol = Math.floor((entity.x + entity.width - 0.1) / TILE_SIZE);
    const minRow = Math.floor(entity.y / TILE_SIZE);
    const maxRow = Math.floor((entity.y + entity.height - 0.1) / TILE_SIZE);

    if (axis === 'x') {
      entity.wallSlideDir = 0;
    } else {
      entity.isGrounded = false;
    }

    for (let c = minCol; c <= maxCol; c++) {
      for (let r = minRow; r <= maxRow; r++) {
        // Boundary checks
        if (c < 0 || c >= this.cols || r < 0 || r >= this.rows) continue;
        
        if (this.level[r][c] === 1) { // Solid tile
          
          if (axis === 'x') {
            if (entity.vx > 0) {
              entity.x = c * TILE_SIZE - entity.width;
              entity.wallSlideDir = 1;
            } else if (entity.vx < 0) {
              entity.x = c * TILE_SIZE + TILE_SIZE;
              entity.wallSlideDir = -1;
            }
            entity.vx = 0;
          } else if (axis === 'y') {
            if (entity.vy > 0) {
              entity.y = r * TILE_SIZE - entity.height;
              entity.isGrounded = true;
              entity.jumpsLeft = 1; // Reset double jump on ground
            } else if (entity.vy < 0) {
              entity.y = r * TILE_SIZE + TILE_SIZE;
            }
            entity.vy = 0;
          }
          // After snapping, re-evaluate boundaries depending on axis
          return;
        }
      }
    }
  }

  public checkAABB(b1: Box, b2: Box): boolean {
    return b1.x < b2.x + b2.width &&
           b1.x + b1.width > b2.x &&
           b1.y < b2.y + b2.height &&
           b1.y + b1.height > b2.y;
  }
}
