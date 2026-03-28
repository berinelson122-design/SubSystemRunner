export const TILE_SIZE = 40;

export function generateLevel(cols: number, rows: number): number[][] {
  const grid: number[][] = [];
  
  // Brutalist procedural cave generation (simple noise approximation)
  for (let y = 0; y < rows; y++) {
    const row: number[] = [];
    for (let x = 0; x < cols; x++) {
      // Boundaries
      if (y === 0 || y === rows - 1 || x === 0 || x === cols - 1) {
        row.push(1);
        continue;
      }
      
      // Starting safe zone
      if (x < 10 && y > rows - 6) {
        if (y === rows - 2) row.push(1);
        else row.push(0);
        continue;
      }

      // Generate random platforms and walls
      const isPlatform = Math.random() > 0.85;
      const isWall = Math.random() > 0.95;
      
      if (isPlatform && y > 3 && y < rows - 3) {
        row.push(1);
      } else if (isWall) {
        row.push(1);
      } else {
        row.push(0);
      }
    }
    grid.push(row);
  }

  // Ensure solid floor
  for (let x = 0; x < cols; x++) {
    grid[rows - 2][x] = 1;
    grid[rows - 1][x] = 1;
  }

  return grid;
}
