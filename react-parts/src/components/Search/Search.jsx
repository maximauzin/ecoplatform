import { useState } from 'react';
import searchPng from '../../assets/search.png';
import cameraPng from '../../assets/camera.png';
import './Search.css';

export default function Search({ onSearch, items }) {
    const [query, setQuery] = useState('');
    const [selectedTypes, setSelectedTypes] = useState([]);

    const handleCameraClick = () => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        input.onchange = (e) => {
            const file = e.target.files[0];
            if (file) {
                console.log('Выбран файл:', file);
            }
        };
        input.click();
    };

    const handleSearch = (searchQuery = query) => {
        if (!items) return;

        const filtered = items.filter(item => {
            const searchText = `${item.title} ${item.address}`.toLowerCase();
            const matchText = searchText.includes(searchQuery.toLowerCase());
            
            const matchType = selectedTypes.length === 0 || 
                             item.tags?.some(tag => selectedTypes.includes(tag.name));

            return matchText && matchType;
        });

        onSearch?.(filtered);
    };

    // Обработка ввода
    const handleInputChange = (e) => {
        const value = e.target.value;
        setQuery(value);
        handleSearch(value);
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    };

    const toggleType = (typeName) => {
        const newTypes = selectedTypes.includes(typeName)
            ? selectedTypes.filter(t => t !== typeName)
            : [...selectedTypes, typeName];
        
        setSelectedTypes(newTypes);
        
        if (!items) return;
        const filtered = items.filter(item => {
            const searchText = `${item.title} ${item.address}`.toLowerCase();
            const matchText = searchText.includes(query.toLowerCase());
            const matchType = newTypes.length === 0 || 
                             item.tags?.some(tag => newTypes.includes(tag.name));
            return matchText && matchType;
        });
        onSearch?.(filtered);
    };

    const resetAll = () => {
        setQuery('');
        setSelectedTypes([]);
        onSearch?.(items);
    };

    const typeClassMap = {
        'Бумага': 'tag-paper',
        'Пластик': 'tag-plastic',
        'Стекло': 'tag-glass'
    };

    return (
        <div className="search-wrapper">
            <div className="search-container">
                <input 
                    type="text" 
                    className="search-input" 
                    placeholder="Поиск"
                    value={query}
                    onChange={handleInputChange}
                    onKeyPress={handleKeyPress}
                />
                <div className="search-icons">
                    <button 
                        className="icon-btn"
                        onClick={handleCameraClick}
                        aria-label="Поиск по фото"
                    >
                        <img src={cameraPng} alt="Камера" />
                    </button>
                    <button 
                        className="icon-btn"
                        onClick={() => handleSearch()}
                        aria-label="Найти"
                    >
                        <img src={searchPng} alt="Поиск" />
                    </button>
                </div>
            </div>

            {/* Фильтры по типу */}
            <div className="type-filters">
                {['Бумага', 'Пластик', 'Стекло'].map(type => (
                    <button
                        key={type}
                        className={`type-tag ${typeClassMap[type]} ${selectedTypes.includes(type) ? 'active' : ''}`}
                        onClick={() => toggleType(type)}
                    >
                        {type}
                    </button>
                ))}
                {selectedTypes.length > 0 && (
                    <button className="type-reset" onClick={resetAll}>
                        Сбросить
                    </button>
                )}
            </div>
        </div>
    );
}