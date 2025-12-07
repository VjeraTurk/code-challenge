import type { Position, Map } from "./types.js";
import { MAP_CHARACTERS, ERROR_MESSAGES } from "./constants.js";
import { isCapitalLetterCharacter } from "./utils/characterValidation.js";
import { getCharacterIndices, isIndexVisited } from "./utils/mapNavigation.js";
import { getNextStepIndices } from "./utils/pathfinding.js";

export async function main(
  map: Map
): Promise<{ characterPath: string[]; letters: string[] }> {
  let characterPath: string[] = [];
  let letters: string[] = [];

  let visitedIndices: Position[] = [];

  let error: Error | null = null;

  const start: Position[] = getCharacterIndices(map, MAP_CHARACTERS.START);
  const end: Position[] = getCharacterIndices(map, MAP_CHARACTERS.END);

  if (start.length < 1 || end.length < 1) {
    error = new Error(ERROR_MESSAGES.START_OR_END_NOT_FOUND);
  } else if (start.length > 1 || end.length > 1) {
    error = new Error(ERROR_MESSAGES.MULTIPLE_START_OR_END);
  }

  const startIndex: Position | undefined = start[0];
  const endIndex: Position | undefined = end[0];

  let endNotReached = true;
  let previousPosition: Position | null = null;

  characterPath.push(map[startIndex?.row!]?.[startIndex?.column!]!);
  visitedIndices.push({
    row: startIndex?.row!,
    column: startIndex?.column!,
  });

  let i = startIndex?.row!;
  let j = startIndex?.column!;

  while (endNotReached) {
    const nextStep = getNextStepIndices(
      map,
      { row: i!, column: j! },
      previousPosition
    );
    if (!(nextStep instanceof Error)) {
      previousPosition = { row: i!, column: j! };
      i = nextStep.row;
      j = nextStep.column;

      characterPath.push(map[i]?.[j]!);
      const wasVisitedResult = isIndexVisited(visitedIndices, i!, j!);
      visitedIndices.push({ row: i!, column: j! });
      const char = map[i]?.[j];
      if (char && isCapitalLetterCharacter(char) && !wasVisitedResult) {
        letters.push(char);
      }

      if (i === endIndex?.row && j === endIndex?.column) {
        endNotReached = false;
      }
    } else if (error) {
      throw error;
    } else {
      throw nextStep; // TODO: error prioritization
    }
  }

  if (error) {
    throw error;
  }

  return { characterPath, letters };
}
