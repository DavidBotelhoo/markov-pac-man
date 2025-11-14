// lib/map.ts

// 1 = pared, 0 = camino (28 x 31 – mapa estilo Pac-Man)
export const map: number[][] = [
  [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
  [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
  [1,0,1,1,1,1,0,1,0,1,1,0,1,1,1,1,0,1,1,0,1,0,1,1,1,1,0,1],
  [1,0,1,1,1,1,0,1,0,1,1,0,1,1,1,1,0,1,1,0,1,0,1,1,1,1,0,1],
  [1,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,1],
  [1,1,1,0,1,1,0,0,0,1,1,0,1,1,0,1,1,1,1,0,1,1,1,1,1,1,0,1],
  [1,1,1,0,1,1,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
  [1,1,1,0,0,0,0,1,1,1,1,0,1,1,0,1,1,1,1,0,1,1,1,1,1,1,1,1],
  [1,1,1,1,0,1,0,1,1,0,0,0,0,0,0,0,0,1,1,0,1,1,1,1,1,1,1,1],
  [0,0,0,0,0,0,0,1,1,0,1,1,0,0,1,1,0,1,1,0,0,0,0,0,0,0,0,0],
  [1,1,1,1,1,1,0,1,1,0,1,0,0,0,0,1,0,1,1,0,1,1,1,1,1,1,1,1],
  [1,1,1,1,1,1,0,1,1,0,0,0,1,1,0,0,0,1,1,0,1,1,1,1,1,1,1,1],
  [1,1,1,1,1,1,0,1,1,0,1,0,1,1,0,1,0,1,1,0,1,1,1,1,1,1,1,1],
  [1,1,1,1,1,1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1,1,1,1,1,1,1,1],
  [1,1,1,1,1,1,0,1,1,0,1,1,0,0,1,1,0,1,1,0,1,1,1,1,1,1,1,1],
  [1,1,1,1,1,1,0,1,1,0,1,0,0,0,0,1,0,1,1,0,1,1,1,1,1,1,1,1],
  [0,0,0,0,0,0,0,1,1,0,0,0,1,1,0,0,0,1,1,0,0,0,0,0,0,0,0,0],
  [1,1,1,1,1,1,0,1,1,0,1,0,0,0,0,1,0,1,1,0,1,1,0,1,1,1,1,1],
  [1,1,1,1,1,1,0,1,1,0,1,1,1,1,1,1,0,1,1,0,1,1,0,1,1,1,1,1],
  [1,1,1,1,1,1,0,1,1,0,0,0,0,0,0,0,0,1,1,0,1,1,0,1,1,1,1,1],
  [1,1,1,1,1,1,0,1,1,1,1,0,1,1,0,1,1,1,1,0,1,1,0,1,1,1,1,1],
  [1,1,1,1,1,1,0,1,1,1,1,0,1,1,0,1,1,1,1,0,1,1,0,1,1,1,1,1],
  [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
  [1,0,1,1,1,1,0,1,1,1,1,1,0,1,1,1,1,1,0,1,1,1,1,1,0,1,0,1],
  [1,0,1,1,1,1,0,1,1,1,1,1,0,1,1,1,1,1,0,1,1,1,1,1,0,1,0,1],
  [1,0,0,0,1,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,1,1,0,0,0,0,0,1],
  [1,0,1,0,1,0,1,1,0,1,1,0,1,1,0,1,0,1,1,0,1,1,0,1,1,1,0,1],
  [1,0,1,0,1,0,1,1,0,1,1,0,1,1,0,1,0,1,1,0,1,1,0,1,1,1,0,1],
  [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
  [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
];

export const isWalkable = (row: number, col: number): boolean =>
  map[row] !== undefined && map[row][col] === 0;

export type Cell = { row: number; col: number };

export const directions: Cell[] = [
  { row: -1, col: 0 }, // arriba
  { row: 1, col: 0 },  // abajo
  { row: 0, col: -1 }, // izquierda
  { row: 0, col: 1 },  // derecha
];

// posiciones clásicas de power pellets (esquinas):
export const POWER_PELLET_POSITIONS: Cell[] = [
  { row: 1, col: 1 },
  { row: 1, col: 26 },
  { row: 26, col: 1 },
  { row: 26, col: 26 },
];

// pellets normales (todas las celdas transitables EXCEPTO los power pellets)
export const createInitialPellets = (): boolean[][] =>
  map.map((row, r) =>
    row.map((cell, c) => {
      if (cell !== 0) return false;
      const isPower = POWER_PELLET_POSITIONS.some(
        (p) => p.row === r && p.col === c
      );
      return !isPower;
    })
  );

// grilla de power pellets
export const createInitialPowerPellets = (): boolean[][] => {
  const grid = map.map((row) => row.map(() => false));
  for (const p of POWER_PELLET_POSITIONS) {
    if (isWalkable(p.row, p.col)) {
      grid[p.row][p.col] = true;
    }
  }
  return grid;
};

// todas las celdas transitables
export const walkableCells: Cell[] = (() => {
  const cells: Cell[] = [];
  for (let r = 0; r < map.length; r++) {
    for (let c = 0; c < map[0].length; c++) {
      if (isWalkable(r, c)) cells.push({ row: r, col: c });
    }
  }
  return cells;
})();

// posiciones iniciales
export const INITIAL_PLAYER: Cell = { row: 22, col: 13 }; // centro inferior
export const INITIAL_GHOST: Cell = { row: 13, col: 13 };  // dentro de la ghost house

const manhattan = (a: Cell, b: Cell): number =>
  Math.abs(a.row - b.row) + Math.abs(a.col - b.col);

// spawn de fantasma lejos del jugador
export const spawnGhostFarFromPlayer = (
  player: Cell,
  minDistance = 7
): Cell => {
  const candidates = walkableCells.filter(
    (c) => manhattan(c, player) >= minDistance
  );
  const pool = candidates.length > 0 ? candidates : walkableCells;
  return pool[Math.floor(Math.random() * pool.length)];
};
