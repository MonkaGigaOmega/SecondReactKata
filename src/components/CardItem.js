import './CardItem.css';
import React, { useState } from 'react';
import { Spin, Rate } from 'antd';

export default function CardItem({ imgSrc, imgAlt, filmTitle, releaseDate, genreIds, description, onRateChange }) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [rating, setRating] = useState(0);

  const handleImageLoad = () => {
    setIsLoading(false);
  };
  const handleImageError = () => {
    setIsLoading(false);
    setHasError(true);
  };

  const handleRateChange = (value) => {
    setRating(value);
    if (onRateChange) {
      onRateChange(value);
    }
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
        <div className="round-rating">{rating}</div>
        <h2 className="title">{filmTitle}</h2>
        <div className="release-date">{releaseDate}</div>
        <div className="genre">
          {genreIds.map((genre, index) => (
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
