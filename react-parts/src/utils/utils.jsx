import geoPng from '../assets/geo.png';
import clockPng from '../assets/clock.png';

export const catalogPoints = [
    {
        id: 1,
        title: "Пункт умной переработки",
        rating: 5.0,
        tags: [
            { name: "Бумага", class: "card-type-paper" },
            { name: "Пластик", class: "card-type-plastic" },
            { name: "Стекло", class: "card-type-glass" }
        ],
        address: "Россия, Свердловская область, Екатеринбург, посёлок Большой Шарташский Каменный Карьер, 8",
        hours: "Пн - Вс: 11:00 - 20:00",
        image: geoPng,
        clockImage: clockPng,
        action: false,
        price: "9р/кг",
    },
    {
        id: 2,
        title: "Ярмарка редких вещей 'Полочки'",
        rating: 4.2,
        tags: [
            { name: "Бумага", class: "card-type-paper" }
        ],
        address: "Россия, Свердловская область, Екатеринбург, проспект Ленина, 101",
        hours: "Пн - Вс: 11:00 - 20:00",
        image: geoPng,
        clockImage: clockPng,
        action: false,
        price: "8р/кг",
    },
    {
        id: 3,
        title: "Эко-центр Зелёный'",
        rating: 3.5,
        tags: [
            { name: "Пластик", class: "card-type-plastic" },
            { name: "Стекло", class: "card-type-glass" }
        ],
        address: "Екатеринбург, ул. Экологическая, 25",
        hours: "Пн-Пт: 09:00 - 18:00",
        image: geoPng,
        clockImage: clockPng,
        action: false,
        price: "5р/кг",
    },
    {
        id: 4,
        title: "Контейнер La Roche-Posay для упаковки от косметики в пункте выдачи Lamoda",
        rating: 4.8,
        tags: [
            {name: "Пластик", class: "card-type-plastic"}
        ],
        address: "Россия, Свердловская область, Екатеринбург, ул. Советская, 25",
        hours: "Пн - Вс: 10:00 - 22:00",
        image: geoPng,
        clockImage: clockPng,
        action: false,
        price: "7р/кг",
    },
    {
        id: 5,
        title: "Сбор макулатуры в помощь бездомным животным",
        rating: 5.0,
        tags: [
            {name: "Бумага", class: "card-type-paper"}
        ],
        address: "Россия, Свердловская область, Екатеринбург, метро 'Площадь 1905 года'",
        hours: "Пн - Вс: 12:00 - 17:00",
        image: geoPng,
        clockImage: clockPng,
        action: true,
        price: "6р/кг",
    }
];
