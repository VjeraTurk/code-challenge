function isDirectionCharacter(character: string): boolean {
  return character === "-" || character === "|" || character === "+";
}

function isCapitalLetterCharacter(character: string): boolean {
  return character >= "A" && character <= "Z";
}

function isValidForwardCharacter(character: string): boolean {
  return (
    isDirectionCharacter(character) ||
    isCapitalLetterCharacter(character) ||
    isEndCharacter(character)
  );
}

function isEndCharacter(character: string): boolean {
  return character === "x";
}

function isIntersectionCharacter(character: string): boolean {
  return character === "+";
}

function isIndexVisited(
  characterPath: Position[],
  row: number,
  column: number
): boolean {
  return characterPath.some((p) => p.row === row && p.column === column);
}


type Position = { row: number; column: number };
type Direction = { vertical: number; horizontal: number };

function getCharacterIndices(
  map: string[][],
  character: string
): Position[] {
  if (!map || !map.length) return [];
  const indices: Position[] = [];

  for (let i = 0; i < map.length; i++) {
    const row = map[i];
    if (!row || !row.length) continue;
    for (let j = 0; j < row.length; j++) {
      if (row[j] === character) {
        indices.push({ row: i, column: j });
      }
    }
  }
  return indices;
}

function getDirection(from: Position, to: Position): Direction {
  const verticalDiff : number = to.row - from.row;
  const horizontalDiff : number = to.column - from.column;
  return { vertical: verticalDiff, horizontal: horizontalDiff };
}

const DIRECTIONS: Direction[] = [
  { vertical: -1, horizontal: 0 },  // up
  { vertical: 1, horizontal: 0 },   // down
  { vertical: 0, horizontal: -1 },   // left
  { vertical: 0, horizontal: 1 }     // right
];

function getNeighbors(
  map: string[][],
  position: Position,
  isValid: (char: string) => boolean
): Position[] {
  return DIRECTIONS
    .map(dir => ({ row: position.row + dir.vertical, column: position.column + dir.horizontal }))
    .filter(pos => {
      const char = map[pos.row]?.[pos.column];
      return char && isValid(char);
    });
}

function getFirstStepIndices(
  map: string[][],
  currentPosition: Position
): Position | Error {
  const validNeighbors =  getNeighbors(map, currentPosition, isValidForwardCharacter);

  if (validNeighbors.length === 0) {
    return new Error("Broken path");
  }
  if (validNeighbors.length > 1) {
    return new Error("Multiple starting paths");
  }
  return validNeighbors[0]!;
}

function isMovingHorizontally(previousPosition: Position, nextPosition: Position): boolean {
  return previousPosition.row === nextPosition.row;
}

function isMovingVertically(previousPosition: Position, nextPosition: Position): boolean {
  return previousPosition.column === nextPosition.column;
}

function getIntersectionStep(
  map: string[][],
  currentPosition: Position,
  previousPosition: Position
): Position | Error {

  const cameFromHorizontal : boolean = isMovingHorizontally(previousPosition, currentPosition);
  const allNeighbors : Position[] = getNeighbors(map, currentPosition, isValidForwardCharacter);

  // If we came from horizontal, only check vertical neighbors (up/down)
  // If we came from vertical, only check horizontal neighbors (left/right)
  const validTurns : Position[] = allNeighbors.filter(neighbor => {
    if (cameFromHorizontal) {
      return isMovingVertically(currentPosition, neighbor);
    } else {
      return isMovingHorizontally(currentPosition, neighbor);
    }
  });

  if (validTurns.length === 0) {
    return new Error("Fake turn");
  }
  if (validTurns.length > 1) {
    return new Error("Fork in path");
  }

  return validTurns[0]!;
}

function getStepForwardIndices(
  map: string[][],
  currentPosition: Position,
  previousPosition: Position
): Position | undefined {
  const direction : Direction = getDirection(previousPosition, currentPosition);

  // Continue in the same direction
  const nextPosition : Position = {
    row: currentPosition.row + direction.vertical,
    column: currentPosition.column + direction.horizontal
  };

  const char : string | undefined = map[nextPosition.row]?.[nextPosition.column];
  if (char && isValidForwardCharacter(char)) {
    return nextPosition;
  }

  // no valid direction found
  return undefined;
}


function getNextStepIndices(
  map: string[][],
  currentPosition: Position,
  previousPosition: Position | null
): Position | Error {
  if (!previousPosition) {
    return getFirstStepIndices(map, currentPosition);
  }
  const currentChar = map[currentPosition.row]?.[currentPosition.column];

  if (currentChar && !isIntersectionCharacter(currentChar)) {
    const forwardStepResult = getStepForwardIndices(map, currentPosition, previousPosition);
    if (forwardStepResult) return forwardStepResult;
    // else it's a letter as an intersection
  }

  if ((currentChar && isIntersectionCharacter(currentChar)) ||
    (currentChar && isCapitalLetterCharacter(currentChar))) {
    return getIntersectionStep(map, currentPosition, previousPosition);
  }

  return new Error("Broken path");
}


export async function main(
  map: string[][]
): Promise<{ characterPath: string[]; letters: string[] }> {

  let characterPath: string[] = [];
  let letters: string[] = [];

  let visitedIndices: Position[] = [];

  let error: Error | null = null;

  const start: Position[] = getCharacterIndices(map, "@");
  const end: Position[] = getCharacterIndices(map, "x");

  if (start.length < 1 || end.length < 1) {
    error = new Error("Start or end not found");
  } else if (start.length > 1 || end.length > 1) {
    error = new Error("Multiple start or end characters found");
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