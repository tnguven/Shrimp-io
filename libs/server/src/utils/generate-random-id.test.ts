import { expect, test as it, describe, vi } from 'vitest';
import { generateRandomId, makeGetRandomIdByTimestamp, concatId } from './generate-random-id';

const alphabet = 'abcdefg1234567';

describe('generateRandomId', () => {
  it('should generate random 8 char random number', () => {
    vi.useRealTimers();
    const generateId = generateRandomId(alphabet, 8);
    let tries = 1500;
    let lastId = '';

    while (tries--) {
      const newId = generateId();
      expect(newId !== lastId).toBe(true);
      lastId = newId;
      expect(generateId().length).toBe(8);
    }
  });

  it('should generate while the time stamp is duplicated', () => {
    vi.useFakeTimers().setSystemTime(new Date('2022-02-01T00:00:00').getTime());
    const generateId = generateRandomId(alphabet, 8);
    let tries = 1500;
    let lastId = '';

    while (tries--) {
      const newId = generateId();
      expect(newId !== lastId).toBe(true);
      lastId = newId;
      expect(generateId().length).toBe(8);
    }
  });

  it.each`
    size
    ${1}
    ${2}
    ${3}
    ${4}
    ${5}
    ${6}
    ${7}
    ${8}
    ${9}
    ${10}
  `(`should generate random number with giving size $size`, ({ size }: { size: number }) => {
    vi.useRealTimers();
    const generateId = generateRandomId(alphabet, size);
    expect(generateId().length).toBe(size);
  });

  it.each`
    size
    ${1}
    ${2}
    ${3}
    ${4}
    ${5}
    ${6}
    ${7}
    ${8}
    ${9}
    ${10}
  `(`should makeGetRandomIdByTimestamp with giving size $size`, ({ size }: { size: number }) => {
    vi.useRealTimers();
    const getRandomIdByTimestamp = makeGetRandomIdByTimestamp(alphabet, size);
    expect(getRandomIdByTimestamp(Date.now(), '').length).toBe(size);
  });

  it('concatId should return string', () => {
    expect([0, 1, 2, 3].reduce(concatId(alphabet), '')).toBe('abcd');
  });
});
