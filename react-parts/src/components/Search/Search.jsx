import searchPng from '../../assets/search.png';
import cameraPng from '../../assets/camera.png';
import './Search.css';

export default function Search() {
    return (
        <div className="search-container">
            <input 
                type="text" 
                className="search-input" 
                placeholder="Поиск" 
            />
            <div className="search-icons">
                <img src={cameraPng} alt="Поиск по фото" width="31px" height="24px"/>
                <img src={searchPng} alt="Найти" />
            </div>
        </div>
    );
}