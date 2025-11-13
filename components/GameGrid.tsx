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

  return (
    <div className="inline-block max-w-full rounded-[28px] border-4 border-blue-500/80 bg-[#02021a] p-2 sm:p-3 shadow-[0_0_40px_rgba(59,130,246,0.9)]">
      <div className="rounded-3xl bg-[#020518] p-[2px] sm:p-1">
        {map.map((row, rIdx) => (
          <div key={rIdx} className="flex">
            {row.map((cell, cIdx) => {
              const isPlayer = player.row === rIdx && player.col === cIdx;
              const isGhost = ghosts.some(
                (g) => g.row === rIdx && g.col === cIdx
              );
              const hasPellet =
                pellets[rIdx] && pellets[rIdx][cIdx] && !isPlayer && !isGhost;
              const isPowerPellet =
                powerPellets[rIdx] &&
                powerPellets[rIdx][cIdx] &&
                !isPlayer &&
                !isGhost;

              const isWall = cell === 1;

              const baseCell =
                "w-3 h-3 sm:w-[14px] sm:h-[14px] md:w-4 md:h-4 flex items-center justify-center";
              const bgClass = isWall
                ? "bg-blue-500/80 shadow-[0_0_10px_rgba(59,130,246,0.9)]"
                : "bg-[#020518]";

              return (
                <div key={cIdx} className={`${baseCell} ${bgClass}`}>
                  {/* Pac-Man */}
                  {isPlayer && (
                    <div
                      className={`relative w-2.5 h-2.5 sm:w-3 sm:h-3 md:w-3.5 md:h-3.5 rounded-full bg-yellow-300 shadow-[0_0_10px_rgba(250,204,21,0.9)] flex items-center justify-center ${rotationClass}`}
                    >
                      <div className="absolute inset-0 pacman-mouth-wedge animate-pacman-mouth" />
                    </div>
                  )}

                  {/* Fantasma */}
                  {isGhost && !isPlayer && (
                    <div className="relative w-2.5 h-2.5 sm:w-3 sm:h-3 md:w-3.5 md:h-3.5">
                      <div
                        className={`w-full h-full rounded-t-full rounded-b-sm ${
                          frightened
                            ? "bg-sky-400 shadow-[0_0_10px_rgba(56,189,248,0.9)]"
                            : "bg-red-400 shadow-[0_0_10px_rgba(248,113,113,0.9)]"
                        }`}
                      />
                      <div className="absolute inset-0 flex items-center justify-center gap-[1px] sm:gap-[2px]">
                        <div className="w-[3px] h-[3px] sm:w-1 sm:h-1 bg-white rounded-full" />
                        <div className="w-[3px] h-[3px] sm:w-1 sm:h-1 bg-white rounded-full" />
                      </div>
                    </div>
                  )}

                  {/* Power pellet */}
                  {isPowerPellet && (
                    <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 md:w-2.5 md:h-2.5 rounded-full bg-yellow-100 shadow-[0_0_10px_rgba(250,249,210,0.95)]" />
                  )}

                  {/* Pellet normal */}
                  {hasPellet && !isPowerPellet && (
                    <div className="w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full bg-yellow-100 shadow-[0_0_6px_rgba(250,249,210,0.95)]" />
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
