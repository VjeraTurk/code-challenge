// TODO: remove console.logs
export function isDirectionCharacter(character: string): boolean {
  return character === "-" || character === "|" || character === "+";
}

export function isCapitalLetterCharacter(
  character: string | undefined
): boolean {
  if (character === undefined) return false;
  return character >= "A" && character <= "Z";
}

export function isValidCharacter(character: string | undefined): boolean {
  if (character === undefined) return false;
  return (
    isDirectionCharacter(character) ||
    isCapitalLetterCharacter(character) ||
    character === "x"
  );
}
export function isIntersectionCharacter(
  character: string | undefined
): boolean {
  if (!character) return false;
  return character === "+";
}

export function wasNotVisited(
  path: { character: string; row: number; column: number }[],
  row: number,
  column: number,
  character: string
): boolean {
  return !path.some(
    (p) => p.row === row && p.column === column && p.character === character
  );
}

export function getCharacterIndices(
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
// TODO: split into multiple functions
export function getNextStepIndices(
  map: string[][],
  currentStep: { row: number; column: number },
  prevStep: { row: number; column: number } | null
): { row: number; column: number } | Error {
  if (!prevStep) {
    const validDirections: { row: number; column: number }[] = [];

    if (isValidCharacter(map[currentStep.row + 1]?.[currentStep.column])) {
      validDirections.push({
        row: currentStep.row + 1,
        column: currentStep.column,
      });
    }
    if (isValidCharacter(map[currentStep.row - 1]?.[currentStep.column])) {
      validDirections.push({
        row: currentStep.row - 1,
        column: currentStep.column,
      });
    }
    if (isValidCharacter(map[currentStep.row]?.[currentStep.column + 1])) {
      validDirections.push({
        row: currentStep.row,
        column: currentStep.column + 1,
      });
    }
    if (isValidCharacter(map[currentStep.row]?.[currentStep.column - 1])) {
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
  if (!isIntersectionCharacter(map[currentStep.row]?.[currentStep.column])) {
    if (
      // down
      prevStep &&
      prevStep.row + 1 === currentStep.row &&
      prevStep.column === currentStep.column
    ) {
      if (isValidCharacter(map[currentStep.row + 1]?.[currentStep.column])) {
        console.log(`down`);
        return { row: currentStep.row + 1, column: currentStep.column };
      }
    }
    if (
      // up
      prevStep &&
      prevStep.row - 1 == currentStep.row &&
      prevStep.column == currentStep.column
    ) {
      if (isValidCharacter(map[currentStep.row - 1]?.[currentStep.column])) {
        console.log(`up`);
        return { row: currentStep.row - 1, column: currentStep.column };
      }
    }
    if (
      // right
      prevStep &&
      prevStep.row == currentStep.row &&
      prevStep.column + 1 == currentStep.column
    ) {
      if (isValidCharacter(map[currentStep.row]?.[currentStep.column + 1])) {
        console.log(`right`);
        return { row: currentStep.row, column: currentStep.column + 1 };
      }
    }
    if (
      // left
      prevStep &&
      prevStep.row == currentStep.row &&
      prevStep.column - 1 == currentStep.column
    ) {
      if (isValidCharacter(map[currentStep.row]?.[currentStep.column - 1])) {
        console.log(`left`);
        return { row: currentStep.row, column: currentStep.column - 1 };
      }
    }
  }

  if (
    isIntersectionCharacter(map[currentStep.row]?.[currentStep.column]) ||
    isCapitalLetterCharacter(map[currentStep.row]?.[currentStep.column])
  ) {
    console.log(`intersection`);
    if (
      (prevStep?.row == currentStep.row &&
        prevStep.column + 1 == currentStep.column) ||
      (prevStep?.row == currentStep.row &&
        prevStep?.column - 1 == currentStep.column)
    ) {
      console.log(`direction was right or left`);
      if (
        isValidCharacter(map[currentStep.row + 1]?.[currentStep.column]) &&
        isValidCharacter(map[currentStep.row - 1]?.[currentStep.column])
      ) {
        return new Error("Fork in path");
      } else if (
        isValidCharacter(map[currentStep.row + 1]?.[currentStep.column])
      ) {
        console.log(`turn down`);
        return { row: currentStep.row + 1, column: currentStep.column };
      } else if (
        isValidCharacter(map[currentStep.row - 1]?.[currentStep.column])
      ) {
        console.log(`turn up`);
        return { row: currentStep.row - 1, column: currentStep.column };
      }
      return new Error("Fake turn");
    } else if (
      (console.log(`direction was up or down`),
      (prevStep?.row &&
        prevStep.row + 1 == currentStep.row &&
        prevStep?.column == currentStep.column) ||
        (prevStep?.row &&
          prevStep?.row - 1 == currentStep.row &&
          prevStep?.column == currentStep.column))
    ) {
      if (
        isValidCharacter(map[currentStep.row]?.[currentStep.column + 1]) &&
        isValidCharacter(map[currentStep.row]?.[currentStep.column - 1])
      ) {
        return new Error("Fork in path");
      } else if (
        isValidCharacter(map[currentStep.row]?.[currentStep.column + 1])
      ) {
        console.log(`turn right`);
        return { row: currentStep.row, column: currentStep.column + 1 };
      } else if (
        isValidCharacter(map[currentStep.row]?.[currentStep.column - 1])
      ) {
        console.log(`turn left`);
        return { row: currentStep.row, column: currentStep.column - 1 };
      }
      throw new Error("Fake turn");
    }
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
      if (i === endIndex?.row && j === endIndex?.column) {
        console.log(`end reached here 1`);
        endNotReached = false;
        path.push(map[i!]?.[j!]!);
        const wasAlreadyVisited = PATH.some(
          (p) =>
            p.row === i! && p.column === j! && p.character === map[i!]?.[j!]!
        );
        PATH.push({
          character: map[i!]?.[j!]!,
          row: i!,
          column: j!,
        });
        if (isCapitalLetterCharacter(map[i!]?.[j!]) && !wasAlreadyVisited) {
          letters.push(map[i!]?.[j!]!);
        }
        return { path, letters };
      }
      const nextStep = getNextStepIndices(
        map,
        { row: i!, column: j! },
        prevStep
      );
      if (!(nextStep instanceof Error)) {
        console.log(
          `nextStep: ${nextStep.row},${nextStep.column}`,
          map[nextStep.row]?.[nextStep.column]
        );
        prevStep = { row: i!, column: j! };
        i = nextStep.row;
        j = nextStep.column;
        if (i === endIndex?.row && j === endIndex?.column) {
          console.log(`end reached here 2`);
          endNotReached = false;
          path.push(map[endIndex?.row!]?.[endIndex?.column!]!);
          PATH.push({
            character: map[endIndex?.row!]?.[endIndex?.column!]!,
            row: endIndex?.row!,
            column: endIndex?.column!,
          });
          if (error) throw error;
          return { path, letters };
        }
        console.log(`${i},${j}: ${map[i]?.[j]}`);
        path.push(map[i]?.[j]!);
        const wasAlreadyVisited = PATH.some(
          (p) =>
            p.row === i! && p.column === j! && p.character === map[i!]?.[j!]!
        );
        PATH.push({ character: map[i]?.[j]!, row: i!, column: j! });
        if (isCapitalLetterCharacter(map[i]?.[j]) && !wasAlreadyVisited) {
          letters.push(map[i]?.[j]!);
        }
        // await delay(1000); // remove delay and async await
      } else if (error) {
        throw error;
      } else throw nextStep; // TODO: error prioritization
    }
  }
  return { path, letters };
}
