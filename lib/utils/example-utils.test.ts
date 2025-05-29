import { describe, it, expect } from 'vitest';
import { add, concatenateStrings } from '@/lib/utils/example-utils'; // Using path alias

describe('example-utils', () => {
  describe('add', () => {
    it('should return the sum of two positive numbers', () => {
      expect(add(2, 3)).toBe(5);
    });

    it('should return the sum of a positive and a negative number', () => {
      expect(add(5, -2)).toBe(3);
    });

    it('should return the sum of two negative numbers', () => {
      expect(add(-2, -3)).toBe(-5);
    });

    it('should return zero when adding zero to a number', () => {
      expect(add(5, 0)).toBe(5);
    });
  });

  describe('concatenateStrings', () => {
    it('should concatenate two non-empty strings', () => {
      expect(concatenateStrings('hello', ' world')).toBe('hello world');
    });

    it('should return the first string if the second string is empty', () => {
      expect(concatenateStrings('hello', '')).toBe('hello');
    });

    it('should return the second string if the first string is empty', () => {
      expect(concatenateStrings('', 'world')).toBe('world');
    });

    it('should return an empty string if both strings are empty', () => {
      expect(concatenateStrings('', '')).toBe('');
    });
  });
});
