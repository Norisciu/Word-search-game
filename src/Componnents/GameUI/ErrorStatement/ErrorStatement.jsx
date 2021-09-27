import React, { useContext } from "react";
import { FormContext } from "../../../GameConfigChecker/Checker";
import "./ErrorStatement.css";

export function ErrorStatement({ ruleName }) {
  const { getRuleError } = useContext(FormContext);
  const error = getRuleError(ruleName);

  if (error) {
    return <div className="error-box">{error.errorString}</div>;
  } else {
    return null;
  }
}
