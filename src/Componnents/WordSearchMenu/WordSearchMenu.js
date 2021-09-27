import React, { useState } from "react";
import SearchMenuWord from "./SearchMenuWord";

const WordSearchMenu = ({
  searchWords,
  foundWords,
  showHintCallback = (f) => f,
}) => {
  const [hint, setHint] = useState("");

  const remainingWordsToFind = searchWords.map((word, idx) => (
    <SearchMenuWord
      isFound={false}
      key={idx * 100 + 1}
      {...word}
      hintCallback={showHintCallback}
    />
  ));
  const wordsAlreadyFound = foundWords.map((word, idx) => (
    <SearchMenuWord
      isFound={false}
      key={idx * 100 + 1}
      {...word}
      isFound={true}
    />
  ));
  return (
    <div className="word-search-menu">
      <div className="word-search-menu-words">
        {remainingWordsToFind}
        {wordsAlreadyFound}
      </div>

      <p className="hint">{hint}</p>
    </div>
  );
};

export default WordSearchMenu;
