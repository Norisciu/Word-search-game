import "./DirectionsMenu.css";
import {
  AiOutlineArrowDown,
  AiOutlineArrowLeft,
  AiOutlineArrowRight,
  AiOutlineArrowUp,
} from "react-icons/ai";
import { IconContext } from "react-icons/lib";
import { DIRECTIONS } from "../../../helpers/constantsModule";
import {
  BsArrowDownLeft,
  BsArrowDownRight,
  BsArrowUpLeft,
  BsArrowUpRight,
} from "react-icons/bs";
import ActionButton from "../GameButton/ActionButton/ActionButton";

export default function DirectionsMenuUpdate({
  selectionDirections,
  onSelection,
}) {
  const directionButtons = () => {
    const arrowImages = [
      <AiOutlineArrowUp />,
      <AiOutlineArrowDown />,
      <AiOutlineArrowLeft />,
      <AiOutlineArrowRight />,
      <BsArrowUpLeft />,
      <BsArrowUpRight />,
      <BsArrowDownRight />,
      <BsArrowDownLeft />,
    ];

    const directionNames = Object.values(DIRECTIONS);

    const buttons = arrowImages.map((arrow, idx) => {
      const currentDirectionName = directionNames[idx];

      const isSelection = selectionDirections.includes(currentDirectionName);
      const classes = `direction-button ${
        isSelection ? "direction-button--selection" : ""
      }`;

      return (
        <ActionButton
          className={classes}
          onClick={() => onSelection(currentDirectionName)}
        >
          {arrow}
        </ActionButton>
      );
    });

    return buttons;
  };

  const iconStyles = {
    className: "arrow-icon",
    size: "59%",
  };

  return (
    <IconContext.Provider value={iconStyles}>
      <div className="select-directions-container">{directionButtons()}</div>
    </IconContext.Provider>
  );
}
