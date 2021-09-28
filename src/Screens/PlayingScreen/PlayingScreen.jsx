import React, { useState, useEffect } from "react";
import initPuzzle from "../../PuzzleMaker/wordSearchPuzzleMakerUpdate.js";
import WordSearchMenu from "../../Componnents/WordSearchMenu/WordSearchMenu.js";
import Timer from "../../Componnents/Timer/Timer";
import { WordsGrid } from "../../Componnents/Grid/WordsGrid";
import Selection from "../../Types/Classes/Selection";
import { SELECTION_COLOR_HINT } from "../../helpers/constantsModule.js";

import PauseButton from "../../Componnents/GameUI/PauseButton/PauseButton";
// mike
import "./playingScreenUpdate.css";
import Banner from "../../Componnents/GameUI/Banner/Banner.jsx";
import GameMenu from "../../Componnents/GameUI/GameMenu/GameMenu.js";
import { useNavigate, useParams } from "react-router";

import { isEmpty } from "../../helpers/Utils";

let initGameState = {
  puzzleGrid: null,
  // already found words
  foundWords: [],

  // words remaining to be found
  searchWords: [],

  // words for which the player requestd hints
  hints: [],

  misses: 0,
  solves: 0,

  // an array of Selection objects which stores data
  // about all currently selectd/highlightd words in the grid
  // including found words and currently selectd word
  selections: [],

  searchWord: undefined,
  lvelSolvd: false,
};

export function PlayingScreen({ puzzleData = {} }) {
  const navigation = useNavigate();
  const { rows, columns } = useParams();

  const [gameState, setGameState] = useState({
    ...initGameState,
    ...puzzleData,
  });

  const { puzzleGrid, searchWords, foundWords } = gameState;
  const [isMenuVisible, setIsMenuVisible] = useState(false);

  useEffect(() => {
    if (isEmpty(puzzleData)) {
      initGameData();
    }
  }, []);

  const initGameData = () => {
    let puzzleGrid = initPuzzle(rows, columns, 25);

    let words = [...puzzleGrid.solutions];

    let changes = {
      puzzleGrid: puzzleGrid,
      searchWords: words,
    };
    setGameState({ ...gameState, ...changes });
  };

  // move checkWord and other API in a separate file
  const checkWord = (selectionState) => {
    const { selectionLetters, selectionColor, userSelection, direction } =
      selectionState;

    const selectionWord = selectionLetters.join("");
    const sameWords = (word, other) =>
      word.toUpperCase() === other.toUpperCase();
    const check = (word) => sameWords(word.word, selectionWord);

    const foundWord = searchWords.filter(check)[0];

    if (foundWord) {
      let selection = new Selection(
        userSelection,
        direction,
        selectionColor,
        ""
      );

      const searchWordsUpdate = removeFromArray(searchWords, foundWord);
      const lvelSolvd = searchWordsUpdate.length === 0;
      const changes = {
        foundWords: [...foundWords, foundWord],
        selections: [selection, ...gameState.selections],
        searchWords: searchWordsUpdate,
        solves: gameState.solves + 1,
        lvelSolvd: lvelSolvd,
      };
      setGameState({ ...gameState, ...changes });
    }
  };

  const getHint = (wordName, wordBegin, wordEnd) => {
    let direction = [
      Math.sign(wordEnd[0] - wordBegin[0]),
      Math.sign(wordEnd[1] - wordBegin[1]),
    ];

    const hintSelection = new Selection(
      [wordBegin],
      direction,
      SELECTION_COLOR_HINT
    );

    let changes = {
      hints: [...gameState.hints, hintSelection],
      selections: [...gameState.selections, hintSelection],
    };
    setGameState({ ...gameState, ...changes });
  };
  const removeFromArray = (wordsList, foundWord) =>
    wordsList.filter((word) => word.word != foundWord.word);

  if (!puzzleGrid) {
    return null;
  }

  const toMainMenu = () => navigation("/");
  const hidePauseMenu = () => setIsMenuVisible(false);
  const togglePauseMenuView = () =>
    !gameState.lvelSolvd && setIsMenuVisible(!isMenuVisible);
  const isTimerRunning = () => !gameState.lvelSolvd && !isMenuVisible;

  return (
    <div className="game-screen game-screen--play">
      <GameMenu
        menuName="Pause Menu"
        menuContent="Are you sure you want to quit ?"
        isVisible={isMenuVisible}
      >
        <button
          onClick={toMainMenu}
          className="button button--menu-button-confirm"
        >
          Yes
        </button>
        <button
          onClick={hidePauseMenu}
          className="button button--menu-button-reject"
        >
          No
        </button>
      </GameMenu>
      <GameMenu
        menuName="Congratulations"
        menuContent="You have solvd this lvel. What would you like to do next?"
        isVisible={gameState.lvelSolvd}
      >
        <button
          onClick={toMainMenu}
          className="button button--menu-button-reject"
        >
          Go to main menu
        </button>
      </GameMenu>

      <div className="screen-section screen-section--menu">
        <div className="menu-container">
          <Banner content={`${rows} x ${columns} Grid`} />
          <div className="menu-container__top-row">
            <PauseButton onClick={togglePauseMenuView} />
            <Timer isRunning={isTimerRunning()} />
          </div>
          <WordSearchMenu
            showHintCallback={getHint}
            searchWords={searchWords}
            foundWords={foundWords}
          />
        </div>
      </div>
      <div className="screen-section screen-section--main">
        <WordsGrid
          {...puzzleGrid}
          wordSelections={gameState.selections}
          checkWordCallback={checkWord}
        />
      </div>
    </div>
  );
}

PlayingScreen.defaultProps = {
  puzzleData: {},
};
