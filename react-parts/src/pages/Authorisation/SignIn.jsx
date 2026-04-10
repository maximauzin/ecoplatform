import { Link } from 'react-router-dom';
import Header from '../../components/Header/Header';
import './Authorization.css';
import BackLink from '../../components/BackLink/BackLink';

export default function Authorization() {
    return (
        <>
        <Header />
        <section className="main">
                <BackLink />
                <div className="form">
                    <h1>SecondBloom</h1>
                    <form>
                        <h2>Вход/регистрация</h2>
                        <div className="input">
                            <input type="text" placeholder="Логин" />
                            <input type="password" placeholder="Пароль" />
                            <button type="submit">Регистрация</button>
                            <p className="logIn">Уже есть аккаунт? <Link to='/login'>Войти</Link></p>
                        </div>
                    </form>
                </div>
        </section>
        </>
    )
}

