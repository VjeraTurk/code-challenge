import { expect, describe, it, xit } from "@jest/globals";
import { main } from "../main.js";
import {
  map1,
  map2,
  map3,
  map4,
  map5,
  map6,
  map7,
  map8,
  map9,
  map10,
  map11,
  map12,
  map13,
  map14,
  map15,
  map16,
  map17,
} from "../tests/data/mock.js";

describe("Valid maps tests", () => {
  it("should match path: a basic example", async () => {
    const result = await main(map1);
    console.log(result.path.join(""));
    expect(result.path.join("")).toBe("@---A---+|C|+---+|+-B-x");
    expect(result.letters.join("")).toBe("ACB");
  });

  it("should match path: go straight through intersections", async () => {
    const result = await main(map2);
    expect(result.path.join("")).toBe("@|A+---B--+|+--C-+|-||+---D--+|x");
    expect(result.letters.join("")).toBe("ABCD");
  });

  it("should match path: letters may be found on turns", async () => {
    const result = await main(map3);
    expect(result.path.join("")).toBe("@---A---+|||C---+|+-B-x");
    expect(result.letters.join("")).toBe("ACB");
  });

  it("should match path: do not collect a letter from the same location twice", async () => {
    const result = await main(map4);
    expect(result.path.join("")).toBe(
      "@-G-O-+|+-+|O||+-O-N-+|I|+-+|+-I-+|ES|x"
    );
    expect(result.letters.join("")).toBe("GOONIES");
  });

  it("should match path: keep direction, even in a compact space", async () => {
    const result = await main(map5);
    expect(result.path.join("")).toBe("@B+++B|+-L-+A+++A-+Hx");
    expect(result.letters.join("")).toBe("BLAH");
  });
  it("should match path: ignore stuff after end of path", async () => {
    const result = await main(map6);
    expect(result.path.join("")).toBe("@-A--+|+-B--x");
    expect(result.letters.join("")).toBe("AB");
  });
});

describe("Invalid maps tests", () => {
  it("should throw error: start or end not found", async () => {
    await expect(main(map7)).rejects.toThrow("Start or end not found");
  });
  it("should throw error: missing end character", async () => {
    await expect(main(map8)).rejects.toThrow("Start or end not found");
  });
  it("should throw error: multiple start characters", async () => {
    await expect(main(map9)).rejects.toThrow(
      "Multiple start or end characters found"
    );
  });
  it("should throw error: multiple start characters", async () => {
    await expect(main(map10)).rejects.toThrow(
      "Multiple start or end characters found"
    );
  });
  it("should throw error: multiple end characters", async () => {
    await expect(main(map11)).rejects.toThrow(
      "Multiple start or end characters found"
    );
  });
  it("should throw error: fork in path", async () => {
    await expect(main(map12)).rejects.toThrow("Fork in path");
  });
  it("should throw error: broken path", async () => {
    await expect(main(map13)).rejects.toThrow("Broken path");
  });
  it("should throw error: multiple starting paths", async () => {
    await expect(main(map14)).rejects.toThrow("Multiple starting paths");
  });
  it("should throw error: fake turn", async () => {
    await expect(main(map15)).rejects.toThrow("Fake turn");
  });
  it("should throw error: vertical fake turn", async () => {
    await expect(main(map16)).rejects.toThrow("Fake turn");
  });
});
describe.only("Invalid characters tests", () => {
  it("should throw error: invalid character", async () => {
    await expect(main(map17)).rejects.toThrow();
  });
});
