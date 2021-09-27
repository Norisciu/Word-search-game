import React from "react";

const getClass = (isFound) => {
   return `word-to-find ${isFound ? "found-word" : ""}`;
}

function SearchMenuWord({
   word,
   wordBegin,
   wordEnd,
   hintCallback = f => f,
   isFound = false
}) {

   const onLabelClick = () => hintCallback(word, wordBegin, wordEnd)
   return (
      <p className={getClass(isFound)}  onClick={onLabelClick} >
         {word}
      </p>
   );
}


export default SearchMenuWord;