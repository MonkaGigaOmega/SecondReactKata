import './SearchPanel.css';

export default function SearchPanel({ filmName, setFilmName }) {
  const onFilmNameChange = (e) => {
    setFilmName(e.target.value);
  };

  return (
    <div className="search-panel">
      <input
        className="search-panel__input"
        placeholder="Type to serach..."
        type="text"
        value={filmName}
        autoFocus
        onChange={onFilmNameChange}
      />
    </div>
  );
}
