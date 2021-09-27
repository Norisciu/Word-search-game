import "./WordLabel.css";

export default function WordLabel({wordName , onClick , style={}}){
    return( 
        <div 
            className="word-label"
            style={style}
            onClick={onClick}
        >
            <p className="word-name">{wordName}</p>
        </div>
    )
}