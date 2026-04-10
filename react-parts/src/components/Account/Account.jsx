import BackLink from "../BackLink/BackLink";
import avatarImg from '../../assets/avatar.png';
import {Link} from 'react-router-dom';
import { useEffect } from "react";
import './Account.css';

export default function Account() {
    useEffect (() => {
        const oldBg = document.body.style.backgroundColor;

        document.body.style.backgroundColor = 'white';

        return () => {
            document.body.style.backgroundColor = oldBg;
        };
    }, []);

    return (
        <section>
                <div className="account">
                    <BackLink />
                    <div className="avatar">
                        <img src={avatarImg} alt="Аватар" width="158px" height="158px" />
                        <h2 className="name">Карина Никитина</h2>
                        <p><Link className="exit" to="/exit">Выйти</Link></p>
                    </div> 
                </div>
                <p><Link className="add" to="/add">Добавит пункт</Link></p>
        </section>
    )
}