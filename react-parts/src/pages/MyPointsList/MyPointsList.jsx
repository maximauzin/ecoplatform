import { useState, useEffect } from 'react';
import './MyPointsList.css';
import { effect, normalizePoint, CardItem } from '../../utils/utils';
import HeaderCream from '../../components/HeaderCream/HeaderCream';
import BackLink from '../../components/BackLink/BackLink';
import deleteImg from '../../assets/delete.png';
import deleteHover from '../../assets/deleteHover.png';
import { getPoints, deletePoint } from '../../api/points';
import { getCategories } from '../../api/waste';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function MyPointsList() {
    effect();
    const { user } = useAuth();
    const navigate = useNavigate();
    const [cards, setCards] = useState([]);
    const [categoryMap, setCategoryMap] = useState({});
    const [hoveredId, setHoveredId] = useState(null);

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
        if (!user) return;
        getPoints({ owner: user.id })
            .then(data => {
                const normalized = data.map(p => normalizePoint(p, categoryMap));
                setCards(normalized);
            })
            .catch(() => {});
    }, [user, categoryMap]);

    const handleDelete = async (id) => {
        const confirmed = window.confirm("Вы уверены, что хотите удалить этот пункт? Он перестанет отображаться на карте.");
        if (!confirmed) return;

        try {
            await deletePoint(id);
            setCards(prev => prev.filter(c => c.id !== id));
        } catch {
            // ignore
        }
    };

    return (
        <>
        <HeaderCream />
        <section className="my-points-page">
            <BackLink />
            <div className="my-points">
                <h3>Мои пункты</h3>
                {cards.map(card => (
                    <div key={card.id} className="my-point-wrapper">
                        <CardItem card={card} />
                        <div className="card-edit">
                            <span
                                className="edit-link"
                                style={{ cursor: 'pointer' }}
                                onClick={() => navigate(`/cardEdit/${card.id}`)}
                            >Редактировать</span>
                            <button
                                className='delete'
                                onMouseEnter={() => setHoveredId(card.id)}
                                onMouseLeave={() => setHoveredId(null)}
                                onClick={() => handleDelete(card.id)}
                            >
                                <img src={hoveredId === card.id ? deleteHover : deleteImg} alt="Удалить" />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </section>
        </>
    );
}
