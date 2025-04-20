import './CardItem.css';
import React, { useState } from 'react';
import { Spin } from 'antd';

export default function CardItem({ imgSrc, imgAlt, filmTitle, releaseDate, genreIds, description }) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  // const [cardInfo, setCardInfo] = useState({
  //   imgSrc: null,
  //   imgAlt: null,
  //   filmTitle: null,
  //   releaseDate: null,
  //   genreIds: [],
  //   description: null,
  // });
  // setCardInfo({});
  const handleImageLoad = () => {
    setIsLoading(false);
  };
  const handleImageError = () => {
    setIsLoading(false);
    setHasError(true);
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
      </div>
    </div>
  );
}
