import React, { useState , useEffect, useRef } from "react";
import LetterWrapper from "../../Types/Classes/LetterWrapper";
import TileUpdate from "./Tile/TileUpdate";
import SettingsModule from "../../helpers/gameSettings";
import { useSelectionMechanism } from "../../SelectionMechanism/useSelectionMechanism";
import WordSelection from "../WordSelection/WordSelection";

export function WordsGrid({
    contents , 
    rows , 
    columns ,
    wordSelections ,  
    checkWordCallback
}){
    const [letters , setLetters] =  useState([]);
    const gridContainerRef  =  useRef();
    const  [
        startDrag , 
        continueDrag , 
        endDrag , 
        userSelection , 
        selectionColor, 
        selectionLetters 
    ]  = useSelectionMechanism(
            selectionState => checkWordCallback(selectionState) , 
            {
                gridRef : gridContainerRef.current ,
                letterWrappers : letters , 
                rows : rows , 
                columns: columns
            }
    );
    
        
    const initGridContents  =  () => {
        const letterWrappers  = contents
                                    .map(row => row.join(""))
                                    .join("") 
                                    .split("")
                                    .map((letter , idx) => (new LetterWrapper(letter , idx , columns )));
        setLetters(letterWrappers);
    }

   
    const computeTileColors = (tileIndicesLists) => {
        let tileColors  =  Array.from(
            {length : rows * columns} ,(_ , idx) => null 
        )
        
        tileIndicesLists = tileIndicesLists.filter(({_ , indices}) => indices);
        
        tileIndicesLists.forEach( ({color , indices}) => {
            indices.forEach(([row , column]) => {
                let idx  = row *  columns +  column;
                if (! tileColors[idx] ) {  tileColors[idx] = color;  }
            } );
        });

        return tileColors;
    }

    const allSelectionsIndices  =  wordSelections.map(selection => ({ 
        indices : selection.tileCoords ,
        color : selection.color
    }));

    const userSelectionIndices  = { indices : userSelection || []  , color : selectionColor};

    const tileColors  =  computeTileColors([userSelectionIndices , ...allSelectionsIndices]);
    
    const constructTile  = (letterObject , idx) => {
        return ( <TileUpdate 
                    key = {idx} 
                    {...letterObject}
                    color = {tileColors[idx]}
                  />
                )
    } 


    useEffect(initGridContents , []);

    const gridStyle =  {
        "gridTemplateRows": SettingsModule.tileWidth.repeat(rows), 
        "gridTemplateColumns": SettingsModule.tileHeight.repeat(columns),
    };

    return (
        <div className="grid-wrapper">
            <div 
                className="words-grid" 
                style={gridStyle}
                ref={gridContainerRef} 
                onMouseDown={startDrag}
                onMouseMove={continueDrag}
                onMouseUp = {endDrag}
            >
                 { letters.map(constructTile) }
            </div>
            <WordSelection letters={selectionLetters}/>

        </div>
    )
}

