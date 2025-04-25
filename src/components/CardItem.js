import './CardItem.css';
import { useState } from 'react';
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
  userRating: userStars,
}) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [rating] = useState(initialRating);
  const [userRating, setUserRating] = useState(userStars);
  const handleImageLoad = () => setIsLoading(false);
  const handleImageError = () => {
    setIsLoading(false);
    setHasError(true);
  };
  const handleRateChange = (value) => {
    setUserRating(value);
    if (onRateChange) onRateChange(value);
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
        {hasError && <div className="film-logo-placeholder">No poster</div>}
      </div>
      <div className="content">
        <div className="round-rating" style={{ borderColor: getRatingColor(rating) }}>
          {rating}
        </div>
        <h3 className="title">{filmTitle}</h3>
        <div className="release-date">{releaseDate}</div>
        <div className="genre">
          {genreIds?.map((genre) => (
            <span key={genre.id} className="genre__item">
              {genre}
            </span>
          ))}
        </div>
        <div className="description">{description}</div>
        <Rate
          allowHalf
          defaultValue={userRating}
          onChange={handleRateChange}
          count={10}
          style={{ fontSize: '16px', marginTop: 'auto', marginBottom: '10px' }}
        />
      </div>
    </div>
  );
}
