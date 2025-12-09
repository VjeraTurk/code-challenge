import { MAP_CHARACTERS } from "../constants";

export function isDirectionCharacter(character: string): boolean {
  return (
    character === MAP_CHARACTERS.HORIZONTAL ||
    character === MAP_CHARACTERS.VERTICAL ||
    character === MAP_CHARACTERS.INTERSECTION
  );
}

export function isCapitalLetterCharacter(character: string): boolean {
  return (
    character >= MAP_CHARACTERS.CAPITAL_LETTER_START &&
    character <= MAP_CHARACTERS.CAPITAL_LETTER_END
  );
}

export function isEndCharacter(character: string): boolean {
  return character === MAP_CHARACTERS.END;
}

export function isIntersectionCharacter(character: string): boolean {
  return character === MAP_CHARACTERS.INTERSECTION;
}

export function isValidForwardCharacter(character: string): boolean {
  return (
    isDirectionCharacter(character) ||
    isCapitalLetterCharacter(character) ||
    isEndCharacter(character)
  );
}
