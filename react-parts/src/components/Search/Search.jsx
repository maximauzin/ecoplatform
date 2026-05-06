import { useState, useEffect, useRef } from 'react';
import searchPng from '../../assets/search.png';
import cameraPng from '../../assets/camera.png';
import { recognizeWaste } from '../../api/waste';
import { suggestAddress } from '../../api/points';
import './Search.css';

export default function Search({ onSearch, items }) {
    const [query, setQuery] = useState('');
    const [selectedTypes, setSelectedTypes] = useState([]);
    const [isRecognizing, setIsRecognizing] = useState(false);
    const [suggestions, setSuggestions] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const suggestionRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (suggestionRef.current && !suggestionRef.current.contains(event.target)) {
                setShowSuggestions(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const applyFilter = (searchQuery, types) => {
        if (!items) return;
        const lowerQuery = searchQuery.toLowerCase().trim();
        const filtered = items.filter(item => {
            const title = (item.title || '').toLowerCase();
            const address = (item.address || '').toLowerCase();
            
            // Smarter matching: 
            // 1. Item title or address contains query
            // 2. Query contains item address (helpful for full address suggestions)
            const matchText = !lowerQuery || 
                title.includes(lowerQuery) || 
                address.includes(lowerQuery) ||
                lowerQuery.includes(address);
            
            const matchType = types.length === 0 ||
                item.tags?.some(tag => types.some(t => t.toLowerCase() === tag.name.toLowerCase()));
            
            return matchText && matchType;
        });
        onSearch?.(filtered);
    };

    const handleCameraClick = () => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        input.onchange = async (e) => {
            const file = e.target.files[0];
            if (!file) return;
            setIsRecognizing(true);
            try {
                const result = await recognizeWaste(file);
                const categories = result.categories || [];
                if (categories.length > 0) {
                    setSelectedTypes(categories);
                    applyFilter(query, categories);
                }
            } catch {
                // ignore
            } finally {
                setIsRecognizing(false);
            }
        };
        input.click();
    };

    const handleSearch = (searchQuery = query) => {
        applyFilter(searchQuery, selectedTypes);
        setShowSuggestions(false);
    };

    const handleInputChange = async (e) => {
        const value = e.target.value;
        setQuery(value);
        applyFilter(value, selectedTypes);

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
    };

    const handleSuggestionClick = (suggestion) => {
        const value = suggestion.value;
        setQuery(value);
        setShowSuggestions(false);
        applyFilter(value, selectedTypes);
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') handleSearch();
    };

    const toggleType = (typeName) => {
        const newTypes = selectedTypes.includes(typeName)
            ? selectedTypes.filter(t => t !== typeName)
            : [...selectedTypes, typeName];
        setSelectedTypes(newTypes);
        applyFilter(query, newTypes);
    };

    const resetAll = () => {
        setQuery('');
        setSelectedTypes([]);
        setSuggestions([]);
        setShowSuggestions(false);
        onSearch?.(items);
    };

    const typeClassMap = {
        'Бумага': 'tag-paper',
        'Пластик': 'tag-plastic',
        'Стекло': 'tag-glass',
    };

    return (
        <div className="search-wrapper">
            <div className="search-container" ref={suggestionRef}>
                <input
                    type="text"
                    className="search-input"
                    placeholder="Поиск"
                    value={query}
                    onChange={handleInputChange}
                    onKeyPress={handleKeyPress}
                    onFocus={() => query.length > 2 && suggestions.length > 0 && setShowSuggestions(true)}
                />
                <div className="search-icons">
                    <button
                        className="icon-btn"
                        onClick={handleCameraClick}
                        aria-label="Поиск по фото"
                        disabled={isRecognizing}
                        style={{ opacity: isRecognizing ? 0.5 : 1 }}
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

                {showSuggestions && suggestions.length > 0 && (
                    <ul className="suggestions-list">
                        {suggestions.map((s, idx) => (
                            <li 
                                key={idx} 
                                className="suggestion-item"
                                onClick={() => handleSuggestionClick(s)}
                            >
                                {s.value}
                            </li>
                        ))}
                    </ul>
                )}
            </div>

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
