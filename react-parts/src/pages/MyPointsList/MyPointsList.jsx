import './MyPointsList.css';
import {Link} from 'react-router-dom';
import { catalogPoints, effect, CardItem } from '../../utils/utils';
import {useState} from 'react';
import HeaderCream from '../../components/HeaderCream/HeaderCream';
import BackLink from '../../components/BackLink/BackLink';
import deleteImg from '../../assets/delete.png';
import deleteHover from '../../assets/deleteHover.png';


export default function FavoriteCard() {
    effect();

    const card = catalogPoints.filter(p => p.id === 2);
    if (!card) return null;

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
                {card.map(card => (
                    <CardItem key={card.id} card={card} />
                ))}
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