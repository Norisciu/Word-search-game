import React, { useEffect, useRef, useState } from "react";

const formatSeconds = (seconds) => {
  let minutes = `${Math.floor(seconds / 60)}`.padStart(2, "0");
  let secondsForm = `${seconds % 60}`.padStart(2, "0");
  return `${minutes} : ${secondsForm}`;
};

const Timer = ({ isRunning = false }) => {
  const [timerSeconds, setTimerSeconds] = useState(0);
  const timerRef = useRef(null);

  const start = () => {
    timerRef.current = setInterval(
      () => setTimerSeconds((seconds) => seconds + 1),
      1000
    );
  };

  const stop = () => {
    clearInterval(timerRef.current);
  };

  useEffect(() => {
    if (!isRunning) {
      stop();
    } else {
      start();
    }
  }, [isRunning]);

  useEffect(() => {
    return () => stop();
  }, []);

  return <p className="timer">{formatSeconds(timerSeconds)}</p>;
};

export default Timer;
