export function generateRandomId(alphabet: string, size: number) {
  const charSize = alphabet.length;
  const lastRandChars: number[] = new Array(size);
  let lastGenerationTime = 0;

  return () => {
    const halfOfSize = Math.round(size / 2);
    let now = Date.now();
    const duplicated = now === lastGenerationTime;
    lastGenerationTime = now;

    let id = '';
    let timeStampSize = halfOfSize;

    // generating half of the id via timestamp to reduce redundancy
    while (timeStampSize--) {
      id += alphabet[now % charSize];
      now = Math.floor(now / charSize);
    }

    // if the timestamp is same adding one to make it different
    if (duplicated) {
      let j = halfOfSize - 1;

      for (j; j >= 0 && lastRandChars[j] === charSize - 1; j--) {
        lastRandChars[j] = 0;
      }

      lastRandChars[j]++;
    } else {
      // else generating the rest of the id
      let rest = size - halfOfSize;

      while (rest--) {
        lastRandChars[rest] = Math.floor(Math.random() * charSize);
      }
    }

    return lastRandChars.reduce((result, index) => {
      result += alphabet[index];
      return result;
    }, id);
  };
}
