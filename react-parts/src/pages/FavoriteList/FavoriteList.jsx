import './FavoriteList.css';
import {Link} from 'react-router-dom';
import { catalogPoints } from '../../utils/utils';
import arrowMore from '../../assets/arrowMore.png';
import RatingWithHeart from '../../components/RatingWithHeart/RatingWithHeart'; 
import {useState} from 'react';
import HeaderCream from '../../components/HeaderCream/HeaderCream';
import { useEffect } from 'react';
import BackLink from '../../components/BackLink/BackLink';


function CardItem({card}) {
    const [isLiked, setIsLiked] = useState(true);

    const toggleLike = () => setIsLiked(prev => !prev);

    return (
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
                {card.tags?.map(tag => (
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
    )
}

export default function FavoriteList() {
    useEffect (() => {
            const oldBg = document.body.style.backgroundColor;
    
            document.body.style.backgroundColor = 'white';
    
            return () => {
                document.body.style.backgroundColor = oldBg;
            };
        }, []);
    
    const card = catalogPoints.filter(p => p.id > 2);
    if (!card) return null;

    return (
        <>
            <HeaderCream />
            <section className="favorite-page">
                <BackLink />
                <div className="favorite">
                    <h3>
                            Избранное
                    </h3>
                    {card.map(card => (
                        <CardItem key={card.id} card={card} />
                    ))}
                </div>
            </section>
        </>
    );
}

