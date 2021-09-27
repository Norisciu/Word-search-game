import { useEffect, useState } from "react";
import "./ActionButton.css";

const ActionButton = ({
  children,
  onClick = (f) => f,
  className = " ",
  iconSrc = "",
  style = {},
  ...props
}) => {
  const classes = `${className} button button--action`;

  return (
    <button className={classes} onClick={onClick} style={style} {...props}>
      {children}
    </button>
  );
};

export default ActionButton;
