import { expect, describe, it, xit } from "@jest/globals";
import { main } from "../main.js";
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
} from "../tests/data/mock.js";

describe("Valid maps tests", () => {
  it("should match path: a basic example", async () => {
    const result = await main(mapBasicExample);
    expect(result.characterPath.join("")).toBe("@---A---+|C|+---+|+-B-x");
    expect(result.letters.join("")).toBe("ACB");
  });

  it("should match path: go straight through intersections", async () => {
    const result = await main(mapGoStraightThroughIntersections);
    expect(result.characterPath.join("")).toBe("@|A+---B--+|+--C-+|-||+---D--+|x");
    expect(result.letters.join("")).toBe("ABCD");
  });

  it("should match path: letters may be found on turns", async () => {
    const result = await main(mapLettersMayBeFoundOnTurns);
    expect(result.characterPath.join("")).toBe("@---A---+|||C---+|+-B-x");
    expect(result.letters.join("")).toBe("ACB");
  });

  it("should match path: do not collect a letter from the same location twice", async () => {
    const result = await main(mapDoNotCollectALetterFromTheSameLocationTwice);
    expect(result.characterPath.join("")).toBe(
      "@-G-O-+|+-+|O||+-O-N-+|I|+-+|+-I-+|ES|x"
    );
    expect(result.letters.join("")).toBe("GOONIES");
  });

  it("should match path: keep direction, even in a compact space", async () => {
    const result = await main(mapKeepDirectionEvenInACompactSpace);
    expect(result.characterPath.join("")).toBe("@B+++B|+-L-+A+++A-+Hx");
    expect(result.letters.join("")).toBe("BLAH");
  });
  it("should match path: ignore stuff after end of characterPath", async () => {
    const result = await main(mapIgnoreStuffAfterEndOfPath);
    expect(result.characterPath.join("")).toBe("@-A--+|+-B--x");
    expect(result.letters.join("")).toBe("AB");
  });
  it("should match path: first step intersection", async () => {
    const result = await main(mapFirstStepIntersection);
    expect(result.characterPath.join("")).toBe("@+||+-A||x");
    expect(result.letters.join("")).toBe("A");
  });
});

describe("Invalid maps tests", () => {
  it("should throw error: start or end not found", async () => {
    await expect(main(mapMissingStartCharacter)).rejects.toThrow("Start or end not found");
  });
  it("should throw error: missing end character", async () => {
    await expect(main(mapMissingEndCharacter)).rejects.toThrow("Start or end not found");
  });
  it("should throw error: multiple start characters", async () => {
    await expect(main(mapMultipleStartCharacters)).rejects.toThrow(
      "Multiple start or end characters found"
    );
  });
  it("should throw error: multiple start characters", async () => {
    await expect(main(mapMultipleStartCharacters2)).rejects.toThrow(
      "Multiple start or end characters found"
    );
  });
  it("should throw error: multiple end characters", async () => {
    await expect(main(mapMultipleStartCharacters3)).rejects.toThrow(
      "Multiple start or end characters found"
    );
  });
  it("should throw error: fork in path", async () => {
    await expect(main(mapForkInPath)).rejects.toThrow("Fork in path");
  });
  it("should throw error: broken path", async () => {
    await expect(main(mapBrokenPath)).rejects.toThrow("Broken path");
  });
  it("should throw error: multiple starting paths", async () => {
    await expect(main(mapMultipleStartingPaths)).rejects.toThrow("Multiple starting paths");
  });
  it("should throw error: fake turn", async () => {
    await expect(main(mapFakeTurn)).rejects.toThrow("Fake turn");
  });
  it("should throw error: vertical fake turn", async () => {
    await expect(main(mapVerticalFakeTurn)).rejects.toThrow("Fake turn");
  });
});
describe("Invalid characters tests", () => {
  it("should throw error: invalid character", async () => {
    await expect(main(mapInvalidCharacter)).rejects.toThrow();
  });
});
