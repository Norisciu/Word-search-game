export const checkConfigData = ({ gridDimensions, numberOfWords }) => {
  const wordsCountToDimensionsMap = new Map([
    ["4x4", 4],
    ["5x5", 8],
    ["6x6", 9],
    ["7x7", 12],
    ["8x8", 12],
    ["9x9", 15],
    ["10x10", 17],
    ["11x11", 25],
    ["12x12", 29],
  ]);

  const allowdNumberOfWords = wordsCountToDimensionsMap.get(gridDimensions);

  const checkResult = numberOfWords <= allowdNumberOfWords;
  const errorString = `At most ${allowdNumberOfWords} words can be use on a ${gridDimensions} grid.`;
  return { checkResult, errorString };
};

export const checkWordsLength = ({ displayWords, gridDimensions }) => {
  if (displayWords.length === 0) {
    return { checkResult: true, errorString: "" };
  }
  const longestWord = displayWords.sort((a, b) => a.length - b.length)[0];
  const highestGridDimension = Math.max(
    ...gridDimensions.split("x").map(Number)
  );

  const checkResult = longestWord.length < highestGridDimension;
  const errorString = `The word ${longestWord} is too long to fit in a ${gridDimensions} grid.`;

  return { checkResult, errorString };
};

export const checkNonZeroWords = ({ numberOfWords }) => {
  const checkResult = numberOfWords > 0;
  const errorString = `You should have at least 1 word to search in the grid (currently you have none)`;
  return { checkResult, errorString };
};

export const checkNonZeroDirections = ({ directionNames }) => {
  const checkResult = directionNames.length > 0;
  const errorString = `You should have at least 1 direction to search in. (check at least 1 arrow box)`;
  return { checkResult, errorString };
};
