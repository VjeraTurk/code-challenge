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
    character === "x"
  );
}

function isIntersectionCharacter(character: string): boolean {
  return character === "+";
}

function wasNotVisited(
  path: { character: string; row: number; column: number }[],
  row: number,
  column: number,
  character: string
): boolean {
  return !path.some(
    (p) => p.row === row && p.column === column && p.character === character
  );
}

function getCharacterIndices(
  map: string[][],
  character: string
): { row: number; column: number }[] {
  if (!map || !map.length) return [];
  const indices: { row: number; column: number }[] = [];

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

function firstStep(
  map: string[][],
  currentStep: { row: number; column: number }
): { row: number; column: number } | Error {
  const validDirections: { row: number; column: number }[] = [];

  const charDown = map[currentStep.row + 1]?.[currentStep.column];
  if (charDown && isValidForwardCharacter(charDown)) {
    validDirections.push({
      row: currentStep.row + 1,
      column: currentStep.column,
    });
  }
  const charUp = map[currentStep.row - 1]?.[currentStep.column];
  if (charUp && isValidForwardCharacter(charUp)) {
    validDirections.push({
      row: currentStep.row - 1,
      column: currentStep.column,
    });
  }
  const charRight = map[currentStep.row]?.[currentStep.column + 1];
  if (charRight && isValidForwardCharacter(charRight)) {
    validDirections.push({
      row: currentStep.row,
      column: currentStep.column + 1,
    });
  }
  const charLeft = map[currentStep.row]?.[currentStep.column - 1];
  if (charLeft && isValidForwardCharacter(charLeft)) {
    validDirections.push({
      row: currentStep.row,
      column: currentStep.column - 1,
    });
  }

  if (validDirections.length === 0) {
    return new Error("Broken path");
  }
  if (validDirections.length > 1) {
    return new Error("Multiple starting paths");
  }
  // At this point, validDirections.length === 1, so [0] is guaranteed to exist
  return validDirections[0]!;
}

function intersectionStep(
  map: string[][],
  currentStep: { row: number; column: number },
  prevStep: { row: number; column: number }
): { row: number; column: number } | Error {
  // intersection
  if (
    (prevStep?.row == currentStep.row &&
      prevStep.column + 1 == currentStep.column) ||
    (prevStep?.row == currentStep.row &&
      prevStep?.column - 1 == currentStep.column)
  ) {
    // direction was right or left
    const charDown = map[currentStep.row + 1]?.[currentStep.column];
    const charUp = map[currentStep.row - 1]?.[currentStep.column];
    if (
      charDown &&
      charUp &&
      isValidForwardCharacter(charDown) &&
      isValidForwardCharacter(charUp)
    ) {
      return new Error("Fork in path");
    } else if (charDown && isValidForwardCharacter(charDown)) {
      // turn down
      return { row: currentStep.row + 1, column: currentStep.column };
    } else if (charUp && isValidForwardCharacter(charUp)) {
      // turn up
      return { row: currentStep.row - 1, column: currentStep.column };
    }
    return new Error("Fake turn");
  } else if (
    // direction was up or down
    (prevStep?.row &&
      prevStep.row + 1 == currentStep.row &&
      prevStep?.column == currentStep.column) ||
      (prevStep?.row &&
        prevStep?.row - 1 == currentStep.row &&
        prevStep?.column == currentStep.column))
   {
    const charRight = map[currentStep.row]?.[currentStep.column + 1];
    const charLeft = map[currentStep.row]?.[currentStep.column - 1];
    if (
      charRight &&
      charLeft &&
      isValidForwardCharacter(charRight) &&
      isValidForwardCharacter(charLeft)
    ) {
      return new Error("Fork in path");
    } else if (charRight && isValidForwardCharacter(charRight)) {
      // turn right
      return { row: currentStep.row, column: currentStep.column + 1 };
    } else if (charLeft && isValidForwardCharacter(charLeft)) {
      // turn left
      return { row: currentStep.row, column: currentStep.column - 1 };
    }
    return new Error("Fake turn");
  }
  //Test this case
  return new Error("Fake turn");
}

function forwardStep(
  map: string[][],
  currentStep: { row: number; column: number },
  prevStep: { row: number; column: number }
): { row: number; column: number } | undefined {
  // forward step
  if (
    // down
    prevStep &&
    prevStep.row + 1 === currentStep.row &&
    prevStep.column === currentStep.column
  ) {
    const char = map[currentStep.row + 1]?.[currentStep.column];
    if (char && isValidForwardCharacter(char)) {
      // down
      return { row: currentStep.row + 1, column: currentStep.column };
    }
  }
  if (
    // up
    prevStep &&
    prevStep.row - 1 == currentStep.row &&
    prevStep.column == currentStep.column
  ) {
    const char = map[currentStep.row - 1]?.[currentStep.column];
    if (char && isValidForwardCharacter(char)) {
      // up
      return { row: currentStep.row - 1, column: currentStep.column };
    }
  }
  if (
    prevStep &&
    prevStep.row == currentStep.row &&
    prevStep.column + 1 == currentStep.column
  ) {
    const char = map[currentStep.row]?.[currentStep.column + 1];
    if (char && isValidForwardCharacter(char)) {
      // right
      return { row: currentStep.row, column: currentStep.column + 1 };
    }
  }
  if (
    prevStep &&
    prevStep.row == currentStep.row &&
    prevStep.column - 1 == currentStep.column
  ) {
    const char = map[currentStep.row]?.[currentStep.column - 1];
    if (char && isValidForwardCharacter(char)) {
      // left
      return { row: currentStep.row, column: currentStep.column - 1 };
    }
  }
  // no valid direction found
  return undefined;
}

function getNextStepIndices(
  map: string[][],
  currentStep: { row: number; column: number },
  prevStep: { row: number; column: number } | null
): { row: number; column: number } | Error {
  if (!prevStep) {
    return firstStep(map, currentStep);
  }
  const currentChar = map[currentStep.row]?.[currentStep.column];

  if (currentChar && !isIntersectionCharacter(currentChar)) {
    const forwardStepResult = forwardStep(map, currentStep, prevStep);
    if (forwardStepResult) return forwardStepResult;
    // else it's letter as an intersection
  }

  if (
    (currentChar && isIntersectionCharacter(currentChar)) ||
    (currentChar && isCapitalLetterCharacter(currentChar))
  ) {
    return intersectionStep(map, currentStep, prevStep);
  }

  // TODO: handle more errors here?
  return new Error("Broken path");
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function main(
  map: string[][]
): Promise<{ path: string[]; letters: string[] }> {
  const start = getCharacterIndices(map, "@");
  const end = getCharacterIndices(map, "x");

  // TODO: use single varable to store the result
  let path: string[] = [];
  let PATH: { character: string; row: number; column: number }[] = [];
  let letters: string[] = [];

  let error: Error | null = null;
  if (start.length < 1 || end.length < 1) {
    error = new Error("Start or end not found");
  } else if (start.length > 1 || end.length > 1) {
    error = new Error("Multiple start or end characters found");
  }

  const startIndex = start[0];
  const endIndex = end[0];

  let endNotReached = true;
  let prevStep: { row: number; column: number } | null = null;

  path.push(map[startIndex?.row!]?.[startIndex?.column!]!);
  PATH.push({
    character: map[startIndex?.row!]?.[startIndex?.column!]!,
    row: startIndex?.row!,
    column: startIndex?.column!,
  });

  for (let i = startIndex?.row; endNotReached; ) {
    for (let j = startIndex?.column; endNotReached; ) {

      const nextStep = getNextStepIndices(
        map,
        { row: i!, column: j! },
        prevStep
      );
      if (!(nextStep instanceof Error)) {
        prevStep = { row: i!, column: j! };
        i = nextStep.row;
        j = nextStep.column;

        path.push(map[i]?.[j]!);
        const wasAlreadyVisited = PATH.some(
          (p) =>
            p.row === i! && p.column === j! && p.character === map[i!]?.[j!]!
        );
        PATH.push({ character: map[i]?.[j]!, row: i!, column: j! });
        const char = map[i]?.[j];
        if (char && isCapitalLetterCharacter(char) && !wasAlreadyVisited) {
          letters.push(char);
        }

        if (i === endIndex?.row && j === endIndex?.column) {
          // end reached here
          endNotReached = false;
          if (error) throw error;

          return { path, letters };
        }
        // await delay(1000); // remove delay and async await
      } else if (error) {
        throw error;
      } else throw nextStep; // TODO: error prioritization
    }
  }
  return { path, letters };
}