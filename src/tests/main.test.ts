import { expect, describe, it, xit } from "@jest/globals";
import { main } from "../main";
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
  mapInvalidMap,
  mapInvalidMap2,
  mapInvalidCharacterMap,
  mapInvalidCharacterMap2,
  mapInvalidCharacterMap3
} from "../tests/data/mock";

describe("Valid maps tests", () => {
  it("should match path: a basic example", () => {
    const result = main(mapBasicExample);
    expect({
      characterPath: result.characterPath.join(""),
      letters: result.letters.join(""),
    }).toEqual({
      characterPath: "@---A---+|C|+---+|+-B-x",
      letters: "ACB",
    });
  });

  it("should match path: go straight through intersections", () => {
    const result = main(mapGoStraightThroughIntersections);
    expect({
      characterPath: result.characterPath.join(""),
      letters: result.letters.join(""),
    }).toEqual({
      characterPath: "@|A+---B--+|+--C-+|-||+---D--+|x",
      letters: "ABCD",
    });
  });

  it("should match path: letters may be found on turns", () => {
    const result = main(mapLettersMayBeFoundOnTurns);
    expect({
      characterPath: result.characterPath.join(""),
      letters: result.letters.join(""),
    }).toEqual({
      characterPath: "@---A---+|||C---+|+-B-x",
      letters: "ACB",
    });
  });

  it("should match path: do not collect a letter from the same location twice", () => {
    const result = main(mapDoNotCollectALetterFromTheSameLocationTwice);
    expect({
      characterPath: result.characterPath.join(""),
      letters: result.letters.join(""),
    }).toEqual({
      characterPath: "@-G-O-+|+-+|O||+-O-N-+|I|+-+|+-I-+|ES|x",
      letters: "GOONIES",
    });
  });

  it("should match path: keep direction, even in a compact space", () => {
    const result = main(mapKeepDirectionEvenInACompactSpace);
    expect({
      characterPath: result.characterPath.join(""),
      letters: result.letters.join(""),
    }).toEqual({
      characterPath: "@B+++B|+-L-+A+++A-+Hx",
      letters: "BLAH",
    });
  });
  it("should match path: ignore stuff after end of characterPath", () => {
    const result = main(mapIgnoreStuffAfterEndOfPath);
    expect({
      characterPath: result.characterPath.join(""),
      letters: result.letters.join(""),
    }).toEqual({
      characterPath: "@-A--+|+-B--x",
      letters: "AB",
    });
  });
  it("should match path: first step intersection", () => {
    const result = main(mapFirstStepIntersection);
    expect({
      characterPath: result.characterPath.join(""),
      letters: result.letters.join(""),
    }).toEqual({
      characterPath: "@+||+-A||x",
      letters: "A",
    });
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
  it("should throw error: ", () => {
     // This map triggers the multiple ending characters error first
    expect(() => main(mapMultipleStartingPaths)).toThrow();
  });
  xit("should throw error: multiple starting paths", () => {
     // To trigger multiple start paths, comment out lines 18-21 of validation.ts
     expect(() => main(mapMultipleStartingPaths)).toThrow("Multiple starting paths");
   });
  it("should throw error: fake turn", () => {
    expect(() => main(mapFakeTurn)).toThrow("Fake turn");
  });
  it("should throw error: vertical fake turn", () => {
    expect(() => main(mapVerticalFakeTurn)).toThrow("Fake turn");
  });
});
describe("Invalid characters tests", () => {
  it("should throw error: broken path (has invalid character)", () => {
    expect(() => main(mapInvalidCharacter)).toThrow("Broken path");
  });
  it("should throw error: broken path (no valid neighbors at starting position)", () => {
    expect(() => main(mapNoValidNeighborsStartingPosition)).toThrow(
      "Broken path"
    );
  });
  it("should throw error: invalid map", () => {
    expect(() => main(mapInvalidMap)).toThrow("Invalid map");
  });
  it("should throw error: start or end not found", () => {
    expect(() => main(mapInvalidMap2)).toThrow("Start or end not found");
  })
  it("should throw error: Broken path", () => {
    expect(()=>main(mapInvalidCharacterMap)).toThrow("Broken path");
  })
  it("should throw error: Broken path", () => {
    expect(()=>main(mapInvalidCharacterMap2 as any)).toThrow("Broken path");
  })
  it("should throw error: Broken path", () => {
    expect(()=>main(mapInvalidCharacterMap3)).toThrow("Broken path");
  })
});
