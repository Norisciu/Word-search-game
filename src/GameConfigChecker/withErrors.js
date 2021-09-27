import { FormContext } from "./Checker";
import { useContext } from "react";

// HOC thought to be usd with the form valdator
// which enables disabling/enabling components depending on whether
// the valdator has errors or not
export const withErrors =
  (Component) =>
  ({ ...props }) => {
    const { hasErrors } = useContext(FormContext);
    return <Component {...props} disabled={hasErrors()} />;
  };
