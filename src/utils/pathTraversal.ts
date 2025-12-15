import { ERROR_MESSAGES } from "../constants";
import { Position, Map, Result } from "../types";
import { isCapitalLetterCharacter } from "./characterValidation";
import { arePositionsEqual, getCharacterAtPosition, isIndexVisited } from "./mapNavigation";
import { getNextStepIndices } from "./pathFinding";
import { isValidPosition } from "./validation";

function processPosition(
  map: Map,
  position: Position,
  visitedIndices: Position[],
  characterPath: string[],
  letters: string[]
): void {
  const char = getCharacterAtPosition(map, position);
  if (!char) {
    throw new Error(ERROR_MESSAGES.CHARACTER_NOT_FOUND_AT_CURRENT_POSITION);
  }

  characterPath.push(char);
  const wasVisited = isIndexVisited(visitedIndices, position);
  visitedIndices.push(position);

  if (isCapitalLetterCharacter(char) && !wasVisited) {
    letters.push(char);
  }
}

export function traversePath(
    map: Map,
    startPosition: Position,
    endPosition: Position
  ): Result<{ characterPath: string[]; letters: string[] }> {

    if (!isValidPosition(startPosition) || !isValidPosition(endPosition)) {
     return { success: false, error: new Error("Invalid start or end position") };
    }

    let characterPath: string[] = [];
    let letters: string[] = [];

    let visitedPositions: Position[] = [];
    let currentPosition: Position = startPosition;
    let previousPosition: Position | null = null;

    processPosition(map, currentPosition, visitedPositions, characterPath, letters);


    while (true) {
      const nextStep = getNextStepIndices(map, currentPosition, previousPosition);
      if (!nextStep.success) {
        throw nextStep.error;
      }

      previousPosition = currentPosition;
      currentPosition = nextStep.value;

      processPosition(map, currentPosition, visitedPositions, characterPath, letters);

      if (arePositionsEqual(currentPosition, endPosition)) {
        break;
      }
    }

    return { success: true, value: { characterPath, letters } };
  }