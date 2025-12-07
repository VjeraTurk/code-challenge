import type { Position, Map } from "../types.js";
import { MAP_CHARACTERS, ERROR_MESSAGES } from "../constants.js";
import { getCharacterIndices } from "./mapNavigation.js";

export function validateMapStartAndEnd(
  map: Map
): { start: Position; end: Position } | Error {
  const start = getCharacterIndices(map, MAP_CHARACTERS.START);
  const end = getCharacterIndices(map, MAP_CHARACTERS.END);

  if (start.length < 1 || end.length < 1) {
    return new Error(ERROR_MESSAGES.START_OR_END_NOT_FOUND);
  }
  if (start.length > 1 || end.length > 1) {
    return new Error(ERROR_MESSAGES.MULTIPLE_START_OR_END);
  }

  return { start: start[0]!, end: end[0]! };
}
