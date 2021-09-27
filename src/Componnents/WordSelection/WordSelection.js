import "./WordSelection.css";

export default function WordSelection({letters}){
    let contents =   letters.map(letter => (
        <div className="letter-tile">
            {letter}
        </div>
    ))
    return (
        <div className="letters-wrapper">
            {contents}
        </div>
    )
}