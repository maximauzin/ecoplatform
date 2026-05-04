import BackLink from "../../components/BackLink/BackLink";
import HeaderCream from "../../components/HeaderCream/HeaderCream";
import Input from "../../components/Input/Input";
import { effect } from "../../utils/utils";
import { useState, useEffect } from "react";
import './CardAdd.css';
import FilterTags from "../../components/FilterTags/FilterTags";
import deleteImg from '../../assets/delete.png';
import deleteHover from '../../assets/deleteHover.png';

export default function CardAdd() {
    effect();
    const [isHovered, setHovered] = useState(false);

    // === Состояние фильтров (тегов) ===
    const [selectedTypes, setSelectedTypes] = useState(() => {
        const saved = localStorage.getItem('selectedTypes');
        return saved ? JSON.parse(saved) : [];
    });

    useEffect(() => {
        localStorage.setItem('selectedTypes', JSON.stringify(selectedTypes));
    }, [selectedTypes]);

    const toggleType = (typeName) => {
        setSelectedTypes(prev =>
            prev.includes(typeName)
                ? prev.filter(t => t !== typeName)
                : [...prev, typeName]
        );
    };

    // === Состояние всех инпутов формы ===
    const [formData, setFormData] = useState({
        title: '',           // Название пункта
        materials: '',       // (опционально, если нужно)
        promoTitle: '',      // Заголовок акции
        promoText: '',       // Текст объявления
        address: '',         // Адрес
        hours: '',           // Режим работы
        price: '',           // Цена
        description: ''      // Описание точки
    });

    // ✅ Проверяем: заполнено ли ХОТЯ БЫ ОДНО поле
    const hasValue = Object.values(formData).some(val => val.trim() !== '');

    // Обработчик изменений для всех инпутов
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    // Очистка всех полей
    const handleClearAll = () => {
        setFormData({
            title: '',
            materials: '',
            promoTitle: '',
            promoText: '',
            address: '',
            hours: '',
            price: '',
            description: ''
        });
        // Опционально: сбросить фильтры
        // setSelectedTypes([]);
    };

    // Отправка формы
    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Отправка формы:', { ...formData, selectedTypes });
        // Здесь логика сохранения (API, контекст и т.д.)
    };

    return (
        <>
            <HeaderCream />
            <section className="card-add">
                <BackLink 
                    className="back-link"
                />
                
                <form onSubmit={handleSubmit}>
                    <h2>Название пункта переработки</h2>
                    <Input 
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        showLabel={false}
                    />
                    
                    <h2>Материалы для переработки</h2>
                    <FilterTags 
                        selectedTypes={selectedTypes} 
                        onToggle={toggleType} 
                    />
                    
                    <h2>Добавьте акцию или сделайте объявление (не обязательно)</h2>
                    <Input
                        name="promoTitle"
                        value={formData.promoTitle}
                        onChange={handleChange}
                        label="Заголовок"
                    />
                    <Input
                        name="promoText"
                        value={formData.promoText}
                        onChange={handleChange}
                        label="Текст объявления"
                    />
                    
                    <h2>Адрес</h2>
                    <Input
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        showLabel={false}
                    />
                    
                    <h2>Режим работы</h2>
                    <Input
                        name="hours"
                        value={formData.hours}
                        onChange={handleChange}
                        showLabel={false}
                    />
                    
                    <h2>Цена (не обязательно)</h2>
                    <Input
                        name="price"
                        value={formData.price}
                        onChange={handleChange}
                        showLabel={false}
                    />
                    
                    <h2>Описание точки</h2>
                    <Input
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        label="Укажите, как подготовить сырьё для сдачи, как пройти к пункту и другую информацию"
                    />

                    {/* Кнопка отправки */}
                    <button type="submit" className="btn-submit">Сохранить</button>
                    
                    {/* Кнопка очистки — появляется только если есть заполненные поля */}
                    {hasValue && (
                        <button 
                            type="button"
                            className="delete"
                            onClick={handleClearAll}
                            onMouseEnter={() => setHovered(true)}
                            onMouseLeave={() => setHovered(false)}
                            aria-label="Очистить форму"
                        >
                            <img 
                                src={isHovered ? deleteHover : deleteImg} 
                                alt="Очистить" 
                            />
                        </button>
                    )}
                </form>
            </section>
        </>
    );
}