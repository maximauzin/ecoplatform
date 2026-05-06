import { useRef } from 'react';
import BackLink from "../BackLink/BackLink";
import avatarImg from '../../assets/default-avatar.svg';
import { useNavigate } from 'react-router-dom';
import { useEffect } from "react";
import { useAuth } from '../../context/AuthContext';
import { updateProfile } from '../../api/profile';
import './Account.css';

export default function Account() {
    const { user, logout, setUser } = useAuth();
    const navigate = useNavigate();
    const fileInputRef = useRef(null);

    useEffect(() => {
        const oldBg = document.body.style.backgroundColor;
        document.body.style.backgroundColor = 'white';
        return () => {
            document.body.style.backgroundColor = oldBg;
        };
    }, []);

    const handleLogout = () => {
        logout();
        navigate('/mainAnonim');
    };

    const handleAvatarClick = () => {
        fileInputRef.current?.click();
    };

    const handleAvatarChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const formData = new FormData();
        formData.append('avatar', file);
        try {
            const updated = await updateProfile(formData);
            setUser(updated);
        } catch {
            // ignore
        }
        e.target.value = '';
    };

    const avatarSrc = user?.avatar
        ? (user.avatar.startsWith('http') ? user.avatar : `/media/${user.avatar}`)
        : avatarImg;

    return (
        <section className="account-card">
            <div className="account">
                <BackLink />
                <div className="avatar">
                    <div className="avatar-info">
                        <div className="avatar-wrapper" onClick={handleAvatarClick}>
                            <img src={avatarSrc} alt="Аватар" width="158" height="158" />
                            <div className="avatar-overlay">Изменить</div>
                        </div>
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            hidden
                            onChange={handleAvatarChange}
                        />
                        <h2 className="name">{user?.username || user?.email || 'Пользователь'}</h2>
                    </div>
                    <div className="exit-container">
                        <span className="exit" onClick={handleLogout}>Выйти</span>
                    </div>
                </div>
                {user?.role === 'owner' && (
                    <div className="add-container">
                        <span className="add" onClick={() => navigate('/add')}>Добавить пункт</span>
                    </div>
                )}
            </div>
        </section>
    );
}
