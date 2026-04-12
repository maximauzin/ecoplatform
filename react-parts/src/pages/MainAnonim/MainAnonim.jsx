import HeaderAnonim from '../../components/HeaderAnonim/HeaderAnonim';
import { useEffect } from "react";
import { catalogPoints } from "../../utils/utils";
import { CardItem } from "../../utils/utils";
import mapPng from '../../assets/map.png';
import Search from "../../components/Search/Search";

export default function MainMap() {
    useEffect (() => {
            const oldBg = document.body.style.backgroundColor;
    
            document.body.style.backgroundColor = 'white';
    
            return () => {
                document.body.style.backgroundColor = oldBg;
            };
        }, []);

    return (
        <>
        <HeaderAnonim />
        <section className="main-page">
            <img src={mapPng} width="864px" height="303px"/>
            <Search />
            {catalogPoints.map(card =>
                <CardItem key={card.id} card={card} />
            )};
        </section>
        </>
    )
}