import type { Player, Enemy, Camera } from '../types/engine.types';
import { TILE_SIZE } from './LevelGenerator';

export class EngineRenderer {
  private ctx: CanvasRenderingContext2D;
  private width: number;
  private height: number;

  constructor(ctx: CanvasRenderingContext2D, width: number, height: number) {
    this.ctx = ctx;
    this.width = width;
    this.height = height;
  }

  public clear() {
    this.ctx.fillStyle = '#000000'; // Void Black
    this.ctx.fillRect(0, 0, this.width, this.height);
  }

  public drawLevel(level: number[][], camera: Camera) {
    this.ctx.fillStyle = '#1A1A1A'; // Dark gray for data-cave walls
    const startCol = Math.max(0, Math.floor(camera.x / TILE_SIZE));
    const endCol = Math.min(level[0].length, Math.floor((camera.x + this.width) / TILE_SIZE) + 1);
    const startRow = Math.max(0, Math.floor(camera.y / TILE_SIZE));
    const endRow = Math.min(level.length, Math.floor((camera.y + this.height) / TILE_SIZE) + 1);

    for (let r = startRow; r < endRow; r++) {
      for (let c = startCol; c < endCol; c++) {
        if (level[r][c] === 1) {
          this.ctx.fillRect(
            Math.floor(c * TILE_SIZE - camera.x),
            Math.floor(r * TILE_SIZE - camera.y),
            TILE_SIZE + 1, // +1 prevents subpixel gaps
            TILE_SIZE + 1
          );
        }
      }
    }
  }

  public drawPlayer(player: Player, camera: Camera) {
    const isDashing = player.dashDuration > 0;
    
    // Core Rectangle silhouette
    this.ctx.fillStyle = player.color; // "#E056FD" Neon Violet
    this.ctx.fillRect(
      Math.floor(player.x - camera.x),
      Math.floor(player.y - camera.y),
      player.width,
      player.height
    );

    // Afterimage/Trail effect if dashing
    if (isDashing) {
      this.ctx.globalAlpha = 0.5;
      this.ctx.fillStyle = '#FFFFFF';
      const offset = player.vx > 0 ? -15 : 15;
      this.ctx.fillRect(
        Math.floor(player.x - camera.x + offset),
        Math.floor(player.y - camera.y),
        player.width,
        player.height
      );
      this.ctx.globalAlpha = 1.0;
    }
  }

  public drawEnemies(enemies: Enemy[], camera: Camera) {
    this.ctx.fillStyle = '#FF003C'; // Cyber-Red
    for (const enemy of enemies) {
      // Render as spikes/diamonds (jagged silhouette)
      const cx = Math.floor(enemy.x + enemy.width / 2 - camera.x);
      const cy = Math.floor(enemy.y + enemy.height / 2 - camera.y);
      const hw = enemy.width / 2;
      const hh = enemy.height / 2;

      this.ctx.beginPath();
      this.ctx.moveTo(cx, cy - hh);
      this.ctx.lineTo(cx + hw, cy);
      this.ctx.lineTo(cx, cy + hh);
      this.ctx.lineTo(cx - hw, cy);
      this.ctx.closePath();
      this.ctx.fill();
    }
  }

  // Neon Grid Overlay for aesthetics
  public drawOverlay() {
    this.ctx.strokeStyle = 'rgba(224, 86, 253, 0.05)'; // faint violet
    this.ctx.lineWidth = 1;
    
    // Scanlines
    for(let y = 0; y < this.height; y += 4) {
      this.ctx.fillStyle = 'rgba(0, 0, 0, 0.15)';
      this.ctx.fillRect(0, y, this.width, 2);
    }
  }
}
