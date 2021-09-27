import React, { useState, useEffect } from "react";
import initPuzzle from "./PuzzleMaker/wordSearchPuzzleMakerUpdate.js";
import { PlayingScreen } from "./Screens/PlayingScreen/PlayingScreen.jsx";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
} from "react-router-dom";
import { StartScreen } from "./Screens/StartScreen/StartScreen.jsx";
import "./AppStyleUpdate.css";
import CustomGameScreen from "./Screens/CustomGameScreen/CustomGameScreen";
import { isEmpty } from "./helpers/Utils";

function App() {
  const navigate = useNavigate();
  const [gridData, setGridData] = useState({});

  const makePuzzle = (
    rows,
    columns,
    wordsCount,
    searchDirectionsNames = [],
    givenWords = []
  ) => {
    let puzzleGrid = initPuzzle(
      rows,
      columns,
      wordsCount,
      searchDirectionsNames,
      givenWords
    );

    let words = [...puzzleGrid.solutions];

    setGridData({
      puzzleGrid: puzzleGrid,
      searchWords: words,
      rows: rows,
      columns: columns,
    });
  };

  useEffect(() => {
    if (isEmpty(gridData)) {
      return;
    }

    const { rows, columns } = gridData;

    navigate(`/playScreen/${rows}/${columns}`);
  }, [gridData]);

  const setGrid = (puzzleData) => setGridData(puzzleData);

  return (
    <Routes>
      <Route
        path="/playScreen/:rows/:columns"
        element={<PlayingScreen puzzleData={gridData} />}
      />
      <Route
        path="/customGameScreen"
        element={<CustomGameScreen puzzle={gridData} makePuzzle={makePuzzle} />}
      />
      <Route
        path="/"
        element={
          <StartScreen makePuzzle={makePuzzle} setGridCallback={setGrid} />
        }
      />
    </Routes>
  );
}

export default App;
