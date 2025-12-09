import type { Position, Direction, Map, Result } from "../types";
import { ERROR_MESSAGES } from "../constants";
import {
  isCapitalLetterCharacter,
  isIntersectionCharacter,
  isValidForwardCharacter,
} from "./characterValidation";
import { getNeighbors, getDirection } from "./mapNavigation";

// Export a module object to allow spying on internal function calls
// This pattern allows jest.spyOn to intercept calls between functions in the same module
export const pathfindingModuleInternal: {
  getFirstStepIndices: typeof getFirstStepIndices;
  getIntersectionStep: typeof getIntersectionStep;
  getStepForwardIndices: typeof getStepForwardIndices;
  getNextStepIndices: typeof getNextStepIndices;
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

export function getFirstStepIndices(
  map: Map,
  currentPosition: Position
): Result<Position> {
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
pathfindingModuleInternal.getFirstStepIndices = getFirstStepIndices;

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
pathfindingModuleInternal.getIntersectionStep = getIntersectionStep;

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

// Assign to module object for spying
pathfindingModuleInternal.getStepForwardIndices = getStepForwardIndices;

export function getNextStepIndices(
  map: Map,
  currentPosition: Position,
  previousPosition: Position | null
): Result<Position> {
  if (!previousPosition) {
    return pathfindingModuleInternal.getFirstStepIndices(map, currentPosition);
  }
  const currentChar = map[currentPosition.row]?.[currentPosition.column];

  if (currentChar && !isIntersectionCharacter(currentChar)) {
    const forwardStepResult = pathfindingModuleInternal.getStepForwardIndices(
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
    (currentChar && isIntersectionCharacter(currentChar)) ||
    (currentChar && isCapitalLetterCharacter(currentChar))
  ) {
    return pathfindingModuleInternal.getIntersectionStep(
      map,
      currentPosition,
      previousPosition
    );
  }

  return { success: false, error: new Error(ERROR_MESSAGES.BROKEN_PATH) };
}

// Assign getNextStepIndices to the module object after it's defined
pathfindingModuleInternal.getNextStepIndices = getNextStepIndices;
