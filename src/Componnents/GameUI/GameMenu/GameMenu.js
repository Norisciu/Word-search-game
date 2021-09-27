
import "./GameMenu.css";

export default function GameMenu({
    menuName,
    menuContent , 
    isVisible = false,
    children
}){
    if (!isVisible){ return null ; }

    return (
        <div className="game-menu">
            <h5 className="game-menu__name">{menuName}</h5>
            <p className="menu-content">
                {menuContent}
            </p>
            <div className="menu-actions">
                {children}
            </div>
        </div>
    )
}