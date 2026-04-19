import mapCard from '../../assets/mapCard.png';
import './DescriptionPoint.css';

export default function DescriptionPoint() {
    return (
        <>
            <div className="description">
                <h2>Описание точки</h2>
                <p>Проект La Roche-Posay "Несу Перемены" по переработке упаковки из-под косметики любых брендов (<a href="https://www.laroche-posay.ru/eco-project">https://<br></br>www.laroche-posay.ru/eco-project</a>)</p>
                <p>Принимается только чистая упаковка, без остатков косметики.</p>
                <p>Принимаются:</p>
                <ul className="list">
                    <li className="list-item">- пластиковые флаконы и баночки ТОЛЬКО из-под косметики с маркировками 1, 2 и 5;</li>
                    <li className="list-item">- пластиковые тюбики с любой маркировкой без металлизированного слоя;</li>
                    <li className="list-item">- пластиковая мягкая упаковка от рефиллов (пауч) без металлизированного слоя;</li>
                    <li className="list-item">- алюминиевые баллончики (необходимо проткнуть);</li>
                    <li className="list-item">- стеклянные флаконы, кроме ампул;</li>
                    <li className="list-item">- роликовые дезодоранты только с маркировкой 5 ПП/PP (шарик можно не вытаскивать).</li>
                </ul>
                <p>НЕ ПРИНИМАЕТСЯ:</p>
                <ul className="list">
                    <li className="list-item">- упаковка из-под средств бытовой химии, пищевых продуктов, техники и т.п.</li>
                    <li className="list-item">- тюбики от зубной пасты с метализированным слоем!</li>
                    <li className="list-item">- алюминивые тюбики от от кремов и других продуктов</li>
                </ul>
                <p>Узнать, как правильно подготовить тару к переработке <a href="https://www.laroche-posay.ru/kakaya-upakovka-podkhodit-dlya-pererabotki">https://www.laroche-posay.ru/kakaya-upakovka-podkhodit-dlya-pererabotki</a></p>
                <img src={mapCard} />
            </div>
        </>
    )
}