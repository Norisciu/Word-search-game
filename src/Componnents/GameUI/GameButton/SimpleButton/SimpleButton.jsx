import "./SimpleButton.css";

const SimpleButton = ({
  children,
  onClick = (f) => f,
  className = " ",
  ...props
}) => {
  const classes = `${className} button button-simple`;

  return (
    <button className={classes} onClick={onClick} {...props}>
      {children}
    </button>
  );
};

export default SimpleButton;
