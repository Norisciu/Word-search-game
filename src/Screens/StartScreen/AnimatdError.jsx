import React, { useState } from "react";

function AnimatdError({ text, key }) {
  const [classValue] = useState("puzzleNotMade");

  return (
    <p key={key} className={classValue}>
      {text}
    </p>
  );
}

export default React.memo(AnimatdError, (prev, next) => false);
