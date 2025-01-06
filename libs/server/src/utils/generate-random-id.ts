export const makeGetRandomIdByTimestamp = (
  alphabet: string,
  idSize: number
) => {
  const charSize = alphabet.length;
  return function getRandomIdByTimestamp(now: number, id = ""): string {
    if (id.length === idSize) return id;
    const char = alphabet[now % charSize];
    return getRandomIdByTimestamp(Math.floor(now / charSize), id + char);
  };
};

export const concatId = (alphabet: string) => {
  return (id: string, index: number) => {
    id += alphabet[index];
    return id;
  };
};

export function generateRandomId(alphabet: string, size: number) {
  const charSize = alphabet.length;
  const timestampLength = Math.round(size / 2);
  const getHalfOfTheId = makeGetRandomIdByTimestamp(alphabet, timestampLength);
  let lastRandChars: number[] = [];
  let lastGenerationTime = 0;

  return () => {
    const now = Date.now();
    const duplicated = now === lastGenerationTime;
    lastGenerationTime = now;

    const id = getHalfOfTheId(now);

    if (duplicated) {
      lastRandChars = lastRandChars.map((num) =>
        num === charSize - 1 ? 0 : num + 1
      );
      return lastRandChars.reduce(concatId(alphabet), id);
    }

    const randomChars = lastRandChars.length
      ? lastRandChars
      : Array.from({ length: size - timestampLength });
    lastRandChars = randomChars.map(() => Math.floor(Math.random() * charSize));

    return lastRandChars.reduce(concatId(alphabet), id);
  };
}
