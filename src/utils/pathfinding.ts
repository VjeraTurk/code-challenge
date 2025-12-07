import type { Position, Direction, Map } from "../types.js";
import { ERROR_MESSAGES } from "../constants.js";
import {
  isCapitalLetterCharacter,
  isIntersectionCharacter,
  isValidForwardCharacter,
} from "./characterValidation.js";
import { getNeighbors, getDirection } from "./mapNavigation.js";

export function isMovingHorizontally(
  previousPosition: Position,
  nextPosition: Position
): boolean {
  return previousPosition.row === nextPosition.row;
}

export function isMovingVertically(
  previousPosition: Position,
  nextPosition: Position
): boolean {
  return previousPosition.column === nextPosition.column;
}

export function getFirstStepIndices(
  map: Map,
  currentPosition: Position
): Position | Error {
  const validNeighbors = getNeighbors(
    map,
    currentPosition,
    isValidForwardCharacter
  );

  if (validNeighbors.length === 0) {
    return new Error(ERROR_MESSAGES.BROKEN_PATH);
  }
  if (validNeighbors.length > 1) {
    return new Error(ERROR_MESSAGES.MULTIPLE_STARTING_PATHS);
  }
  return validNeighbors[0]!;
}

export function getIntersectionStep(
  map: Map,
  currentPosition: Position,
  previousPosition: Position
): Position | Error {
  const cameFromHorizontal: boolean = isMovingHorizontally(
    previousPosition,
    currentPosition
  );
  const allNeighbors: Position[] = getNeighbors(
    map,
    currentPosition,
    isValidForwardCharacter
  );

  // If we came from horizontal, only check vertical neighbors (up/down)
  // If we came from vertical, only check horizontal neighbors (left/right)
  const validTurns: Position[] = allNeighbors.filter((neighbor) => {
    if (cameFromHorizontal) {
      return isMovingVertically(currentPosition, neighbor);
    } else {
      return isMovingHorizontally(currentPosition, neighbor);
    }
  });

  if (validTurns.length === 0) {
    return new Error(ERROR_MESSAGES.FAKE_TURN);
  }
  if (validTurns.length > 1) {
    return new Error(ERROR_MESSAGES.FORK_IN_PATH);
  }

  return validTurns[0]!;
}

export function getStepForwardIndices(
  map: Map,
  currentPosition: Position,
  previousPosition: Position
): Position | undefined {
  const direction: Direction = getDirection(previousPosition, currentPosition);

  // Continue in the same direction
  const nextPosition: Position = {
    row: currentPosition.row + direction.vertical,
    column: currentPosition.column + direction.horizontal,
  };

  const char: string | undefined = map[nextPosition.row]?.[nextPosition.column];
  if (char && isValidForwardCharacter(char)) {
    return nextPosition;
  }

  // no valid direction found
  return undefined;
}

export function getNextStepIndices(
  map: Map,
  currentPosition: Position,
  previousPosition: Position | null
): Position | Error {
  if (!previousPosition) {
    return getFirstStepIndices(map, currentPosition);
  }
  const currentChar = map[currentPosition.row]?.[currentPosition.column];

  if (currentChar && !isIntersectionCharacter(currentChar)) {
    const forwardStepResult = getStepForwardIndices(
      map,
      currentPosition,
      previousPosition
    );
    if (forwardStepResult) return forwardStepResult;
    // else it's a letter as an intersection
  }

  if (
    (currentChar && isIntersectionCharacter(currentChar)) ||
    (currentChar && isCapitalLetterCharacter(currentChar))
  ) {
    return getIntersectionStep(map, currentPosition, previousPosition);
  }

  return new Error(ERROR_MESSAGES.BROKEN_PATH);
}
