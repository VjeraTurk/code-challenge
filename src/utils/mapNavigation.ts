import type { Position, Direction, Map } from "../types";
import { ERROR_MESSAGES, MAP_CHARACTERS } from "../constants";
import {
  isCapitalLetterCharacter,
  isEndCharacter,
  isIntersectionCharacter,
} from "./characterValidation";
import { isValidString, isValidMap, isValidPosition } from "./validation";

export function getCharacterPositions(map: Map, character: string): Position[] {
  if (!isValidMap(map)) throw new Error(ERROR_MESSAGES.INVALID_MAP);
  if (!isValidString(character)) throw new Error(ERROR_MESSAGES.INVALID_CHARACTER);

  const positions: Position[] = [];

  for (let rowIndex = 0; rowIndex < map.length; rowIndex++) {
    const row = map[rowIndex];
    if (!row || !row.length) continue;
    for (let columnIndex = 0; columnIndex < row.length; columnIndex++) {
      if (row[columnIndex] === character) {
        positions.push({ row: rowIndex, column: columnIndex });
      }
    }
  }
  return positions;
}

export function getDirection(from: Position, to: Position): Direction {
  if (!isValidPosition(from) || !isValidPosition(to)) {
    throw new Error(ERROR_MESSAGES.INVALID_POSITION);
  }
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

export function isValidNeighborForDirection(
  char: string,
  direction: Direction
): boolean {
  // For direction > 1 character are no longer immediate neighbors
  const isHorizontal = (direction.horizontal == 1 || direction.horizontal == -1)  && direction.vertical === 0;
  const isVertical = (direction.vertical == 1 || direction.vertical == -1) && direction.horizontal === 0;

  if(!isHorizontal && !isVertical) {
    return false
  }
  // Special characters are valid in any direction
  if (
    isIntersectionCharacter(char)||
    isCapitalLetterCharacter(char) ||
    isEndCharacter(char)
  ) {
    return true;
  }

  if (isHorizontal) {
    return char === MAP_CHARACTERS.HORIZONTAL;
  }

  return isVertical && char === MAP_CHARACTERS.VERTICAL;
}

export function getNeighbors(
  map: Map,
  position: Position,
  isValid: (char: string) => boolean
): Position[] {
  if (!isValidPosition(position)) {
    return [];
  }
  return DIRECTIONS.map((dir) => ({
    row: position.row + dir.vertical,
    column: position.column + dir.horizontal,
    direction: dir,
  }))
    .filter((pos) => {
      const char = getCharacterAtPosition(map, pos);
      return (
        char &&
        isValid(char) &&
        isValidNeighborForDirection(char, pos.direction)
      );
    })
    .map(({ row, column }) => ({ row, column }));
}

export function isPositionVisited(
  characterPath: Position[],
  position : Position
): boolean {
  return characterPath.some((p) => p.row === position.row && p.column === position.column);
}

export function arePositionsEqual(pos1: Position, pos2: Position): boolean {
  return pos1.row === pos2.row && pos1.column === pos2.column;
}
export function getCharacterAtPosition(map: Map, position: Position): string | undefined {
  if (!isValidPosition(position)) {
    return undefined;
  }
  return map[position.row]?.[position.column];
}