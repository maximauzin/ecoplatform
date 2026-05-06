import { useEffect, useState } from 'react';
import DescriptionPoint from "../DescriptionPoint/DescriptionPoint";
import RatingWithHeart from "../RatingWithHeart/RatingWithHeart";
import { getPoint } from '../../api/points';
import { toggleFavorite } from '../../api/favorites';
import geoPng from '../../assets/geo.png';
import clockPng from '../../assets/clock.png';
import './CardMore.css';

const NAME_TO_CLASS = {
    'Бумага': 'card-type-paper',
    'Пластик': 'card-type-plastic',
    'Стекло': 'card-type-glass',
    'Металл': 'card-type-metal',
};

export default function CardMore({ id }) {
    const [point, setPoint] = useState(null);
    const [isLiked, setIsLiked] = useState(false);

    useEffect(() => {
        if (!id) return;
        getPoint(id)
            .then(data => {
                setPoint(data);
                setIsLiked(data.is_favorite || false);
            })
            .catch(() => {});
    }, [id]);

    const handleToggle = async () => {
        const prev = isLiked;
        setIsLiked(!prev);
        try {
            await toggleFavorite(point.id, prev);
        } catch {
            setIsLiked(prev);
        }
    };

    if (!point) return null;

    const tags = (point.waste_categories_detail || []).map(cat => ({
        name: cat.name,
        class: NAME_TO_CLASS[cat.name] || 'card-type-default',
    }));

    return (
        <>
        <section className="card-more">
            <h1>{point.name}</h1>
            <div className="tags">
                <ul className="card-type-item">
                    {tags.map(tag => (
                        <li key={tag.name} className={tag.class}>{tag.name}</li>
                    ))}
                </ul>
                <RatingWithHeart
                    showStars={false}
                    isFavorite={isLiked}
                    onToggleFavorite={handleToggle}
                />
            </div>
            <div className="card-place">
                <img src={geoPng} alt="метка" />
                <p>{point.address}</p>
            </div>

            <div className="card-time">
                <div className="card-time-work">
                    <img src={clockPng} width="27" height="27" alt="часы" />
                    <div className="card-p">
                        <p>Режим работы:</p>
                        <p>{point.schedule}</p>
                    </div>
                </div>
            </div>
            <DescriptionPoint description={point.description} />
        </section>
        </>
    );
}
