import {Link} from 'react-router-dom';
import arrowLeft from '../../assets/arrowLeft.png';
import arrowLeftCream from '../../assets/arrowLeftCream.png';
import {useState} from 'react';

export default function BackLink() {
    const [isHovered, setHovered] = useState(false);

    return (
        <p>
            <Link 
                className="back" to='/'
                onMouseEnter={() => {setHovered(true)}}
                onMouseLeave={() => {setHovered(false)}}>
                <img 
                    className="back-img" 
                    src={isHovered ? arrowLeftCream : arrowLeft} 
                    alt="стрелка назад" /> Назад</Link>
        </p>
    )
}