import HeaderCream from "../../components/HeaderCream/HeaderCream";
import Feedback from "../../components/Feedback/Feedback";
import { effect } from "../../utils/utils";
import BackLink from "../../components/BackLink/BackLink";

import './CardPoint.css'
import CardMore from "../../components/CardMore/CardMore";

export default function CardPoint() {
    effect();

    return (
        <>
            <HeaderCream />
            <section className="card-point">
                <BackLink />
                <CardMore />
                <Feedback />
            </section>
        </>
    )
}