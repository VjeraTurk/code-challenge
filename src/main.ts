import type { Map } from "./types";
import { traversePath } from "./utils/pathTraversal";
import { validateMapStartAndEnd } from "./utils/validation";

export function main(
  map: Map
): { characterPath: string[]; letters: string[] } {

  const validation = validateMapStartAndEnd(map);
  if (!validation.success) {
    throw validation.error;
  }

  const { start: startPosition, end: endPosition } = validation.value;

  const result = traversePath(map, startPosition, endPosition);
  if (!result.success) {
    throw result.error;
  }
  return result.value;
}
