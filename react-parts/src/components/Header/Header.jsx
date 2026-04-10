import {Link} from 'react-router-dom';
import accountImg from '../../assets/account.png';
import './Header.css';

export default function Header() {
    return (
        <header className="header">
            <p className="logo">SecondBloom</p>
            <nav className="nav">
                <ul className="navigation">
                    <li className="navigation-item">
                        <Link to="/main">Главная</Link>
                    </li>
                    <li className="navigation-item">
                        <Link to="/QA">FAQ</Link>
                    </li>
                    <li className="navigation-item">
                        <Link className="personal-account" to="/personalAccount">
                            <img src={accountImg} alt="Личный кабинет" />
                        </Link>
                    </li>
                </ul>
            </nav>
        </header>
    );
}