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

  characterPath.push(map[currentPosition.row]?.[currentPosition.column]!);
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

    characterPath.push(map[currentPosition.row]?.[currentPosition.column]!);
    const wasVisitedResult = isIndexVisited(
      visitedIndices,
      currentPosition.row,
      currentPosition.column
    );
    visitedIndices.push({
      row: currentPosition.row,
      column: currentPosition.column,
    });
    const char = map[currentPosition.row]?.[currentPosition.column];
    if (char && isCapitalLetterCharacter(char) && !wasVisitedResult) {
      letters.push(char);
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
