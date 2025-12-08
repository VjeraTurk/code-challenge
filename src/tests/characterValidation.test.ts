import { describe, it, expect } from "@jest/globals";
import {
  isDirectionCharacter,
  isCapitalLetterCharacter,
  isEndCharacter,
  isIntersectionCharacter,
  isValidForwardCharacter,
} from "../utils/characterValidation.js";
import { MAP_CHARACTERS } from "../constants.js";

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
      expect(isCapitalLetterCharacter("@")).toBe(false);
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
    it("should return true for direction characters", () => {
      expect(isValidForwardCharacter(MAP_CHARACTERS.HORIZONTAL)).toBe(true);
      expect(isValidForwardCharacter(MAP_CHARACTERS.VERTICAL)).toBe(true);
      expect(isValidForwardCharacter(MAP_CHARACTERS.INTERSECTION)).toBe(true);
    });

    it("should return true for capital letters", () => {
      expect(isValidForwardCharacter("A")).toBe(true);
      expect(isValidForwardCharacter("Z")).toBe(true);
    });

    it("should return true for end character", () => {
      expect(isValidForwardCharacter(MAP_CHARACTERS.END)).toBe(true);
    });

    it("should return false for start character", () => {
      expect(isValidForwardCharacter(MAP_CHARACTERS.START)).toBe(false);
    });

    it("should return false for invalid characters", () => {
      expect(isValidForwardCharacter("a")).toBe(false);
      expect(isValidForwardCharacter("1")).toBe(false);
      expect(isValidForwardCharacter(" ")).toBe(false);
    });
  });
});
