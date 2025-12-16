import { expect, describe, it, xit, jest } from "@jest/globals";
import { main } from "../main";
import type { Map } from "../types";
import {
  mapBasicExample,
  mapGoStraightThroughIntersections,
  mapLettersMayBeFoundOnTurns,
  mapDoNotCollectALetterFromTheSameLocationTwice,
  mapKeepDirectionEvenInACompactSpace,
  mapIgnoreStuffAfterEndOfPath,
  mapMissingStartCharacter,
  mapMissingEndCharacter,
  mapMultipleStartCharacters,
  mapMultipleStartCharacters2,
  mapMultipleStartCharacters3,
  mapForkInPath,
  mapBrokenPath,
  mapMultipleStartingPaths,
  mapFakeTurn,
  mapVerticalFakeTurn,
  mapInvalidCharacter,
  mapFirstStepIntersection,
  mapNoValidNeighborsStartingPosition,
} from "../tests/data/mock";

describe("Valid maps tests", () => {
  it("should match path: a basic example", () => {
    const result = main(mapBasicExample);
    expect(result.characterPath.join("")).toBe("@---A---+|C|+---+|+-B-x");
    expect(result.letters.join("")).toBe("ACB");
  });

  it("should match path: go straight through intersections", () => {
    const result = main(mapGoStraightThroughIntersections);
    expect(result.characterPath.join("")).toBe(
      "@|A+---B--+|+--C-+|-||+---D--+|x"
    );
    expect(result.letters.join("")).toBe("ABCD");
  });

  it("should match path: letters may be found on turns", () => {
    const result = main(mapLettersMayBeFoundOnTurns);
    expect(result.characterPath.join("")).toBe("@---A---+|||C---+|+-B-x");
    expect(result.letters.join("")).toBe("ACB");
  });

  it("should match path: do not collect a letter from the same location twice", () => {
    const result = main(mapDoNotCollectALetterFromTheSameLocationTwice);
    expect(result.characterPath.join("")).toBe(
      "@-G-O-+|+-+|O||+-O-N-+|I|+-+|+-I-+|ES|x"
    );
    expect(result.letters.join("")).toBe("GOONIES");
  });

  it("should match path: keep direction, even in a compact space", () => {
    const result = main(mapKeepDirectionEvenInACompactSpace);
    expect(result.characterPath.join("")).toBe("@B+++B|+-L-+A+++A-+Hx");
    expect(result.letters.join("")).toBe("BLAH");
  });
  it("should match path: ignore stuff after end of characterPath", () => {
    const result = main(mapIgnoreStuffAfterEndOfPath);
    expect(result.characterPath.join("")).toBe("@-A--+|+-B--x");
    expect(result.letters.join("")).toBe("AB");
  });
  it("should match path: first step intersection", () => {
    const result = main(mapFirstStepIntersection);
    expect(result.characterPath.join("")).toBe("@+||+-A||x");
    expect(result.letters.join("")).toBe("A");
  });
});

describe("Invalid maps tests", () => {
  it("should throw error: start or end not found", () => {
    expect(() => main(mapMissingStartCharacter)).toThrow(
      "Start or end not found"
    );
  });
  it("should throw error: missing end character", () => {
    expect(() => main(mapMissingEndCharacter)).toThrow(
      "Start or end not found"
    );
  });
  it("should throw error: multiple start characters", () => {
    expect(() => main(mapMultipleStartCharacters)).toThrow(
      "Multiple start or end characters found"
    );
  });
  it("should throw error: multiple start characters", () => {
    expect(() => main(mapMultipleStartCharacters2)).toThrow(
      "Multiple start or end characters found"
    );
  });
  it("should throw error: multiple end characters", () => {
    expect(() => main(mapMultipleStartCharacters3)).toThrow(
      "Multiple start or end characters found"
    );
  });
  it("should throw error: fork in path", () => {
    expect(() => main(mapForkInPath)).toThrow();
  });
  it("should throw error: broken path", () => {
    expect(() => main(mapBrokenPath)).toThrow("Broken path");
  });
  it("should throw error: multiple starting paths", () => {
    expect(() => main(mapMultipleStartingPaths)).toThrow();
  });
  it("should throw error: fake turn", () => {
    expect(() => main(mapFakeTurn)).toThrow("Fake turn");
  });
  it("should throw error: vertical fake turn", () => {
    expect(() => main(mapVerticalFakeTurn)).toThrow("Fake turn");
  });
});
describe("Invalid characters tests", () => {
  it("should throw error: invalid character", () => {
    expect(() => main(mapInvalidCharacter)).toThrow();
  });
  it("should throw error: no valid neighbors at starting position", () => {
    expect(() => main(mapNoValidNeighborsStartingPosition)).toThrow(
      "Broken path"
    );
  });
  it("should throw error: start position character not found", () => {
    // To trigger line 27, we need validation to pass but character access to fail
    // This can happen with a jagged array where the row exists but column doesn't
    // We'll mock validateMapStartAndEnd to return a position that's out of bounds
    const validateSpy = jest.spyOn(
      require("../utils/validation"),
      "validateMapStartAndEnd"
    );

    validateSpy.mockReturnValueOnce({
      success: true,
      value: {
        start: { row: 0, column: 10 }, // Out of bounds column
        end: { row: 0, column: 2 },
      },
    });

    const map: Map = [["@", "-", "x"]];
    expect(() => main(map)).toThrow(
      "Character not found at current position"
    );

    validateSpy.mockRestore();
  });

  it("should throw error: character not found at current position", () => {
    // To trigger line 46, we need to reach a position during traversal where character is undefined
    // We'll mock getNextStepPosition to return a position that's out of bounds
    const getNextStepSpy = jest.spyOn(
      require("../utils/pathFinding"),
      "getNextStepPosition"
    );

    getNextStepSpy
      .mockReturnValueOnce({
        success: true,
        value: { row: 0, column: 10 }, // Out of bounds
      })
      .mockReturnValueOnce({
        success: true,
        value: { row: 0, column: 2 },
      });

    const map: Map = [["@", "-", "x"]];
    expect(() => main(map)).toThrow(
      "Character not found at current position"
    );

    getNextStepSpy.mockRestore();
  });

  it("should throw error when traversePath returns error result", () => {
    // Mock traversePath to return an error result to cover line 19 in main.ts
    const traversePathSpy = jest.spyOn(
      require("../utils/pathTraversal"),
      "traversePath"
    );

    const mockError = new Error("Test error from traversePath");
    traversePathSpy.mockReturnValueOnce({
      success: false,
      error: mockError,
    });

    // Mock validation to pass
    const validateSpy = jest.spyOn(
      require("../utils/validation"),
      "validateMapStartAndEnd"
    );

    validateSpy.mockReturnValueOnce({
      success: true,
      value: {
        start: { row: 0, column: 0 },
        end: { row: 0, column: 2 },
      },
    });

    const map: Map = [["@", "-", "x"]];
    expect(() => main(map)).toThrow("Test error from traversePath");

    traversePathSpy.mockRestore();
    validateSpy.mockRestore();
  });
});
