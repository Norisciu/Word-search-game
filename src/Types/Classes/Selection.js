class Selection {
    constructor(selectionIndices , direction , selectionColor , selectionType){
        let [dirRow , dirCol]  = direction;
        this.startRowCol   = selectionIndices[0];
        this.endRowCol  = selectionIndices[selectionIndices.length-1];
        this.tileCoords  = selectionIndices;
        this.color  =  selectionColor;
        this.type  = selectionType;
    }

    includesCoord([row , col]) {
        return this.tileCoords.find(coord => coord[0] === row && coord[1] === col);
    }
}

export default Selection;

