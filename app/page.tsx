"use client";

import { useCallback, useEffect, useState } from "react";
import { GameGrid, Direction } from "../components/GameGrid";
import {
  Cell,
  INITIAL_GHOST,
  INITIAL_PLAYER,
  createInitialPellets,
  createInitialPowerPellets,
  isWalkable,
  spawnGhostFarFromPlayer,
  map,
} from "../lib/map";
import {
  buildTransitionMatrix,
  cellToStateId,
  sampleNextState,
  stateIdToCell,
} from "../lib/markov";

const transitionMatrix = buildTransitionMatrix();
const MAX_GHOSTS = 10;
const POINTS_PER_GHOST = 5;
const POWER_PELLET_SCORE = 10;
const FRIGHTENED_DURATION_MS = 7000;

export default function HomePage() {
  const [player, setPlayer] = useState<Cell>(INITIAL_PLAYER);
  const [playerDir, setPlayerDir] = useState<Direction>("right");
  const [ghosts, setGhosts] = useState<Cell[]>([INITIAL_GHOST]);
  const [pellets, setPellets] = useState<boolean[][]>(
    createInitialPellets
  );
  const [powerPellets, setPowerPellets] = useState<boolean[][]>(
    createInitialPowerPellets
  );
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [frightened, setFrightened] = useState(false);

  const [gameStarted, setGameStarted] = useState(false);

  // función única para mover a Pac-Man (sirve tanto para el teclado como para los botones)
  const handleMove = useCallback(
  (dir: Direction) => {
    if (gameOver || !gameStarted) return;

    setPlayer((prev) => {
      const numCols = map[0].length;

      let delta: Cell;
      switch (dir) {
        case "up":
          delta = { row: -1, col: 0 };
          break;
        case "down":
          delta = { row: 1, col: 0 };
          break;
        case "left":
          delta = { row: 0, col: -1 };
          break;
        case "right":
        default:
          delta = { row: 0, col: 1 };
          break;
      }

      let nr = prev.row + delta.row;
      let nc = prev.col + delta.col;

      if (nc < 0) nc = numCols - 1;
      else if (nc >= numCols) nc = 0;

      if (!isWalkable(nr, nc)) return prev;

      const newCell: Cell = { row: nr, col: nc };
      setPlayerDir(dir);

      // power pellets
      setPowerPellets((prevPower) => {
        const copy = prevPower.map((row) => [...row]);
        if (copy[newCell.row][newCell.col]) {
          copy[newCell.row][newCell.col] = false;
          setFrightened(true);
          setScore((prevScore) => prevScore + POWER_PELLET_SCORE);
        }
        return copy;
      });

      // pellets normales + spawn
      setPellets((prevPellets) => {
        const copy = prevPellets.map((row) => [...row]);

        if (copy[newCell.row][newCell.col]) {
          copy[newCell.row][newCell.col] = false;

          setScore((prevScore) => {
            const updated = prevScore + 1;

            setGhosts((prevGhosts) => {
              if (prevGhosts.length >= MAX_GHOSTS) return prevGhosts;

              const shouldSpawn =
                updated >= prevGhosts.length * POINTS_PER_GHOST;

              if (!shouldSpawn) return prevGhosts;

              const newGhost = spawnGhostFarFromPlayer(newCell, 7);
              return [...prevGhosts, newGhost];
            });

            return updated;
          });
        }

        return copy;
      });

      return newCell;
    });
  },
  [gameOver, gameStarted]
);


  // desactiva frightened después de FRIGHTENED_DURATION_MS
  useEffect(() => {
    if (!frightened) return;
    const t = setTimeout(() => setFrightened(false), FRIGHTENED_DURATION_MS);
    return () => clearTimeout(t);
  }, [frightened]);

  // movimiento por teclado (desktop / notebook)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
        if (gameOver || !gameStarted ) return;

      if (e.key === "ArrowUp" || e.key === "w") return handleMove("up");
      if (e.key === "ArrowDown" || e.key === "s") return handleMove("down");
      if (e.key === "ArrowLeft" || e.key === "a") return handleMove("left");
      if (e.key === "ArrowRight" || e.key === "d") return handleMove("right");
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [gameOver, handleMove, gameStarted]);

  // movimiento de los fantasmas (Markov) – más lentos cuando están frightened
  useEffect(() => {
  if (gameOver || !gameStarted) return;

  const delay = frightened ? 400 : 220;

  const interval = setInterval(() => {
    setGhosts((prev) =>
      prev.map((g) => {
        const currentId = cellToStateId(g);
        const nextId = sampleNextState(transitionMatrix, currentId);
        return stateIdToCell(nextId);
      })
    );
  }, delay);

  return () => clearInterval(interval);
}, [gameOver, frightened, gameStarted]);


  // colisión
  useEffect(() => {
    if (gameOver || !gameStarted) return;

    const caught = ghosts.some(
      (g) => g.row === player.row && g.col === player.col
    );

    if (caught) setGameOver(true);
  }, [player, ghosts, gameOver, gameStarted]);

  const handleRestart = () => {
    setPlayer(INITIAL_PLAYER);
    setPlayerDir("right");
    setGhosts([INITIAL_GHOST]);
    setPellets(createInitialPellets());
    setPowerPellets(createInitialPowerPellets());
    setScore(0);
    setGameOver(false);
    setFrightened(false);
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#020015] via-[#02041f] to-black text-slate-50 flex flex-col items-center justify-center gap-4 px-2">
      <div className="text-center space-y-1 px-2">
        <h1 className="text-xl sm:text-2xl font-bold tracking-wide text-yellow-300 drop-shadow-[0_0_10px_rgba(250,204,21,0.8)]">
          Markov Maze – Pac-Man
        </h1>
        <p className="text-xs text-slate-300 max-w-lg mx-auto">
          Usá las flechas del teclado o WASD en la compu, o los botones de
          abajo en el celu, para mover a Pac-Man (amarillo). Los fantasmas
          (rojos o azules) se mueven como una cadena de Markov: desde cada
          celda eligen al azar un vecino transitable con probabilidades
          iguales. Agarrá pellets para sumar puntos y power pellets para
          asustar a los fantasmas.
        </p>
      </div>

      <div className="flex flex-col items-center gap-3 w-full px-2">
        <div className="flex flex-wrap justify-center gap-3 text-xs sm:gap-6 sm:text-sm">
          <p>
            Puntos:{" "}
            <span className="font-semibold text-yellow-300">
              {score}
            </span>
          </p>
          <p>
            Fantasmas:{" "}
            <span className="font-semibold text-red-400">
              {ghosts.length}
            </span>{" "}
            / {MAX_GHOSTS}
          </p>
          {frightened && (
            <p className="text-sky-300 text-xs font-semibold">
              ¡Modo frightened activo!
            </p>
          )}
        </div>

        {/* Contenedor relativo para el mapa y el popup */}
        <div className="relative">
          <GameGrid
            player={player}
            ghosts={ghosts}
            pellets={pellets}
            powerPellets={powerPellets}
            direction={playerDir}
            frightened={frightened}
          />

          {/* POP-UP INICIAL (antes de que empiece la partida) */}
          {!gameStarted && !gameOver && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/70 rounded-[28px]">
              <div className="px-6 py-4 rounded-2xl bg-slate-900/95 border border-blue-500/80 text-center space-y-3 shadow-[0_0_30px_rgba(59,130,246,0.9)]">
                <p className="text-xl font-extrabold text-yellow-300 tracking-wide drop-shadow-[0_0_10px_rgba(250,204,21,0.9)]">
                  MARKOV PAC-MAN
                </p>
                <p className="text-xs text-slate-300 max-w-[230px] mx-auto">
                  ¡Presioná Empezar para arrancar la partida!
                </p>
                <button
                  onClick={() => setGameStarted(true)}
                  className="mt-1 inline-flex items-center justify-center rounded-md bg-yellow-400 px-4 py-1.5 text-xs font-semibold text-slate-900 hover:bg-yellow-300 transition shadow-[0_0_10px_rgba(250,204,21,0.8)]"
                >
                  Empezar
                </button>
              </div>
            </div>
          )}

          {/* POP-UP DE GAME OVER */}
          {gameOver && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/70 rounded-[28px]">
              <div className="px-6 py-4 rounded-2xl bg-slate-900/95 border border-red-500/80 text-center space-y-3 shadow-[0_0_30px_rgba(248,113,113,0.9)]">
                <p className="text-xl font-extrabold text-red-400 tracking-wide">
                  GAME OVER
                </p>
                <p className="text-sm">
                  Tu puntaje:{" "}
                  <span className="font-semibold text-yellow-300">
                    {score}
                  </span>
                </p>
                <button
                  onClick={handleRestart}
                  className="mt-1 inline-flex items-center justify-center rounded-md bg-yellow-400 px-4 py-1.5 text-xs font-semibold text-slate-900 hover:bg-yellow-300 transition shadow-[0_0_10px_rgba(250,204,21,0.8)]"
                >
                  Jugar de nuevo
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Controles táctiles / mobile */}
        <div className="mt-3 flex flex-col items-center gap-2 w-full max-w-xs sm:max-w-sm">
          <div className="flex justify-center">
            <button
              disabled={gameOver || !gameStarted}
              onClick={() => handleMove("up")}
              className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-full bg-slate-800/90 border border-blue-400/60 flex items-center justify-center text-lg sm:text-xl text-slate-50 active:bg-blue-500/80 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              ▲
            </button>
          </div>
          <div className="flex gap-3 sm:gap-4">
            <button
              disabled={gameOver || !gameStarted}
              onClick={() => handleMove("left")}
              className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-full bg-slate-800/90 border border-blue-400/60 flex items-center justify-center text-lg sm:text-xl text-slate-50 active:bg-blue-500/80 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              ◀
            </button>
            <button
              disabled={gameOver || !gameStarted}
              onClick={() => handleMove("right")}
              className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-full bg-slate-800/90 border border-blue-400/60 flex items-center justify-center text-lg sm:text-xl text-slate-50 active:bg-blue-500/80 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              ▶
            </button>
          </div>
          <div className="flex justify-center">
            <button
              disabled={gameOver || !gameStarted}
              onClick={() => handleMove("down")}
              className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-full bg-slate-800/90 border border-blue-400/60 flex items-center justify-center text-lg sm:text-xl text-slate-50 active:bg-blue-500/80 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              ▼
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
