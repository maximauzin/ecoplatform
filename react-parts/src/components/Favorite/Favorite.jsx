import { useState, useEffect } from 'react';
import './Favorite.css';
import { Link } from 'react-router-dom';
import arrowRight from '../../assets/arrowRight.png';
import arrowMore from '../../assets/arrowMore.png';
import geoPng from '../../assets/geo.png';
import clockPng from '../../assets/clock.png';
import RatingWithHeart from '../RatingWithHeart/RatingWithHeart';
import { getFavorites } from '../../api/favorites';
import { getCategories } from '../../api/waste';
import { normalizePoint } from '../../utils/utils';

export default function FavoriteCard() {
    const [card, setCard] = useState(null);
    const [isLiked, setIsLiked] = useState(true);
    const [categoryMap, setCategoryMap] = useState({});

    useEffect(() => {
        getCategories()
            .then(cats => {
                const map = {};
                cats.forEach(c => { map[c.id] = c; });
                setCategoryMap(map);
            })
            .catch(() => {});
    }, []);

    useEffect(() => {
        getFavorites()
            .then(data => {
                if (data.length > 0) {
                    const norm = normalizePoint(data[0].point_detail || {}, categoryMap);
                    if (norm.id) setCard(norm);
                }
            })
            .catch(() => {});
    }, [categoryMap]);

    return (
        <section className="favorite">
            <h3>
                <Link to="/favoriteList">
                    Избранное <img src={arrowRight} alt="стрелка" />
                </Link>
            </h3>

            {card && (
                <div className="card">
                    <div className="card-name">
                        <p className="card-title">{card.title}</p>
                        <RatingWithHeart
                            rating={card.rating}
                            isFavorite={isLiked}
                            onToggleFavorite={() => setIsLiked(p => !p)}
                        />
                    </div>

                    <ul className="card-type-item">
                        {card.tags.map(tag => (
                            <li key={tag.name} className={tag.class}>{tag.name}</li>
                        ))}
                    </ul>

                    <div className="card-place">
                        <img src={geoPng} alt="метка" />
                        <p>{card.address}</p>
                    </div>

                    <div className="card-time">
                        <div className="card-time-work">
                            <img src={clockPng} width="27" height="27" alt="часы" />
                            <div className="card-p">
                                <p>Режим работы:</p>
                                <p>{card.hours}</p>
                            </div>
                        </div>
                        <div className="more">
                            <Link to={`/card/${card.id}`}>
                                <p>Смотреть больше</p>
                                <img src={arrowMore} alt="ещё" />
                            </Link>
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
}
