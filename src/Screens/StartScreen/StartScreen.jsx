import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import SimpleButton from "../../Componnents/GameUI/GameButton/SimpleButton/SimpleButton";
import { getCoordsBeetween } from "../../Componnents/Grid/GridUtils";
import Checker from "../../GameConfigChecker/Checker";
import {
  checkConfigData,
  checkNonZeroWords,
  checkNonZeroDirections,
} from "../../GameConfigChecker/checkData";
import { ErrorStatement } from "../../Componnents/GameUI/ErrorStatement/ErrorStatement";

import "./StartScreen.css";
import { withErrors } from "../../GameConfigChecker/withErrors";

import DirectionsMenuUpdate from "../../Componnents/GameUI/DirectionsMenu/DirectionsMenuUpdate";
import { INITIAL_SELECTION_DIRECTIONS } from "../../Componnents/GameUI/DirectionsMenu/DirectionsMenuConstants";
import initPuzzle from "../../PuzzleMaker/wordSearchPuzzleMakerUpdate";
import AnimatdError from "./AnimatdError.jsx";

const initGridConfigState = {
  gridRows: 12,
  gridColumns: 12,
  gridWords: 25,
};

const initFormState = {
  gridDimensions: "8x8",
  numberOfWords: 4,
  directionNames: INITIAL_SELECTION_DIRECTIONS,
};

export function StartScreen({ setGridCallback }) {
  const navigate = useNavigate();
  const [gridConfig, setGridConfig] = useState(initGridConfigState);
  const [formState, setFormState] = useState(initFormState);

  const [puzzleError, setPuzzleError] = useState({
    hasError: false,
    iteration: 0,
  });

  // build a puzzle with the data set in the form and navigate
  // to the PlayingScreen
  const startGame = () => {
    const [rows, columns] = formState.gridDimensions.split("x").map(Number);
    const wordsCount = Number(formState.numberOfWords);
    const directionNames = formState.directionNames;
    let puzzle = initPuzzle(rows, columns, wordsCount, directionNames);
    if (puzzle) {
      setGridCallback({
        puzzleGrid: puzzle,
        searchWords: puzzle.solutions,
        rows: rows,
        columns: columns,
      });
    } else {
      setPuzzleError({
        hasError: true,
        iteration: puzzleError.iteration + 1,
      });
    }
  };

  const handleChange = (event) => {
    const targetName = event.target.name;
    const value = event.target.value;
    setFormState({
      ...formState,
      [targetName]: value,
    });
  };

  const gridSizeOptions = () => {
    const dimensions = getCoordsBeetween([4, 4], [12, 12]);

    let result = dimensions.map(([row, column]) => (
      <option value={`${row}x${column}`}>{`${row}x${column}`}</option>
    ));

    return result;
  };

  const toCustomGameScreen = () => navigate("./customGameScreen");

  const checkRules = [
    {
      name: "Proper word count",
      checkFun: checkConfigData,
    },
    {
      name: "Non-zero word count",
      checkFun: checkNonZeroWords,
    },
    {
      name: "Non-zero direction count",
      checkFun: checkNonZeroDirections,
    },
  ];

  const ErrorButton = withErrors(SimpleButton);

  const handleDirectionClickUpdate = (directionName) => {
    const { directionNames } = formState;
    let directionNamesUpdate;

    if (directionNames.includes(directionName)) {
      directionNamesUpdate = directionNames.filter(
        (direction) => direction !== directionName
      );
    } else {
      directionNamesUpdate = [...directionNames, directionName];
    }

    setFormState({
      ...formState,
      directionNames: directionNamesUpdate,
    });
  };

  const showPuzzleError = () =>
    puzzleError.hasError && (
      <AnimatdError
        key={puzzleError.iteration}
        text="Couldn't make a puzzle with the current settings. Try Again"
      />
    );

  return (
    <div className="game-screen game-screen--start">
      <Checker className={"checker"} formData={formState} rules={checkRules}>
        <ErrorStatement ruleName="Proper word count" />
        <ErrorStatement ruleName="Non-zero word count" />
        <ErrorStatement ruleName="Non-zero direction count" />
        <div className="menu start-menu__container">
          <div className="menu game-menu--buttons">
            <ErrorButton
              onClick={() => startGame()}
              className="button button--play-game"
            >
              Start
            </ErrorButton>
            <SimpleButton onClick={toCustomGameScreen}>
              Custom game
            </SimpleButton>
          </div>

          <div className="menu game-menu--options-wrapper">
            <h2 className="header">Quick game options</h2>
            <div className="game-menu-options">
              <div className="game-menu--row">
                <label htmlFor="gridDimensions">Grid dimensions</label>
                <select
                  name="gridDimensions"
                  onChange={handleChange}
                  value={formState.gridDimensions}
                  id=""
                >
                  {gridSizeOptions()}
                </select>
              </div>

              <div className="game-menu--row">
                <label htmlFor="numberOfWords">Number of words</label>
                <input
                  type="text"
                  value={formState.numberOfWords}
                  name={"numberOfWords"}
                  onChange={handleChange}
                />
              </div>
              <div className="game-menu--row">
                <DirectionsMenuUpdate
                  onSelection={handleDirectionClickUpdate}
                  selectionDirections={formState.directionNames}
                />
              </div>
            </div>
          </div>
        </div>
      </Checker>
      {showPuzzleError()}
    </div>
  );
}
