import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Header from '../../components/Header/Header';
import BackLink from '../../components/BackLink/BackLink';
import { useAuth } from '../../context/AuthContext';
import './Authorization.css';

export default function SignIn() {
    const { register } = useAuth();
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        if (password !== confirmPassword) {
            setError('Пароли не совпадают');
            return;
        }
        setIsLoading(true);
        try {
            await register(email, username, password, confirmPassword, 'user');
            navigate('/main');
        } catch (err) {
            const data = err.response?.data;
            if (data) {
                const messages = Object.values(data).flat();
                setError(messages[0] || 'Ошибка регистрации');
            } else {
                setError('Ошибка регистрации');
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
        <Header />
        <section className="main">
                <BackLink />
                <div className="form">
                    <h1>SecondBloom</h1>
                    <form onSubmit={handleSubmit}>
                        <h2>Вход/регистрация</h2>
                        <div className="input">
                            <input
                                type="text"
                                placeholder="Логин (email)"
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                required
                            />
                            <input
                                type="text"
                                placeholder="Имя пользователя"
                                value={username}
                                onChange={e => setUsername(e.target.value)}
                                required
                            />
                            <input
                                type="password"
                                placeholder="Пароль"
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                required
                            />
                            <input
                                type="password"
                                placeholder="Подтвердите пароль"
                                value={confirmPassword}
                                onChange={e => setConfirmPassword(e.target.value)}
                                required
                            />
                            {error && <p style={{ color: 'red', margin: '4px 0' }}>{error}</p>}
                            <button type="submit" className='submit' disabled={isLoading}>
                                {isLoading ? '...' : 'Регистрация'}
                            </button>
                            <p className="logIn">Уже есть аккаунт? <Link to='/login'>Войти</Link></p>
                        </div>
                    </form>
                </div>
        </section>
        </>
    );
}
