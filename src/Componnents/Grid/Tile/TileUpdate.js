import React from "react";

const TileUpdate = ({ letter = "_", color }) => {
  return <div className={`tile tile-selection-${color}`}>{letter}</div>;
};

export default React.memo(TileUpdate);
