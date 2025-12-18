import type { Position, Direction, Map, Result } from "../types";
import { ERROR_MESSAGES } from "../constants";
import {
  isCapitalLetterCharacter,
  isIntersectionCharacter,
  isValidForwardCharacter,
} from "./characterValidation";
import { getNeighbors, getDirection, getCharacterAtPosition } from "./mapNavigation";
import { isValidPosition } from "./validation";

// Export a module object to allow spying on internal function calls
// This pattern allows jest.spyOn to intercept calls between functions in the same module
export const pathFindingModuleInternal: {
  getFirstStepPosition: typeof getFirstStepPosition;
  getIntersectionStep: typeof getIntersectionStep;
  getStepForwardPosition: typeof getStepForwardPosition;
  getNextStepPosition: typeof getNextStepPosition;
} = {} as any;

export function isMovingHorizontally(
  previousPosition: Position,
  nextPosition: Position
): boolean {
  return (
    previousPosition.row === nextPosition.row &&
    previousPosition.column !== nextPosition.column
  );
}

export function isMovingVertically(
  previousPosition: Position,
  nextPosition: Position
): boolean {
  return (
    previousPosition.column === nextPosition.column &&
    previousPosition.row !== nextPosition.row
  );
}

export function getFirstStepPosition(
  map: Map,
  currentPosition: Position
): Result<Position> {
  if (!isValidPosition(currentPosition)) {
    return { success: false, error: new Error("Invalid position") };
  }
  const validNeighbors = getNeighbors(
    map,
    currentPosition,
    isValidForwardCharacter
  );

  if (validNeighbors.length === 0) {
    return { success: false, error: new Error(ERROR_MESSAGES.BROKEN_PATH) };
  }
  if (validNeighbors.length > 1) {
    return {
      success: false,
      error: new Error(ERROR_MESSAGES.MULTIPLE_STARTING_PATHS),
    };
  }
  const firstNeighbor = validNeighbors[0];
  if (!firstNeighbor) {
    return { success: false, error: new Error(ERROR_MESSAGES.BROKEN_PATH) };
  }
  return { success: true, value: firstNeighbor };
}

// Assign to module object for spying
pathFindingModuleInternal.getFirstStepPosition = getFirstStepPosition;

export function getIntersectionStep(
  map: Map,
  currentPosition: Position,
  previousPosition: Position
): Result<Position> {
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
    return { success: false, error: new Error(ERROR_MESSAGES.FAKE_TURN) };
  }
  if (validTurns.length > 1) {
    return { success: false, error: new Error(ERROR_MESSAGES.FORK_IN_PATH) };
  }

  const validTurn = validTurns[0];
  if (!validTurn) {
    return { success: false, error: new Error(ERROR_MESSAGES.FAKE_TURN) };
  }

  return { success: true, value: validTurn };
}

// Assign to module object for spying
pathFindingModuleInternal.getIntersectionStep = getIntersectionStep;

export function getStepForwardPosition(
  map: Map,
  currentPosition: Position,
  previousPosition: Position
): Position | undefined {
  const direction: Direction = getDirection(previousPosition, currentPosition);

  const nextPosition: Position = {
    row: currentPosition.row + direction.vertical,
    column: currentPosition.column + direction.horizontal,
  };

  const char: string | undefined = getCharacterAtPosition(map, nextPosition);
  if (char && isValidForwardCharacter(char)) {
    return nextPosition;
  }

  // no valid direction found
  return undefined;
}

// Assign to module object for spying
pathFindingModuleInternal.getStepForwardPosition = getStepForwardPosition;

export function getNextStepPosition(
  map: Map,
  currentPosition: Position,
  previousPosition: Position | null
): Result<Position> {
  if (!previousPosition) {
    return pathFindingModuleInternal.getFirstStepPosition(map, currentPosition);
  }
  const currentChar = getCharacterAtPosition(map, currentPosition);

  if (!currentChar) {
    return { success: false, error: new Error(ERROR_MESSAGES.CHARACTER_NOT_FOUND_AT_CURRENT_POSITION) };
  }

  if (!isIntersectionCharacter(currentChar)) {
    const forwardStepResult = pathFindingModuleInternal.getStepForwardPosition(
      map,
      currentPosition,
      previousPosition
    );
    if (forwardStepResult) {
      return { success: true, value: forwardStepResult };
    }
    // else it's a letter as an intersection
  }

  if (
    isIntersectionCharacter(currentChar) ||
    isCapitalLetterCharacter(currentChar)
  ) {
    return pathFindingModuleInternal.getIntersectionStep(
      map,
      currentPosition,
      previousPosition
    );
  }

  return { success: false, error: new Error(ERROR_MESSAGES.BROKEN_PATH) };
}

pathFindingModuleInternal.getNextStepPosition = getNextStepPosition;
