import { useState, useEffect } from 'react';
import './FavoriteList.css';
import { effect, normalizePoint, CardItem } from '../../utils/utils';
import HeaderCream from '../../components/HeaderCream/HeaderCream';
import BackLink from '../../components/BackLink/BackLink';
import { getFavorites } from '../../api/favorites';
import { getCategories } from '../../api/waste';

export default function FavoriteList() {
    effect();
    const [cards, setCards] = useState([]);
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
                const normalized = data.map(fav => normalizePoint(fav.point_detail || {}, categoryMap));
                setCards(normalized.filter(c => c.id));
            })
            .catch(() => {});
    }, [categoryMap]);

    const handleToggle = (id, isFavorite) => {
        if (!isFavorite) {
            setCards(prev => prev.filter(c => c.id !== id));
        }
    };

    return (
        <>
            <HeaderCream />
            <section className="favorite-page">
                <BackLink />
                <div className="favorite">
                    <h3>Избранное</h3>
                    {cards.length > 0 ? (
                        cards.map(card => (
                            <CardItem key={card.id} card={card} onToggle={handleToggle} />
                        ))
                    ) : (
                        <p style={{ textAlign: 'center', marginTop: '20px' }}>У вас пока нет избранных пунктов</p>
                    )}
                </div>
            </section>
        </>
    );
}
