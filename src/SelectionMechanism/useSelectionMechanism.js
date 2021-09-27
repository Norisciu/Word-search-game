import React, { useEffect, useState } from "react";
import {
  NO_DRAG,
  DRAGGING,
  FIND_DIRECTION,
  CHOOSE_NEXT,
  DRAG_TOLERANCE,
  USER_SELECTION_COLORS,
} from "../helpers/constantsModule";
import {
  getCoordsBeetween,
  getProjRowAndColumn,
  getRowColFromPointer,
  getDirectionFromVector,
  onSameDirection,
  onOpposingDirection,
  getTileAtRowCol,
  equalGridCoords,
} from "../Componnents/Grid/GridUtils";

const initSelectionState = {
  currentState: NO_DRAG,
  isDragging: false,
  dragStart: null,
  pointerStart: null,
  dragEnd: null,
  direction: null,
  selectionColor: null,
  selectionLetters: [],
  userSelection: [],
};

export function useSelectionMechanism(checkWordCallback, dataOfGrid) {
  const [selectionState, setSelectionState] = useState(initSelectionState);

  const startDrag = (event) => {
    let pointerStart = { x: event.clientX, y: event.clientY };
    let dragStart = getRowColFromPointer(pointerStart);
    let { selectionColor, userSelection, selectionLetters } =
      selectTileAtRowCol(dragStart);

    let changes = {
      currentState: FIND_DIRECTION,
      isDragging: true,
      dragStart: dragStart,
      pointerStart: { x: event.screenX, y: event.screenY },
      selectionColor: selectionColor,
      userSelection: userSelection,
      selectionLetters: selectionLetters,
    };
    setSelectionState({ ...selectionState, ...changes });
  };

  const continueDrag = (event) => {
    if (!selectionState.isDragging) {
      return;
    }

    if (selectionState.currentState === FIND_DIRECTION) {
      let pointerXY = { x: event.screenX, y: event.screenY };
      let pointerStart = selectionState.pointerStart;
      let dx = event.screenX - pointerStart.x;
      let dy = event.screenY - pointerStart.y;
      let magnitude = Math.hypot(dx, dy);

      if (magnitude > DRAG_TOLERANCE) {
        let direction = getDirectionFromVector(dx, dy);

        let changes = { direction: direction, currentState: CHOOSE_NEXT };
        setSelectionState({ ...selectionState, ...changes });
      }
    }

    if (selectionState.currentState === CHOOSE_NEXT) {
      let pointerXY = { x: event.screenX, y: event.screenY };
      let relativePointerXY = { x: event.clientX, y: event.clientY };
      let [row, column] = getRowColFromPointer(relativePointerXY);
      let [startRow, startColumn] = selectionState.dragStart;
      let direction = selectionState.direction;
      let dragStart = selectionState.dragStart;

      if (
        (row != startRow || column != startColumn) &&
        onSameDirection(dragStart, direction, [row, column])
      ) {
        let changes = {
          dragEnd: [row, column],
          currentState: DRAGGING,
          ...selectTileAtRowCol([row, column]),
        };
        setSelectionState({ ...selectionState, ...changes });
      }
    }

    if (selectionState.currentState === DRAGGING) {
      let relativePointerXY = { x: event.clientX, y: event.clientY };
      let [row, column] = getRowColFromPointer(relativePointerXY);

      let direction = selectionState.direction;
      let [startRow, startColumn] = selectionState.dragStart;
      let dragEnd = selectionState.dragEnd;

      let [projRow, projColumn] = getProjRowAndColumn(
        row,
        column,
        startRow,
        startColumn,
        direction
      );

      let tile = getTileAtRowCol([projRow, projColumn], dataOfGrid);
      if (onSameDirection(dragEnd, direction, [projRow, projColumn])) {
        let dragEnd = [projRow, projColumn];
        let selectionLetters = getSelectionTiles(
          selectionState.dragStart,
          dragEnd
        );
        setSelectionState({
          ...selectionState,
          dragEnd: dragEnd,
          ...selectionLetters,
        });
      } else if (onOpposingDirection(dragEnd, direction, [row, column])) {
        let unselectRowCol = [row + direction[0], column + direction[1]];
        let changes = {
          dragEnd: [row, column],
          selectionLetters: selectionState.selectionLetters.slice(0, -1),
          ...unselectTileAtRowCol(unselectRowCol),
        };
        setSelectionState({ ...selectionState, ...changes });
      }
    }
  };

  const endDrag = (_) => {
    let changes = {
      currentState: NO_DRAG,
      isDragging: false,
      dragStart: null,
      dragEnd: null,
      pointerStart: null,
      selectionLetters: [],
      userSelection: [],
      selectionColor: null,
    };

    setSelectionState({ selectionState, ...changes });
    checkWordCallback(selectionState);
  };

  const getSelectionTiles = (startDrag, endDrag) => {
    const selectionColor =
      selectionState.selectionColor || getRandomSelectionColor();

    const selectionTilesCoords = getCoordsBeetween(startDrag, endDrag);
    const selectionLetters = selectionTilesCoords.map(
      (coords) => getTileAtRowCol(coords, dataOfGrid).letter
    );

    return {
      selectionColor: selectionColor,
      userSelection: selectionTilesCoords,
      selectionLetters: selectionLetters,
    };
  };

  const selectTileAtRowCol = ([row, col]) => {
    const selectionColor =
      selectionState.selectionColor || getRandomSelectionColor();
    const tileLetter = getTileAtRowCol([row, col], dataOfGrid).letter;
    return {
      selectionColor: selectionColor,
      userSelection: [...selectionState.userSelection, [row, col]],
      selectionLetters: [...selectionState.selectionLetters, tileLetter],
    };
  };

  const unselectTileAtRowCol = ([row, col]) => {
    let resultUserSelection = selectionState.userSelection.filter(
      (rowCol) => !equalGridCoords(rowCol, [row, col])
    );
    return {
      userSelection: resultUserSelection,
      selectionLetters: selectionState.selectionLetters.slice(0, -1),
    };
  };

  const getRandomSelectionColor = () => {
    let colors = USER_SELECTION_COLORS;
    let color = colors[Math.floor(Math.random() * colors.length)];
    return color;
  };

  const { userSelection, selectionColor, selectionLetters } = selectionState;
  return [
    startDrag,
    continueDrag,
    endDrag,
    userSelection,
    selectionColor,
    selectionLetters,
  ];
}
