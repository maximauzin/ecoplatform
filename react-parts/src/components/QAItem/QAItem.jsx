import { useState } from "react";
import arrowDown from '../../assets/arrowDown.png';
import './QAItem.css';

export default function QAItem({questions, answer}) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className={`qa-item ${isOpen ? 'open' : ''}`}>
            <button 
                className="qa-questions"
                onClick={() => setIsOpen(!isOpen)}
                aria-expanded={isOpen}
            >
                <span className="questions-text">{questions}</span>
                <span className={`arrow ${isOpen ? 'rotated' : ''}`}>
                    <img src={arrowDown} width="30px" height="17px"/>
                </span>
            </button>
            <div className={`qa-answer ${isOpen ? 'visibled' : ''}`}>
                <p>{answer}</p>
            </div>
        </div>
    )
}