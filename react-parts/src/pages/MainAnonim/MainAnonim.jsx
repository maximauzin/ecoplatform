import HeaderAnonim from '../../components/HeaderAnonim/HeaderAnonim';
import { catalogPoints, effect } from "../../utils/utils";
import { CardItem } from "../../utils/utils";
import mapPng from '../../assets/map.png';
import Search from "../../components/Search/Search";

export default function MainMap() {
    effect();

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