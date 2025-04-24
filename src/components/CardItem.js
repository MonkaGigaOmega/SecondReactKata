import './CardItem.css';
import React from 'react';
import { Spin, Rate } from 'antd';

export default function CardItem({
  imgSrc,
  imgAlt,
  filmTitle,
  releaseDate,
  genreIds,
  description,
  onRateChange,
  rating: initialRating = 0,
}) {
  const [isLoading, setIsLoading] = React.useState(true);
  const [hasError, setHasError] = React.useState(false);
  const [rating, setRating] = React.useState(initialRating);
  const handleImageLoad = () => setIsLoading(false);
  const handleImageError = () => {
    setIsLoading(false);
    setHasError(true);
  };

  const handleRateChange = (value) => {
    setRating(value); // Обновите локальное состояние
    if (onRateChange) onRateChange(value); // Вызовите обработчик изменения рейтинга
  };

  const getRatingColor = (value) => {
    if (value >= 7) return '#66E900';
    if (value >= 5) return '#E9D100';
    if (value >= 3) return '#E97E00';
    return '#E90000';
  };

  return (
    <div className="cardItem">
      <div className="film-logo-wrapper">
        {isLoading && <Spin />}
        {!hasError && (
          <img
            className="film-logo"
            src={imgSrc}
            alt={imgAlt}
            onLoad={handleImageLoad}
            onError={handleImageError}
            style={{ display: isLoading ? 'none' : 'block' }}
          />
        )}
        {hasError && <div className="film-logo-placeholder">Постера пока нет в нашей базе</div>}
      </div>
      <div className="content">
        <div className="round-rating" style={{ borderColor: getRatingColor(rating) }}>
          {rating}
        </div>
        <h2 className="title">{filmTitle}</h2>
        <div className="release-date">{releaseDate}</div>
        <div className="genre">
          {genreIds?.map((genre, index) => (
            <span key={index} className="genre__item">
              {genre}
            </span>
          ))}
        </div>
        <div className="description">{description}</div>
        <Rate
          allowHalf
          value={rating}
          onChange={handleRateChange}
          count={10}
          style={{ fontSize: '20px', marginTop: 'auto', marginBottom: '10px' }}
          character={({ index }) => (
            <span className="rate-star" style={{ color: index < rating ? getRatingColor(rating) : '#d9d9d9' }}>
              ★
            </span>
          )}
        />
      </div>
    </div>
  );
}
