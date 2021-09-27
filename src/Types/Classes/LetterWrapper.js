// mike
const [
    NOT_SELECTION , 
    SELECTION_ATTEMPT , 
    SELECTION_CORRECT
] = ["noSelection" , "selectionAttempt" , "selectionCorrect"];

class LetterWrapper {
    constructor(letter , idx , parentColumns){
        this.letter = letter.toUpperCase();
        this.idx  = idx;
        this.row  = Math.floor( idx / parentColumns);
        this.column  = idx % parentColumns;
        this.isSelection = NOT_SELECTION;
        this.id = idx;
    }
}


export default LetterWrapper;

