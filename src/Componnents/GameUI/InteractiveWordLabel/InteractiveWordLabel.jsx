import WordLabel from "../../WordLabel/WordLabel";
import "./InteractiveWordLabel.css";

import { AiFillCloseCircle } from "react-icons/ai";

export default function InteractiveWordLabel({ onClickCallback, ...props }) {
  const wordLabelStyle = {
    width: "100%",
  };
  return (
    <div className="word-label-container">
      <WordLabel style={wordLabelStyle} {...props} />
      <AiFillCloseCircle className="close-icon" />
    </div>
  );
}
