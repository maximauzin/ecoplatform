import './FavoriteList.css';
import {Link} from 'react-router-dom';
import { catalogPoints } from '../../utils/utils';
import HeaderCream from '../../components/HeaderCream/HeaderCream';
import { useEffect } from 'react';
import BackLink from '../../components/BackLink/BackLink';
import { CardItem } from '../../utils/utils';

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



