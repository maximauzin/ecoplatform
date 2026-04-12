import { useNavigate } from 'react-router-dom';
import arrowLeft from '../../assets/arrowLeft.png';
import arrowLeftCream from '../../assets/arrowLeftCream.png';
import { useState } from 'react';
import './BackLink.css';

export default function BackLink() {
    const navigate = useNavigate();
    const [isHovered, setHovered] = useState(false);

    const goBack = () => {
        navigate(-1); 
    };

    return (
        <p>
            <button
                type="button"
                className="back"
                onClick={goBack}
                onMouseEnter={() => setHovered(true)}
                onMouseLeave={() => setHovered(false)}
            >
                <img 
                    className="back-img" 
                    src={isHovered ? arrowLeftCream : arrowLeft} 
                    alt="стрелка назад" 
                />
                Назад
            </button>
        </p>
    );
}