import './FavoriteList.css';
import { catalogPoints, effect } from '../../utils/utils';
import HeaderCream from '../../components/HeaderCream/HeaderCream';
import BackLink from '../../components/BackLink/BackLink';
import { CardItem } from '../../utils/utils';

export default function FavoriteList() {
    effect();

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



