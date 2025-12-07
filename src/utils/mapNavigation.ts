import type { Position, Direction, Map } from "../types.js";
import { isValidForwardCharacter } from "./characterValidation.js";

export function getCharacterIndices(map: Map, character: string): Position[] {
  if (!map || !map.length) return [];
  const indices: Position[] = [];

  for (let i = 0; i < map.length; i++) {
    const row = map[i];
    if (!row || !row.length) continue;
    for (let j = 0; j < row.length; j++) {
      if (row[j] === character) {
        indices.push({ row: i, column: j });
      }
    }
  }
  return indices;
}

export function getDirection(from: Position, to: Position): Direction {
  const verticalDiff: number = to.row - from.row;
  const horizontalDiff: number = to.column - from.column;
  return { vertical: verticalDiff, horizontal: horizontalDiff };
}

const DIRECTIONS: Direction[] = [
  { vertical: -1, horizontal: 0 }, // up
  { vertical: 1, horizontal: 0 }, // down
  { vertical: 0, horizontal: -1 }, // left
  { vertical: 0, horizontal: 1 }, // right
];

export function getNeighbors(
  map: Map,
  position: Position,
  isValid: (char: string) => boolean
): Position[] {
  return DIRECTIONS.map((dir) => ({
    row: position.row + dir.vertical,
    column: position.column + dir.horizontal,
  })).filter((pos) => {
    const char = map[pos.row]?.[pos.column];
    return char && isValid(char);
  });
}

export function isIndexVisited(
  characterPath: Position[],
  row: number,
  column: number
): boolean {
  return characterPath.some((p) => p.row === row && p.column === column);
}
