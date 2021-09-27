import ActionButton from "../GameButton/ActionButton/ActionButton";
import "./RemoveButton.css";
import { AiFillCloseCircle } from "react-icons/ai";

export default function RemoveButton({ ...props})
{
    return (
        <ActionButton {...props}>
            <AiFillCloseCircle />
        </ActionButton>
    )
}