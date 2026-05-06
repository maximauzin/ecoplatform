import './FilterTags.css';

const TYPES = [
  { name: 'Бумага', activeClass: 'tag-paper' },
  { name: 'Пластик', activeClass: 'tag-plastic' },
  { name: 'Стекло', activeClass: 'tag-glass' }
];

export default function FilterTags({ selectedTypes = [], onToggle }) {
  return (
    <div className="filter-tags">
      {TYPES.map(tag => {
        const isActive = selectedTypes.includes(tag.name);
        return (
          <button
            key={tag.name}
            type="button"
            className={`filter-btn ${tag.activeClass} ${isActive ? 'active' : ''}`}
            onClick={() => onToggle(tag.name)}
          >
            {tag.name}
          </button>
        );
      })}
    </div>
  );
}