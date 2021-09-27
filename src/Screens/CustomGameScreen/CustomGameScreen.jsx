import { useState } from "react";
import SimpleButton from "../../Componnents/GameUI/GameButton/SimpleButton/SimpleButton";
import InteractiveWordLabel from "../../Componnents/GameUI/InteractiveWordLabel/InteractiveWordLabel";
import { getCoordsBeetween } from "../../Componnents/Grid/GridUtils";
import initPuzzle from "../../PuzzleMaker/wordSearchPuzzleMakerUpdate";
import Checker from "../../GameConfigChecker/Checker";
import {
  checkConfigData,
  checkWordsLength,
  checkNonZeroDirections,
} from "../../GameConfigChecker/checkData";
import { ErrorStatement } from "../../Componnents/GameUI/ErrorStatement/ErrorStatement";
import { withErrors } from "../../GameConfigChecker/withErrors";
import DirectionsMenuUpdate from "../../Componnents/GameUI/DirectionsMenu/DirectionsMenuUpdate";
import { INITIAL_SELECTION_DIRECTIONS } from "../../Componnents/GameUI/DirectionsMenu/DirectionsMenuConstants";
import "./CustomGameScreen.css";

const initGameConfig = {
  words: [],
  numberOfWords: 4,
  gridDimensions: "8x8",
  wordName: "",
  displayWords: [],
  directionNames: INITIAL_SELECTION_DIRECTIONS,
};

export default function CustomGameScreen({ makePuzzle }) {
  const [word, setWord] = useState("");

  const [gameConfig, setGameConfig] = useState(initGameConfig);
  const { displayWords } = gameConfig;

  const handleChange = (event) => {
    const targetName = event.target.name;
    const value = event.target.value;
    setGameConfig({
      ...gameConfig,
      [targetName]: value,
    });
    setWord(event.target.value);
  };

  const addWordToList = () => {
    const word = gameConfig.wordName;
    setGameConfig({
      ...gameConfig,
      wordName: "",
      displayWords: [...gameConfig.displayWords, word],
    });
  };

  const removeWord = (wordName) => {
    const { displayWords } = gameConfig;
    const clearWords = displayWords.filter((word) => word != wordName);
    setGameConfig({ ...gameConfig, displayWords: clearWords });
  };

  const wordDisplayContents = displayWords.map((word, idx) => {
    return (
      <InteractiveWordLabel
        id={`${word}${idx}`}
        key={idx}
        onClick={() => removeWord(word)}
        wordName={word}
      />
    );
  });

  const makeCustomPuzzle = () => {
    const [rows, columns] = gameConfig.gridDimensions.split("x").map(Number);
    const { numberOfWords, directionNames, displayWords } = gameConfig;
    makePuzzle(rows, columns, +numberOfWords, directionNames, displayWords);
  };

  const dimensionOptions = () => {
    const dimensions = getCoordsBeetween([4, 4], [12, 12]);
    let result = dimensions.map(([row, column]) => (
      <option value={`${row}x${column}`}>{`${row}x${column}`}</option>
    ));

    return result;
  };

  const constructGame = () => {
    const [rows, columns] = gameConfig.gridDimensions.split("x").map(Number);
    const { numberOfWords, directionNames } = gameConfig;
    let puzzle = initPuzzle(
      rows,
      columns,
      +numberOfWords,
      directionNames,
      displayWords
    );
    setGameConfig({
      ...gameConfig,
      displayWords: puzzle.words,
    });
  };

  const checkRules = [
    {
      name: "Proper word count",
      checkFun: checkConfigData,
    },
    {
      name: "Word longer than grid size",
      checkFun: checkWordsLength,
    },
    {
      name: "Non-zero direction count",
      checkFun: checkNonZeroDirections,
    },
  ];

  const ErrorButton = withErrors(SimpleButton);

  const handleDirectionClickUpdate = (directionName) => {
    const { directionNames } = gameConfig;
    let directionNamesUpdate;

    if (directionNames.includes(directionName)) {
      directionNamesUpdate = directionNames.filter(
        (direction) => direction !== directionName
      );
    } else {
      directionNamesUpdate = [...directionNames, directionName];
    }

    setGameConfig({
      ...gameConfig,
      directionNames: directionNamesUpdate,
    });
  };

  return (
    <Checker formData={gameConfig} rules={checkRules}>
      <div className="game-screen game-screen--flex">
        <div className="container--custom-game-screen">
          <ErrorStatement ruleName="Proper word count" />
          <ErrorStatement ruleName="Word longer than grid size" />
          <ErrorStatement ruleName="Non-zero direction count" />

          <div className="words-display">{wordDisplayContents}</div>
          <div className="screen-row">
            <input
              value={gameConfig.wordName}
              name={"wordName"}
              onChange={handleChange}
              type="text"
              className="words-add-field"
            />
            <SimpleButton className={"add-word-button"} onClick={addWordToList}>
              Add word
            </SimpleButton>
          </div>
          <div className="settings-row">
            <label htmlFor="gridDimensions">Grid dimensions</label>
            <select
              name="gridDimensions"
              onChange={handleChange}
              value={gameConfig.gridDimensions}
            >
              {dimensionOptions()}
            </select>
          </div>
          <div className="settings-row">
            <label htmlFor="numberOfWords">Number of words</label>
            <input
              type="text"
              name="numberOfWords"
              value={gameConfig.numberOfWords}
              onChange={handleChange}
            />
          </div>
          <div className="game-buttons-wrapper">
            <ErrorButton onClick={makeCustomPuzzle}>Start game</ErrorButton>

            <ErrorButton onClick={constructGame}>Construct game</ErrorButton>
          </div>
          <DirectionsMenuUpdate
            onSelection={handleDirectionClickUpdate}
            selectionDirections={gameConfig.directionNames}
          />
        </div>
      </div>
    </Checker>
  );
}
