import './SearchPanel.css';

export default function SearchPanel({ filmName, setFilmName }) {
  const onFilmNameChange = (e) => {
    setFilmName(e.target.value);
  };

  return (
    <input
      className="search-panel"
      placeholder="Type to search..."
      type="text"
      value={filmName}
      onChange={onFilmNameChange}
    />
  );
}
