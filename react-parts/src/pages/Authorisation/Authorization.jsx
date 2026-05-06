import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Header from '../../components/Header/Header';
import BackLink from '../../components/BackLink/BackLink';
import { useAuth } from '../../context/AuthContext';
import './Authorization.css';

export default function Authorization() {
    const { login } = useAuth();
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);
        try {
            await login(email, password);
            navigate('/main');
        } catch (err) {
            setError(err.response?.data?.detail || 'Неверный логин или пароль');
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
                                placeholder="Логин"
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                required
                            />
                            <input
                                type="password"
                                placeholder="Пароль"
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                required
                            />
                            {error && <p style={{ color: 'red', margin: '4px 0' }}>{error}</p>}
                            <button type="submit" className='submit' disabled={isLoading}>
                                {isLoading ? '...' : 'Вход'}
                            </button>
                            <p className="logIn">Еще нет аккаунта? <Link to='/signin'>Зарегистрироваться</Link></p>
                        </div>
                    </form>
                </div>
        </section>
        </>
    );
}
