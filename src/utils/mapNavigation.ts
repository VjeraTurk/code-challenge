import type { Position, Direction, Map } from "../types";
import { MAP_CHARACTERS } from "../constants";
import {
  isCapitalLetterCharacter,
  isEndCharacter,
} from "./characterValidation";

export function getCharacterIndices(map: Map, character: string): Position[] {
  if (!map || !map.length) return [];
  const indices: Position[] = [];

  for (let rowIndex = 0; rowIndex < map.length; rowIndex++) {
    const row = map[rowIndex];
    if (!row || !row.length) continue;
    for (let columnIndex = 0; columnIndex < row.length; columnIndex++) {
      if (row[columnIndex] === character) {
        indices.push({ row: rowIndex, column: columnIndex });
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
    direction: dir,
  }))
    .filter((pos) => {
      const char = map[pos.row]?.[pos.column];
      if (!char || !isValid(char)) {
        return false;
      }

      // Check if character matches direction requirements:
      // - Horizontal neighbors (left/right) must be: -, +, letters, or x
      // - Vertical neighbors (up/down) must be: |, +, letters, or x
      const isHorizontal = pos.direction.horizontal !== 0;
      const isVertical = pos.direction.vertical !== 0;

      // Special characters (+, letters, x) are valid in any direction
      if (
        char === MAP_CHARACTERS.INTERSECTION ||
        isCapitalLetterCharacter(char) ||
        isEndCharacter(char)
      ) {
        return true;
      }

      // For direction characters, check if they match the direction
      if (isHorizontal) {
        // Horizontal direction requires - (horizontal line)
        return char === MAP_CHARACTERS.HORIZONTAL;
      }
      // Vertical direction requires | (vertical line)
      // Since DIRECTIONS only has horizontal or vertical movements,
      // if not horizontal, it must be vertical
      return isVertical && char === MAP_CHARACTERS.VERTICAL;
    })
    .map(({ row, column }) => ({ row, column }));
}

export function isIndexVisited(
  characterPath: Position[],
  row: number,
  column: number
): boolean {
  return characterPath.some((p) => p.row === row && p.column === column);
}
