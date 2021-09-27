export const getRowColFromPointer = ({ x, y }) => {
  let gridContainer = document.getElementsByClassName("words-grid")[0];
  let tile = document.getElementsByClassName("tile")[0];
  let gridPaddingPx = 19.5;
  let gridGapPx = 5;
  let tileWidth = tile.offsetWidth + gridGapPx;
  let tileHeight = tile.offsetHeight + gridGapPx;
  let gridX = gridContainer.offsetLeft + gridPaddingPx;
  let gridY = gridContainer.offsetTop + gridPaddingPx;

  let [dx, dy] = [x - gridX, y - gridY];
  let [row, column] = [Math.floor(dy / tileHeight), Math.floor(dx / tileWidth)];

  return [row, column];
};

export const getTileAtRowCol = ([row, col], grid) => {
  let lookupIdx = tileIdxFromRowCol([row, col], grid);

  return grid.letterWrappers.find(
    (letterWrapper) => letterWrapper.idx === lookupIdx
  );
};

export const equalGridCoords = ([row, col], [rowOther, colOther]) => {
  return row === rowOther && col === colOther;
};

const tileIdxFromRowCol = ([row, col], grid) => {
  row = clamp(0, row, grid.rows - 1);
  col = clamp(0, col, grid.columns - 1);

  let lookupIdx = row * grid.columns + col;
  return lookupIdx;
};

const clamp = (low, value, high) => {
  if (value <= low) {
    return low;
  }
  if (value >= high) {
    return high;
  }
  return value;
};

export const getDirectionFromVector = (x, y) => {
  let coords = [
    [0, 1],
    [1, 1],
    [1, 0],
    [1, -1],
    [0, -1],
    [-1, -1],
    [-1, 0],
    [-1, 1],
  ];
  let idx =
    (Math.floor(Math.round(Math.atan2(y, x) / ((2 * Math.PI) / 8))) + 8) % 8;
  return coords[idx];
};
export const onSameDirection = (startPoint, direction, endPoint) => {
  let [reachRow, reachColumn] = endPoint;
  let [row, column] = startPoint;

  let result;
  let onSameRow = row === reachRow;
  let onSameColumn = column === reachColumn;
  if (direction[0] === 0) {
    return onSameRow;
  } else if (direction[1] === 0) {
    return onSameColumn;
  } else {
    let result =
      row + direction[0] === reachRow && column + direction[1] === reachColumn;

    return result;
  }
};

export const onOpposingDirection = (startPoint, direction, endPoint) => {
  let [reachRow, reachColumn] = endPoint;
  let [row, column] = startPoint;
  return (
    row - direction[0] === reachRow && column - direction[1] === reachColumn
  );
};

export const getProjRowAndColumn = (
  row,
  column,
  startRow,
  startColumn,
  direction
) => {
  if (direction[0] === 0) {
    return [startRow, column];
  } else if (direction[1] === 0) {
    return [row, startColumn];
  } else {
    const projRow = row;
    const rowDifference = Math.abs(startRow - row);
    const projColumn = startColumn + direction[1] * rowDifference;
    return [projRow, projColumn];
  }
};

export const getCoordsBeetween = (start, end) => {
  const coords = [];
  let current = start.slice();
  coords.push(current);
  let iterations = 0;
  let directionX = Math.sign(end[0] - start[0]);
  let directionY = Math.sign(end[1] - start[1]);
  let direction = [directionX, directionY];
  while (!equalCoords(current, end) && iterations < 1000) {
    iterations++;
    current = [current[0] + direction[0], current[1] + direction[1]];
    coords.push(current.slice());
  }

  if (iterations >= 1000) {
    throw new Error("too many iterations");
  }
  return coords;
};

export const equalCoords = (a, b) => {
  return a[0] === b[0] && a[1] === b[1];
};
