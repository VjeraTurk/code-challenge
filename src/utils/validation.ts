import type { Position, Map, Result } from "../types";
import { MAP_CHARACTERS, ERROR_MESSAGES } from "../constants";
import { getCharacterIndices } from "./mapNavigation";

export function validateMapStartAndEnd(
  map: Map
): Result<{ start: Position; end: Position }> {
  const start = getCharacterIndices(map, MAP_CHARACTERS.START);
  const end = getCharacterIndices(map, MAP_CHARACTERS.END);

  if (start.length < 1 || end.length < 1) {
    return {
      success: false,
      error: new Error(ERROR_MESSAGES.START_OR_END_NOT_FOUND),
    };
  }
  if (start.length > 1 || end.length > 1) {
    return {
      success: false,
      error: new Error(ERROR_MESSAGES.MULTIPLE_START_OR_END),
    };
  }

  const startPosition = start[0];
  const endPosition = end[0];
  if (!startPosition || !endPosition) {
    return {
      success: false,
      error: new Error(ERROR_MESSAGES.START_OR_END_NOT_FOUND),
    };
  }

  return { success: true, value: { start: startPosition, end: endPosition } };
}
