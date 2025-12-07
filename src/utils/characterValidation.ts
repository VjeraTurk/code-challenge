export function isDirectionCharacter(character: string): boolean {
  return character === "-" || character === "|" || character === "+";
}

export function isCapitalLetterCharacter(character: string): boolean {
  return character >= "A" && character <= "Z";
}

export function isEndCharacter(character: string): boolean {
  return character === "x";
}

export function isIntersectionCharacter(character: string): boolean {
  return character === "+";
}

export function isValidForwardCharacter(character: string): boolean {
  return (
    isDirectionCharacter(character) ||
    isCapitalLetterCharacter(character) ||
    isEndCharacter(character)
  );
}
