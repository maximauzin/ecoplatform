import {Link} from 'react-router-dom';
import accountGreenImg from '../../assets/accountGreen.png';
import './HeaderCream.css';

export default function Header() {
    return (
        <header className="header-cream">
            <p className="logo">SecondBloom</p>
            <nav className="nav">
                <ul className="navigation">
                    <li className="navigation-item-green">
                        <Link to="/main">Главная</Link>
                    </li>
                    <li className="navigation-item-green">
                        <Link to="/QA">FAQ</Link>
                    </li>
                    <li className="navigation-item-green">
                        <Link className="personal-account" to="/resonalAccount">
                            <img src={accountGreenImg} alt="Личный кабинет" />
                        </Link>
                    </li>
                </ul>
            </nav>
        </header>
    );
}