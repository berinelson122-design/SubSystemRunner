import { InputHandler } from './InputHandler';
import { PhysicsEngine } from './Physics';
import { EngineRenderer } from './Renderer';
import { generateLevel, TILE_SIZE } from './LevelGenerator';
import type { Player, Enemy, Camera } from '../types/engine.types';
import { useGameStore } from '../store/useGameStore';

export class Engine {
  private ctx: CanvasRenderingContext2D;
  private width: number;
  private height: number;
  
  private input: InputHandler;
  private renderer: EngineRenderer;
  private physics: PhysicsEngine;
  
  private level: number[][];
  private player: Player;
  private enemies: Enemy[];
  private camera: Camera;
  
  private loopId: number = 0;
  private isRunning: boolean = false;

  constructor(canvas: HTMLCanvasElement) {
    this.width = canvas.width;
    this.height = canvas.height;
    this.ctx = canvas.getContext('2d', { alpha: false }) as CanvasRenderingContext2D;
    
    // High-performance context settings
    this.ctx.imageSmoothingEnabled = false;

    // Subsystems Initialization
    const cols = 200; // Large Data-Cave width
    const rows = Math.floor(this.height / TILE_SIZE);
    
    useGameStore.getState().setScore(0);
    this.level = generateLevel(cols, rows);
    this.input = new InputHandler();
    this.physics = new PhysicsEngine(this.level);
    this.renderer = new EngineRenderer(this.ctx, this.width, this.height);
    
    // Initial Entities state
    this.player = {
      x: 100,
      y: (rows - 5) * TILE_SIZE,
      width: 24,
      height: 32,
      vx: 0,
      vy: 0,
      color: '#E056FD', // Neon Violet
      isGrounded: false,
      wallSlideDir: 0,
      dashCooldown: 0,
      dashDuration: 0,
      jumpsLeft: 1
    };

    this.enemies = []; // Populate with basic enemies
    for (let i = 2; i < 15; i++) {
        const ex = i * 400;
        this.enemies.push({
            id: `en-${i}`,
            x: ex,
            y: (rows - 3) * TILE_SIZE - 24, // Floor level
            width: 24,
            height: 24,
            vx: -2,
            vy: 0,
            color: '#FF003C', // Cyber-Red
            patrolCenter: ex,
            patrolRadius: 100,
            hp: 1
        });
    }

    this.camera = { x: 0, y: 0 };
  }

  public start() {
    if (this.isRunning) return;
    this.isRunning = true;
    this.loopId = requestAnimationFrame(this.tick);
  }

  public stop() {
    this.isRunning = false;
    cancelAnimationFrame(this.loopId);
    this.input.cleanup();
  }

  private tick = () => {
    if (!this.isRunning) return;

    // 1. Logic Update
    this.update();

    // 2. Render State
    this.render();

    // 3. Queue next frame (60FPS managed by browser native requestAnimationFrame)
    this.loopId = requestAnimationFrame(this.tick);
  };

  private update() {
    const isGameOver = useGameStore.getState().isGameOver;
    if (isGameOver) return; // Halt loop logic, keep rendering last state

    // Process Movement & Collision for Player
    this.physics.updatePlayer(this.player, this.input.keys, this.input.justPressed);

    // Update enemies
    for (const enemy of this.enemies) {
        enemy.x += enemy.vx;
        // Basic patrol back and forth
        if (enemy.x > enemy.patrolCenter + enemy.patrolRadius) {
            enemy.vx = -Math.abs(enemy.vx);
        } else if (enemy.x < enemy.patrolCenter - enemy.patrolRadius) {
            enemy.vx = Math.abs(enemy.vx);
        }

        // Logic Dash combat logic
        if (this.physics.checkAABB(this.player, enemy)) {
            if (this.player.dashDuration > 0) {
               enemy.hp = 0; // Destroy
               useGameStore.getState().setScore(useGameStore.getState().score + 100);
            } else {
               // Player Takes hit - Game Over for Brutalist engine
               useGameStore.getState().setGameOver(true);
            }
        }
    }

    // Filter dead enemies
    this.enemies = this.enemies.filter(e => e.hp > 0);

    // Update Camera (smooth track player X, clamp to bounds)
    const targetCamX = this.player.x - this.width / 3; // Keep player 1/3 from left edge
    this.camera.x += (targetCamX - this.camera.x) * 0.1; // Lerp
    this.camera.x = Math.max(0, this.camera.x); // Clamp left
    
    // Death pit bounds check
    if (this.player.y > this.height) {
        useGameStore.getState().setGameOver(true);
    }
  }

  private render() {
    this.renderer.clear();
    this.renderer.drawLevel(this.level, this.camera);
    this.renderer.drawEnemies(this.enemies, this.camera);
    this.renderer.drawPlayer(this.player, this.camera);
    this.renderer.drawOverlay();
  }
}
