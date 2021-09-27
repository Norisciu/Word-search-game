import "./Banner.css";

export default function Banner({content="No Content"}){
    return (
        <div className="banner-container">
            <h5 className="banner__content">
                {content}
            </h5>
        </div>
    )
}