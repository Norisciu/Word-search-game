import "./PauseButton.css";

export default function PauseButton({ onClick }) {
  return (
    <div onClick={onClick} className="button-container">
      <div className="button-line"></div>
      <div className="button-line"></div>
    </div>
  );
}
