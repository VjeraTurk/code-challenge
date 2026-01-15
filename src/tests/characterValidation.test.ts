import { describe, it, expect } from "@jest/globals";
import {
  isDirectionCharacter,
  isCapitalLetterCharacter,
  isEndCharacter,
  isIntersectionCharacter,
  isValidForwardCharacter,
} from "../utils/characterValidation";
import { MAP_CHARACTERS } from "../constants";

describe("characterValidation", () => {
  describe("isDirectionCharacter", () => {
    it("should return true for horizontal line character", () => {
      expect(isDirectionCharacter(MAP_CHARACTERS.HORIZONTAL)).toBe(true);
    });

    it("should return true for vertical line character", () => {
      expect(isDirectionCharacter(MAP_CHARACTERS.VERTICAL)).toBe(true);
    });

    it("should return true for intersection character", () => {
      expect(isDirectionCharacter(MAP_CHARACTERS.INTERSECTION)).toBe(true);
    });

    it("should return false for letter character", () => {
      expect(isDirectionCharacter("A")).toBe(false);
    });

    it("should return false for start character", () => {
      expect(isDirectionCharacter(MAP_CHARACTERS.START)).toBe(false);
    });

    it("should return false for end character", () => {
      expect(isDirectionCharacter(MAP_CHARACTERS.END)).toBe(false);
    });
  });

  describe("isCapitalLetterCharacter", () => {
    it("should return true for 'A'", () => {
      expect(isCapitalLetterCharacter("A")).toBe(true);
    });

    it("should return true for 'Z'", () => {
      expect(isCapitalLetterCharacter("Z")).toBe(true);
    });

    it("should return true for middle letter 'M'", () => {
      expect(isCapitalLetterCharacter("M")).toBe(true);
    });

    it("should return false for lowercase 'a'", () => {
      expect(isCapitalLetterCharacter("a")).toBe(false);
    });

    it("should return false for number", () => {
      expect(isCapitalLetterCharacter("1")).toBe(false);
    });

    it("should return false for special character", () => {
      expect(isCapitalLetterCharacter("!")).toBe(false);
    });
  });

  describe("isEndCharacter", () => {
    it("should return true for end character", () => {
      expect(isEndCharacter(MAP_CHARACTERS.END)).toBe(true);
    });

    it("should return false for start character", () => {
      expect(isEndCharacter(MAP_CHARACTERS.START)).toBe(false);
    });

    it("should return false for letter", () => {
      expect(isEndCharacter("A")).toBe(false);
    });
  });

  describe("isIntersectionCharacter", () => {
    it("should return true for intersection character", () => {
      expect(isIntersectionCharacter(MAP_CHARACTERS.INTERSECTION)).toBe(true);
    });

    it("should return false for horizontal line", () => {
      expect(isIntersectionCharacter(MAP_CHARACTERS.HORIZONTAL)).toBe(false);
    });

    it("should return false for letter", () => {
      expect(isIntersectionCharacter("A")).toBe(false);
    });
  });

  describe("isValidForwardCharacter", () => {
    it.each([
      [MAP_CHARACTERS.HORIZONTAL],
      [MAP_CHARACTERS.VERTICAL],
      [MAP_CHARACTERS.INTERSECTION],
    ])("should return true for direction character: %s", (char) => {
      expect(isValidForwardCharacter(char)).toBe(true);
    });

    it.each([
      ["A"],
      ["Z"],
    ])("should return true for capital letter: %s", (char) => {
      expect(isValidForwardCharacter(char)).toBe(true);
    });

    it("should return true for end character", () => {
      expect(isValidForwardCharacter(MAP_CHARACTERS.END)).toBe(true);
    });

    it("should return false for start character", () => {
      expect(isValidForwardCharacter(MAP_CHARACTERS.START)).toBe(false);
    });

    it.each([
      ["a"],
      ["1"],
      [" "],
    ])("should return false for invalid character: %s", (char) => {
      expect(isValidForwardCharacter(char)).toBe(false);
    });
  });
});
