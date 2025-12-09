import { ERROR_MESSAGES } from "./constants";
import type { Position, Map } from "./types";
import { isCapitalLetterCharacter } from "./utils/characterValidation";
import { isIndexVisited } from "./utils/mapNavigation";
import { getNextStepIndices } from "./utils/pathfinding";
import { validateMapStartAndEnd } from "./utils/validation";

export async function main(
  map: Map
): Promise<{ characterPath: string[]; letters: string[] }> {
  let characterPath: string[] = [];
  let letters: string[] = [];

  let visitedIndices: Position[] = [];

  const validation = validateMapStartAndEnd(map);
  if (!validation.success) {
    throw validation.error;
  }

  const { start: startPosition, end: endPosition } = validation.value;

  let currentPosition: Position = startPosition;
  let previousPosition: Position | null = null;

  const startChar = map[currentPosition.row]?.[currentPosition.column];
  if (!startChar) {
    throw new Error(ERROR_MESSAGES.START_POSITION_CHARACTER_NOT_FOUND);
  }
  characterPath.push(startChar);
  visitedIndices.push({
    row: currentPosition.row,
    column: currentPosition.column,
  });

  while (true) {
    const nextStep = getNextStepIndices(map, currentPosition, previousPosition);
    if (!nextStep.success) {
      throw nextStep.error;
    }

    previousPosition = currentPosition;
    currentPosition = nextStep.value;

    const currentChar = map[currentPosition.row]?.[currentPosition.column];
    if (!currentChar) {
      throw new Error(ERROR_MESSAGES.CHARACTER_NOT_FOUND_AT_CURRENT_POSITION);
    }
    characterPath.push(currentChar);
    const wasVisitedResult = isIndexVisited(
      visitedIndices,
      currentPosition.row,
      currentPosition.column
    );
    visitedIndices.push({
      row: currentPosition.row,
      column: currentPosition.column,
    });
    if (isCapitalLetterCharacter(currentChar) && !wasVisitedResult) {
      letters.push(currentChar);
    }

    if (
      currentPosition.row === endPosition.row &&
      currentPosition.column === endPosition.column
    ) {
      break;
    }
  }

  return { characterPath, letters };
}
