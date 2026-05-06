import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import HeaderCream from "../../components/HeaderCream/HeaderCream";
import Feedback from "../../components/Feedback/Feedback";
import { effect } from "../../utils/utils";
import BackLink from "../../components/BackLink/BackLink";
import CardMore from "../../components/CardMore/CardMore";
import YandexMap from "../../components/YandexMap/YandexMap";
import { getPoint } from "../../api/points";
import './CardPoint.css';

export default function CardPoint() {
    effect();
    const { id } = useParams();
    const pointId = id || '1';
    const [point, setPoint] = useState(null);

    useEffect(() => {
        getPoint(pointId)
            .then(data => setPoint(data))
            .catch(() => {});
    }, [pointId]);

    return (
        <>
            <HeaderCream />
            <section className="card-point">
                <BackLink />
                <CardMore id={pointId} />
                
                {point && (
                    <div style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
                        <YandexMap 
                            points={[point]} 
                            zoom={15}
                        />
                    </div>
                )}

                <Feedback pointId={pointId} />
            </section>
        </>
    );
}
