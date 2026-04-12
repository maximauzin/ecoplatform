import './MyPoints.css';
import {Link} from 'react-router-dom';
import { catalogPoints } from '../../utils/utils';
import arrowRight from '../../assets/arrowRight.png';
import arrowMore from '../../assets/arrowMore.png';
import RatingWithHeart from '../RatingWithHeart/RatingWithHeart'; 
import {useState} from 'react';

export default function FavoriteCard() {

    const card = catalogPoints.find(p => p.id === 2);
    if (!card) return null;

    const [isLiked, setIsLiked] = useState(true);

    const toggleLike = () => setIsLiked(prev => !prev);

    return (
        <section className="my-points">
            <h3>
                <Link to="/myPointsList">
                    Moи пункты <img src={arrowRight} alt="стрелка" />
                </Link>
            </h3>

            <div className="card">
                <div className="card-name">
                    <p className="card-title">{card.title}</p>
                    
                    <RatingWithHeart
                        rating={card.rating}
                        isFavorite={isLiked}
                        onToggleFavorite={toggleLike}
                    />
                </div>

                <ul className="card-type-item">
                    {card.tags.map(tag => (
                        <li key={tag.name} className={tag.class}>{tag.name}</li>
                    ))}
                </ul>

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
                    <div className="more">
                        <Link to="/cardId1">
                            <p>Смотреть больше</p>
                            <img src={arrowMore} alt="ещё" />
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
}