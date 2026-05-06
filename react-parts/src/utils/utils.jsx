/* eslint-disable react-refresh/only-export-components */
import { Link } from 'react-router-dom';
import arrowMore from '../assets/arrowMore.png';
import geoPng from '../assets/geo.png';
import clockPng from '../assets/clock.png';
import { useState, useEffect } from 'react';
import RatingWithHeart from '../components/RatingWithHeart/RatingWithHeart';
import { toggleFavorite } from '../api/favorites';
import './CardItem.css';

const NAME_TO_CLASS = {
    'Бумага': 'card-type-paper',
    'Пластик': 'card-type-plastic',
    'Стекло': 'card-type-glass',
    'Металл': 'card-type-metal',
    'paper': 'card-type-paper',
    'plastic': 'card-type-plastic',
    'glass': 'card-type-glass',
    'metal': 'card-type-metal',
};

export function normalizePoint(point, categoryMap = {}) {
    return {
        id: point.id,
        title: point.name,
        rating: parseFloat(point.average_rating) || 0,
        tags: (point.waste_categories || []).map(id => {
            const cat = categoryMap[id];
            if (!cat) return null;
            return { name: cat.name, class: NAME_TO_CLASS[cat.name] || 'card-type-default' };
        }).filter(Boolean),
        address: point.address || '',
        hours: point.schedule || '',
        image: geoPng,
        clockImage: clockPng,
        is_favorite: point.is_favorite || false,
        owner_id: point.owner_id,
        photo: point.photo,
        latitude: point.latitude,
        longitude: point.longitude,
    };
}

export const catalogPoints = [];

export function CardItem({ card, onToggle }) {
    const [isLiked, setIsLiked] = useState(card.is_favorite ?? false);

    const handleToggle = async () => {
        try {
            const isNowFavorite = await toggleFavorite(card.id);
            setIsLiked(isNowFavorite);
            if (onToggle) onToggle(card.id, isNowFavorite);
        } catch (error) {
            console.error('Failed to toggle favorite:', error);
        }
    };

    return (
        <div className="card">
            <div className="card-name">
                <p className="card-title">{card.title}</p>
                <RatingWithHeart
                    rating={card.rating}
                    isFavorite={isLiked}
                    onToggleFavorite={handleToggle}
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
                    <Link to={`/card/${card.id}`}>
                        <p>Смотреть больше</p>
                        <img src={arrowMore} alt="ещё" />
                    </Link>
                </div>
            </div>
        </div>
    );
}

export function useWhiteBackground() {
    useEffect(() => {
        const oldBg = document.body.style.backgroundColor;
        document.body.style.backgroundColor = 'white';
        return () => {
            document.body.style.backgroundColor = oldBg;
        };
    }, []);
}

export function effect() {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useWhiteBackground();
}
