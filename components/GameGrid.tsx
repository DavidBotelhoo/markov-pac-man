// components/GameGrid.tsx

import { Cell, map } from "../lib/map";

export type Direction = "up" | "down" | "left" | "right";

type GameGridProps = {
  player: Cell;
  ghosts: Cell[];
  pellets: boolean[][];
  powerPellets: boolean[][];
  direction: Direction;
  frightened: boolean;
};

export function GameGrid({
  player,
  ghosts,
  pellets,
  powerPellets,
  direction,
  frightened,
}: GameGridProps) {
  const rotationClass =
    direction === "right"
      ? "rotate-0"
      : direction === "left"
      ? "rotate-180"
      : direction === "up"
      ? "-rotate-90"
      : "rotate-90"; // down

  const CELL_SIZE_REM = 0.75; // mantém o tamanho do sprite alinhado com cada célula

  // função que transforma (row,col) em um translate suave
  const cellTransform = (cell: Cell) => ({
    transform: `translate(${cell.col * CELL_SIZE_REM}rem, ${
      cell.row * CELL_SIZE_REM
    }rem)`,
  });

  return (
    <div className="inline-block rounded-[28px] border-4 border-blue-500/80 bg-[#02021a] p-3 shadow-[0_0_40px_rgba(59,130,246,0.9)]">
      {/* container do labirinto, relativo para podermos posicionar sprites por cima */}
      <div className="relative rounded-3xl bg-[#020518] p-1">
        {/* GRID DE PAREDES + PELLETS (fixo, sem fantasmas nem pacman) */}
        {map.map((row, rIdx) => (
          <div key={rIdx} className="flex">
            {row.map((cell, cIdx) => {
              const hasPellet =
                pellets[rIdx] && pellets[rIdx][cIdx];
              const isPowerPellet =
                powerPellets[rIdx] && powerPellets[rIdx][cIdx];

              const isWall = cell === 1;

              const baseCell =
                "w-3 h-3 flex items-center justify-center";
              const bgClass = isWall
                ? "bg-blue-500/80 shadow-[0_0_10px_rgba(59,130,246,0.9)]"
                : "bg-[#020518]";

              return (
                <div key={cIdx} className={`${baseCell} ${bgClass}`}>
                  {/* power pellet grande */}
                  {!isWall && isPowerPellet && (
                    <div className="w-2.5 h-2.5 rounded-full bg-yellow-100 shadow-[0_0_10px_rgba(250,249,210,0.95)]" />
                  )}

                  {/* pellet normal */}
                  {!isWall && hasPellet && !isPowerPellet && (
                    <div className="w-1.5 h-1.5 rounded-full bg-yellow-100 shadow-[0_0_6px_rgba(250,249,210,0.95)]" />
                  )}
                </div>
              );
            })}
          </div>
        ))}

        {/* OVERLAY DE SPRITES (Pac-Man + fantasmas) – aboslute + transition */}
        <div className="pointer-events-none absolute inset-1">
          {/* Pac-Man */}
          <div
            className="absolute transition-transform duration-200 linear"
            style={cellTransform(player)}
          >
            <div
              className={`relative w-3.5 h-3.5 rounded-full bg-yellow-300 shadow-[0_0_10px_rgba(250,204,21,0.9)] flex items-center justify-center ${rotationClass}`}
            >
              <div className="absolute inset-0 pacman-mouth-wedge animate-pacman-mouth" />
            </div>
          </div>

          {/* Fantasmas */}
          {ghosts.map((g, idx) => (
            <div
              key={idx}
              className="absolute w-3.5 h-3.5 transition-transform duration-200 linear"
              style={cellTransform(g)}
            >
              <div
                className={`w-full h-full rounded-t-full rounded-b-sm ${
                  frightened
                    ? "bg-sky-400 shadow-[0_0_10px_rgba(56,189,248,0.9)]"
                    : "bg-red-400 shadow-[0_0_10px_rgba(248,113,113,0.9)]"
                }`}
              />
              <div className="absolute inset-0 flex items-center justify-center gap-[2px]">
                <div className="w-1 h-1 bg-white rounded-full" />
                <div className="w-1 h-1 bg-white rounded-full" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
