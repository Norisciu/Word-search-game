import romanianWords from "../wordsData/romanianWordsUpdate.js";
import { DIRECTIONS } from "../helpers/constantsModule.js";
import { shuffleArr } from "../helpers/Utils.js";

const POSITION_FOUND = "foundPosition";
const POSITION_NOT_FOUND = "unfoundPosition";
let directions = [
  [0, 1],
  [0, -1],
  [1, 0],
  [-1, 0],
  [1, 1],
  [1, -1],
  [-1, 1],
  [-1, -1],
];

let convertDirectionNamesToCoords = (directionNames) => {
  const directionsMap = new Map([
    [DIRECTIONS.UP, [-1, 0]],
    [DIRECTIONS.DOWN, [1, 0]],
    [DIRECTIONS.LEFT, [0, -1]],
    [DIRECTIONS.RIGHT, [0, 1]],
    [DIRECTIONS.UP_LEFT, [-1, -1]],
    [DIRECTIONS.UP_RIGHT, [-1, 1]],
    [DIRECTIONS.DOWN_RIGHT, [1, 1]],
    [DIRECTIONS.DOWN_LEFT, [1, -1]],
  ]);

  return directionNames.map((name) => directionsMap.get(name));
};

let range = (low, high) => {
  if (low > high) {
    return range(high, low);
  }
  return Array.from({ length: high - low + 1 }, (_, idx) => low + idx);
};

function initPuzzle(
  gridRows = 8,
  gridColumns = 8,
  wordsCount = 8,
  directionNames = [],
  givenWords = []
) {
  directions =
    directionNames.length === 0
      ? directions
      : convertDirectionNamesToCoords(directionNames);
  let puzzle = makePuzzle(gridRows, gridColumns, wordsCount, givenWords);
  puzzle && puzzle.fillRemaining();
  return puzzle;
}

function makePuzzle(gridRows, gridColumns, wordsCount, givenWords = []) {
  let grid;
  let attemps = 0;
  let foundWords = 0;
  let remainingWordsCount = wordsCount - givenWords.length;
  let remainingWords = shuffleArr(
    getRandomWords().filter((word) => word.length < 8)
  ).slice(0, remainingWordsCount);
  let wordsToPlaceInGrid = [...givenWords, ...remainingWords];

  // make at most 100 atempts to place all words in a grid of the
  // given dimensions
  while (attemps++ < 100) {
    grid = new Grid(gridRows, gridColumns);
    // try to place all words inside the grid
    for (let k = 0; k < wordsToPlaceInGrid.length; k++) {
      let word = wordsToPlaceInGrid[k];
      let wordPosition = tryPlaceWord(word, grid);

      if (!wordPosition) {
        break;
      } else {
        foundWords++;
      }
    }

    const allWordsHaveBeenPlacd = foundWords === wordsCount;
    // if inside the for loop we found a way to fit all words
    // in the grid return the grid
    if (allWordsHaveBeenPlacd) {
      grid.words = wordsToPlaceInGrid;
      grid.attemps = attemps;
      return grid;
    }

    // else rest the count of foundWords and rerun the loop
    // if there are still atempts remaining
    else {
      foundWords = 0;
    }
  }

  // if after 100 atemps the algorithm still didn't managie to
  // found a working solution return null
  return null;
}

// tryPlaceWord(...) tries all possible directions and all possible
// starting grid positions in the grid. The actual check of
// a (position , direction) tuple defers to tryPosition( ... ).
function tryPlaceWord(word, grid) {
  let candidateDirections = shuffleArr(directions);
  for (let k = 0; k < candidateDirections.length; k++) {
    let direction = candidateDirections[k];
    let positions = shuffleArr(range(0, grid.cellsCount));

    for (let posIdx = 0; posIdx < positions.length; posIdx++) {
      let result = tryPosition(positions[posIdx], direction, word, grid);
      if (result != POSITION_NOT_FOUND) {
        return result;
      }
    }
  }
}

function tryPosition(positionIdx, direction, word, grid) {
  // check if the word can be placd inside the grid if it starts
  // at positionIdx and runs in the given direction using
  // checkPosition(...)
  let canPlaceWord = checkPosition(...arguments);

  // if the word can be placd mutate the grid using placeWord()
  if (canPlaceWord) {
    placeWord(positionIdx, direction, word, grid);
  }

  // return wether the word has been placd or not
  return canPlaceWord ? POSITION_FOUND : POSITION_NOT_FOUND;
}

function checkPosition(positionIdx, direction, word, grid) {
  let column = positionIdx % grid.columns;
  let row = Math.floor(positionIdx / grid.rows);

  // if the given position is not empty or it does not
  // include the word's starting letter return
  if (!["_", word[0]].includes(grid.at(row, column))) {
    return false;
  }

  for (
    let letterIdx = 1, rIdx = row, cIdx = column;
    letterIdx < word.length;
    letterIdx++
  ) {
    rIdx += direction[0];
    cIdx += direction[1];
    let letter = word[letterIdx];
    if (!["_", letter].includes(grid.at(rIdx, cIdx))) {
      return false;
    }
  }

  return true;
}

// place a word inside the given grid using the Grid class API to store
// each word letter at the corresponding row and column
function placeWord(positionIdx, direction, word, grid) {
  let column = positionIdx % grid.columns;
  let row = Math.floor(positionIdx / grid.rows);
  let [rIdx, cIdx] = [row, column];
  grid.setAt(row, column, word[0]);
  for (let letterIdx = 1; letterIdx < word.length; letterIdx++) {
    rIdx += direction[0];
    cIdx += direction[1];
    let letter = word[letterIdx];
    grid.setAt(rIdx, cIdx, letter);
  }

  grid.setSolution(word, row, column, rIdx, cIdx);
}

function getRandomWords() {
  let wordsWithoutSpaces = romanianWords.filter((word) => !word.includes(" "));
  return wordsWithoutSpaces;
}

class Grid {
  constructor(rows, columns) {
    this.rows = rows;
    this.columns = columns;
    this.emptyPlace = "_";
    this.contents = Array.from({ length: rows }, () =>
      Array.from({ length: columns }, (_) => "_")
    );
    this.cellsCount = this.rows * this.columns;
    this.solutions = [];
    this.letters = Array.from(
      { length: "z".charCodeAt() - "a".charCodeAt() + 1 },
      (_, idx) => String.fromCharCode("a".charCodeAt() + idx)
    );
    this.words = [];
  }

  displayGrid() {
    let display = this.contents.map((row) => row.join(" ")).join("\n");
    return display;
  }

  isEmptyAt(row, column) {
    return this.at(row, column) === this.emptyPlace;
  }

  at(row, column) {
    if (
      row < 0 ||
      row > this.rows - 1 ||
      column < 0 ||
      column > this.columns - 1
    ) {
      return "dummyReplacer";
    }
    return this.contents[row][column];
  }

  setAt(row, column, letter) {
    this.contents[row][column] = letter;
  }

  setSolution(word, rowBegin, columnBegin, rowEnd, columnEnd) {
    let solution = {
      word: word,
      wordBegin: [rowBegin, columnBegin],
      wordEnd: [rowEnd, columnEnd],
    };
    this.solutions.push(solution);
  }

  fillRemaining() {
    for (let row = 0; row < this.rows; row++) {
      for (let col = 0; col < this.columns; col++) {
        if (this.isEmptyAt(row, col)) {
          let randomLetter =
            this.letters[Math.floor(Math.random() * this.letters.length)];
          this.setAt(row, col, randomLetter);
        }
      }
    }
  }
}

export default initPuzzle;
