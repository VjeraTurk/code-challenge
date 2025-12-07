import type { Position, Map } from "./types.js";
import { isCapitalLetterCharacter } from "./utils/characterValidation.js";
import { isIndexVisited } from "./utils/mapNavigation.js";
import { getNextStepIndices } from "./utils/pathfinding.js";
import { validateMapStartAndEnd } from "./utils/validation.js";

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

  const { start: startIndex, end: endIndex } = validation.value;

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
    if (nextStep.success) {
      previousPosition = { row: i!, column: j! };
      i = nextStep.value.row;
      j = nextStep.value.column;

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
    } else {
      throw nextStep.error;
    }
  }

  return { characterPath, letters };
}
