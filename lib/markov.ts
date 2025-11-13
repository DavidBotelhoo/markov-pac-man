// lib/markov.ts

import { Cell, directions, isWalkable, map } from "./map";

export type StateId = string;

export type Transition = {
  to: StateId;
  prob: number;
};

export type TransitionMatrix = {
  [from: StateId]: Transition[];
};

export const cellToStateId = (cell: Cell): StateId =>
  `${cell.row},${cell.col}`;

export const stateIdToCell = (id: StateId): Cell => {
  const [row, col] = id.split(",").map(Number);
  return { row, col };
};

export const buildTransitionMatrix = (): TransitionMatrix => {
  const matrix: TransitionMatrix = {};

  for (let row = 0; row < map.length; row++) {
    for (let col = 0; col < map[0].length; col++) {
      if (!isWalkable(row, col)) continue;

      const fromId = cellToStateId({ row, col });

      const neighbors: Cell[] = directions
        .map((d) => ({ row: row + d.row, col: col + d.col }))
        .filter((c) => isWalkable(c.row, c.col));

      const prob = neighbors.length > 0 ? 1 / neighbors.length : 0;

      matrix[fromId] = neighbors.map((n) => ({
        to: cellToStateId(n),
        prob,
      }));
    }
  }

  return matrix;
};

export const sampleNextState = (
  matrix: TransitionMatrix,
  current: StateId
): StateId => {
  const transitions = matrix[current];
  if (!transitions || transitions.length === 0) return current;

  const r = Math.random();
  let acc = 0;

  for (const t of transitions) {
    acc += t.prob;
    if (r <= acc) return t.to;
  }

  return transitions[transitions.length - 1].to;
};
