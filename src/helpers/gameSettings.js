
const SettingsModule  = ( function()  {
    const  [NO_DRAG , FIND_DIRECTION , CHOOSE_NEXT , DRAGGING] = ["noDrag" , "findDirection" , "chooseNext" , "dragging"];
    const dragStates  =  [NO_DRAG , FIND_DIRECTION , CHOOSE_NEXT , DRAGGING];

    const tileWidth  = "1.4em ";
    const tileHeight = "1.4em ";

    const SOLVE_TIME_IN_SECONDS = {seconds : 570};  

    return {
        NO_DRAG: NO_DRAG , 
        FIND_DIRECTION : FIND_DIRECTION , 
        CHOOSE_NEXT : CHOOSE_NEXT ,
        DRAGGING : DRAGGING , 
        SOLVE_TIME_IN_SECONDS : SOLVE_TIME_IN_SECONDS,
        tileWidth : tileWidth ,
        tileHeight : tileHeight,
        
    }
} )();



export default SettingsModule;