import { useState, useEffect } from "react";
import { createContext } from "react";
import "./Checker.css";

const initFormCheckerData = {
    errors: [],
    dirty: {},
    formIsSubmit: false,
    callSubmit: false
}


export const FormContext = createContext();

const checkData = (data, rules) => {
    const errors = [];
    rules.forEach(({ name, checkFun }) => {
        const { checkResult, errorString } = checkFun(data);
        if (!checkResult) {
            errors.push({ name, errorString })
        }
    })

    return errors;
}


export default function Checker({ formData, rules, children, className }) {


    const [formCheckerState, setFormCheckerState] = useState(initFormCheckerData);
    const { errors, dirty } = formCheckerState;

    useEffect(() => {
        let errors = checkData(formData, rules);
        setFormCheckerState({ ...formCheckerState, errors: errors });

    }, [formData]);



    const handleChange = (event) => {
        event.preventDefault();
        let name = event.target.name;
        let changes = {
            dirty: {
                ...formCheckerState.dirty,
                [name]: true
            }
        };

        setFormCheckerState({ ...formCheckerState, ...changes });
    }

    const getRuleError = ruleName => {
        return errors.find(object => object.name === ruleName);
    }
    const hasErrors = () => errors.length > 0;

    const classes = `checker-container ${className}`;
    return (
        <>
            <FormContext.Provider value={{ getRuleError, hasErrors }}>
                <div
                    style={{ width: "100%" }}
                    className={classes}
                    onChange={handleChange}
                >
                    {children}
                </div>
            </FormContext.Provider>
        </>
    )
}