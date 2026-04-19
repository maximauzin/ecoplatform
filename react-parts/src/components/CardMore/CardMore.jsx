import { catalogPoints } from "../../utils/utils";
import DescriptionPoint from "../DescriptionPoint/DescriptionPoint";
import RatingWithHeart from "../RatingWithHeart/RatingWithHeart";
import { useState } from "react";
import './CardMore.css';

export default function CardMore() {
    const card = catalogPoints.find(p => p.id === 4);
    const [isLiked, setIsLiked] = useState(true);
    const toggleLike = () => setIsLiked(prev => !prev);

    return (
        <>
        <section className="card-more">
            <h1>{card.title}</h1>
            <div className="tags">
                <ul className="card-type-item">
                    {card.tags?.map(tag => (
                        <li key={tag.name} className={tag.class}>{tag.name}</li>
                    ))}
                </ul>
                <RatingWithHeart 
                    showStars={false}
                    isFavorite={isLiked}
                    onToggleFavorite={toggleLike}
                />
            </div>
            <div className="card-place">
                <img src={card.image} alt="метка" />
                <p>{card.address}</p>
            </div>

            <div className="card-time">
                <div className="card-time-work">
                    <img src={card.clockImage} width="27" height="27" alt="часы" />
                    <div className="card-p">
                        <p>Режим работы:</p>
                        <p>{card.hours}</p>
                    </div>
                </div>
            </div>
            <DescriptionPoint />
        </section>
        </>
    )
}