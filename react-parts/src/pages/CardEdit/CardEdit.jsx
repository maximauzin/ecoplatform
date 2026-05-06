import { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import BackLink from "../../components/BackLink/BackLink";
import HeaderCream from "../../components/HeaderCream/HeaderCream";
import Input from "../../components/Input/Input";
import { effect } from "../../utils/utils";
import FilterTags from "../../components/FilterTags/FilterTags";
import deleteImg from '../../assets/delete.png';
import deleteHover from '../../assets/deleteHover.png';
import { getPoint, updatePoint, suggestAddress } from '../../api/points';
import { getCategories } from '../../api/waste';
import '../CardAdd/CardAdd.css';

export default function CardEdit() {
    effect();
    const { id } = useParams();
    const navigate = useNavigate();
    const [isHovered, setHovered] = useState(false);
    const [selectedTypes, setSelectedTypes] = useState([]);
    const [categoryMap, setCategoryMap] = useState({});
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    const [suggestions, setSuggestions] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const suggestionRef = useRef(null);

    const [formData, setFormData] = useState({
        title: '',
        address: '',
        hours: '',
        price: '',
        description: '',
    });

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (suggestionRef.current && !suggestionRef.current.contains(event.target)) {
                setShowSuggestions(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    useEffect(() => {
        getCategories()
            .then(cats => {
                const nameToId = {};
                cats.forEach(c => { 
                    nameToId[c.name.toLowerCase()] = c.id; 
                });
                setCategoryMap(nameToId);
            })
            .catch(() => {});
    }, []);

    useEffect(() => {
        if (!id) return;
        getPoint(id)
            .then(point => {
                setFormData({
                    title: point.name || '',
                    address: point.address || '',
                    hours: point.schedule || '',
                    price: '',
                    description: point.description || '',
                });
                const typeNames = (point.waste_categories_detail || []).map(c => c.name);
                setSelectedTypes(typeNames);
            })
            .catch(() => {})
            .finally(() => setIsLoading(false));
    }, [id]);

    const handleChange = async (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));

        if (name === 'address') {
            if (value.length > 2) {
                try {
                    const data = await suggestAddress(value);
                    setSuggestions(data || []);
                    setShowSuggestions(true);
                } catch (err) {
                    console.error('Suggestions error:', err);
                }
            } else {
                setSuggestions([]);
                setShowSuggestions(false);
            }
        }
    };

    const handleSuggestionClick = (suggestion) => {
        setFormData(prev => ({ ...prev, address: suggestion.value }));
        setShowSuggestions(false);
    };

    const toggleType = (typeName) => {
        setSelectedTypes(prev => {
            const next = prev.includes(typeName)
                ? prev.filter(t => t !== typeName)
                : [...prev, typeName];
            return next;
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (selectedTypes.length === 0) {
            setError('Выберите хотя бы одну категорию отходов');
            return;
        }

        const wasteCategoryIds = selectedTypes
            .map(name => categoryMap[name.toLowerCase()])
            .filter(Boolean);

        if (wasteCategoryIds.length === 0) {
            setError('Не удалось загрузить данные категорий. Обновите страницу');
            return;
        }

        const data = new FormData();
        data.append('name', formData.title);
        data.append('address', formData.address);
        data.append('schedule', formData.hours);
        data.append('description', formData.description);
        wasteCategoryIds.forEach(wid => data.append('waste_categories', wid));

        try {
            await updatePoint(id, data);
            navigate('/myPointsList');
        } catch (err) {
            const errData = err.response?.data;
            if (errData) {
                const messages = Object.values(errData).flat();
                setError(messages[0] || 'Ошибка при обновлении пункта');
            } else {
                setError('Ошибка при обновлении пункта');
            }
        }
    };

    if (isLoading) return null;

    return (
        <>
            <HeaderCream />
            <section className="card-add">
                <BackLink className="back-link" />

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

                    <h2>Адрес</h2>
                    <div style={{ position: 'relative' }} ref={suggestionRef}>
                        <Input
                            name="address"
                            value={formData.address}
                            onChange={handleChange}
                            showLabel={false}
                        />
                        {showSuggestions && suggestions.length > 0 && (
                            <ul className="suggestions-list-form">
                                {suggestions.map((s, idx) => (
                                    <li 
                                        key={idx} 
                                        className="suggestion-item-form"
                                        onClick={() => handleSuggestionClick(s)}
                                    >
                                        {s.value}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>

                    <h2>Режим работы</h2>
                    <Input
                        name="hours"
                        value={formData.hours}
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

                    {error && <p style={{ color: 'red', margin: '8px 0' }}>{error}</p>}

                    <button type="submit" className="btn-submit">Сохранить</button>

                    <button
                        type="button"
                        className="delete"
                        onMouseEnter={() => setHovered(true)}
                        onMouseLeave={() => setHovered(false)}
                        onClick={() => navigate(-1)}
                        aria-label="Отмена"
                    >
                        <img src={isHovered ? deleteHover : deleteImg} alt="Отмена" />
                    </button>
                </form>
            </section>
        </>
    );
}
