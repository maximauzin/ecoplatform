import { useState, useEffect } from 'react';
import HeaderAnonim from '../../components/HeaderAnonim/HeaderAnonim';
import { CardItem, effect, normalizePoint } from "../../utils/utils";
import Search from "../../components/Search/Search";
import YandexMap from "../../components/YandexMap/YandexMap";
import { getPoints } from '../../api/points';
import { getCategories } from '../../api/waste';

export default function MainAnonim() {
    effect();
    const [points, setPoints] = useState([]);
    const [rawPoints, setRawPoints] = useState([]);
    const [filtered, setFiltered] = useState([]);
    const [categoryMap, setCategoryMap] = useState({});

    useEffect(() => {
        getCategories()
            .then(cats => {
                const map = {};
                cats.forEach(c => { map[c.id] = c; });
                setCategoryMap(map);
            })
            .catch(() => {});
    }, []);

    useEffect(() => {
        getPoints()
            .then(data => {
                setRawPoints(data);
                const normalized = data.map(p => normalizePoint(p, categoryMap));
                setPoints(normalized);
                setFiltered(normalized);
            })
            .catch(() => {});
    }, [categoryMap]);

    return (
        <>
        <HeaderAnonim />
        <section className="main-page">
            <YandexMap points={filtered} width="864px" height="303px" />
            <Search items={points} onSearch={setFiltered} />
            {filtered.map(card =>
                <CardItem key={card.id} card={card} />
            )}
        </section>
        </>
    );
}
