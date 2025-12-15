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
  if (!isValidPosition(startPosition) || !isValidPosition(endPosition)) {
    return { success: false, error: new Error("Invalid position") };
  }

  return { success: true, value: { start: startPosition, end: endPosition } };
}

export function isValidCharacter(character: string): boolean {
  return typeof character === "string" && character.length === 1;
}

export function isValidMap(map: Map): boolean {
  return Array.isArray(map) && map.length > 0;
}

export function isValidPosition(position: Position): boolean {
  return (
    position !== null &&
    typeof position === "object" &&
    typeof position.row === "number" &&
    typeof position.column === "number" &&
    position.row >= 0 &&
    position.column >= 0
  );
}
