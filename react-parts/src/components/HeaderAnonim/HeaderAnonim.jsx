import {Link} from 'react-router-dom';
import '../HeaderCream/HeaderCream.css';

export default function HeaderAnonim() {
    return (
        <header className="header-cream">
            <p className="logo">SecondBloom</p>
            <nav className="nav">
                <ul className="navigation">
                    <li className="navigation-item-green">
                        <Link to="/mainAnonim">Главная</Link>
                    </li>
                    <li className="navigation-item-green">
                        <Link to="/QA">FAQ</Link>
                    </li>
                    <li className="navigation-item-green">
                        <Link to="/login">Войти</Link>
                    </li>
                    <li className="navigation-item-green">
                        <Link to="/signin">Зарегистрироваться</Link>
                    </li>
                </ul>
            </nav>
        </header>
    );
}