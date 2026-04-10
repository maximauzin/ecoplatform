import { Link } from 'react-router-dom';
import {useState} from 'react';
import Header from '../../components/Header';
import arrowLeft from '../../assets/arrowLeft.png';
import arrowLeftCream from '../../assets/arrowLeftCream.png';
import './Authorization.css';

export default function Authorization() {
    const [isHovered, setHovered] = useState(false);

    return (
        <>
        <Header />
        <section className="main">
                <p>
                    <Link 
                    className="back" to='/'
                    onMouseEnter={() => {setHovered(true)}}
                    onMouseLeave={() => {setHovered(false)}}>
                            <img 
                            className="back-img" 
                            src={isHovered ? arrowLeftCream : arrowLeft} 
                            alt="стрелка назад" /> Назад</Link></p>
                <div className="form">
                    <h1>SecondBloom</h1>
                    <form>
                        <h2>Вход/регистрация</h2>
                        <div className="input">
                            <input type="text" placeholder="Логин" />
                            <input type="password" placeholder="Пароль" />
                            <button type="submit">Регистрация</button>
                            <p class="logIn">Уже есть аккаунт? <Link to='/login'>Войти</Link></p>
                        </div>
                    </form>
                </div>
        </section>
        </>
    )
}

