import './MyPointsList.css';
import {Link} from 'react-router-dom';
import { catalogPoints } from '../../utils/utils';
import arrowMore from '../../assets/arrowMore.png';
import RatingWithHeart from '../../components/RatingWithHeart/RatingWithHeart'; 
import {useState, useEffect} from 'react';
import HeaderCream from '../../components/HeaderCream/HeaderCream';
import BackLink from '../../components/BackLink/BackLink';
import deleteImg from '../../assets/delete.png';
import deleteHover from '../../assets/deleteHover.png';


export default function FavoriteCard() {
    useEffect (() => {
                const oldBg = document.body.style.backgroundColor;
        
                document.body.style.backgroundColor = 'white';
        
                return () => {
                    document.body.style.backgroundColor = oldBg;
                };
            }, []);

    const card = catalogPoints.find(p => p.id === 2);
    if (!card) return null;

    const [isLiked, setIsLiked] = useState(true);

    const toggleLike = () => setIsLiked(prev => !prev);

    const [isHovered, setHovered] = useState(false);

    return (
        <>
        <HeaderCream />
        <section className="my-points-page">
            <BackLink />
            <div className="my-points">
                <h3>
                    Moи пункты
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
            </div>
            <div className="card-edit">
                <Link to="/cardEdit" >Редактировать</Link>
                <button className='delete'
                onMouseEnter={() => setHovered(true)}
                onMouseLeave={() => setHovered(false)}><img src={isHovered ? deleteHover : deleteImg} /></button>
            </div>
        </section>
        </>
    );
}