import React from 'react';
import { format } from 'date-fns';

import CardItem from './CardItem';
import './Rated.css';
import { useGenres } from './GenresContext';

const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';

function Rated({ ratedMovies, updateRatedMovies, truncateText }) {
  const clearLocalStorage = () => {
    updateRatedMovies([]);
  };

  const genreIdsToNames = useGenres();

  const handleRateChange = (movieId, value) => {
    const updatedMovies = ratedMovies.map((movie) => (movie.id === movieId ? { ...movie, rating: value } : movie));
    updateRatedMovies(updatedMovies);
  };

  return (
    <>
      {ratedMovies.length === 0 ? (
        <div className="slide-noFilms">Список оценок пуст.</div>
      ) : (
        <div className="slide">
          {ratedMovies.map((movie) => {
            if (!movie) return null;

            const releaseDate = movie.release_date
              ? format(new Date(movie.release_date), 'MMMM d, yyyy')
              : 'Дата неизвестна';

            return (
              <CardItem
                key={movie.id}
                imgSrc={`${IMAGE_BASE_URL}${movie.poster_path}`}
                imgAlt={movie.title}
                filmTitle={movie.title}
                releaseDate={releaseDate}
                genreIds={(movie.genre_ids || []).map((id) => genreIdsToNames[id])}
                description={truncateText(movie.overview, 140) || 'Описание отсутствует'}
                rating={movie.rating || 0}
                userRating={movie.rating} // Передаем movie.rating как userRating
                onRateChange={(value) => handleRateChange(movie.id, value)}
              />
            );
          })}
        </div>
      )}
      <div className="rating-button-wrapper">
        {ratedMovies.length !== 0 && (
          <button onClick={clearLocalStorage} type="button" className="rating-button">
            Очистить список
          </button>
        )}
      </div>
    </>
  );
}

export default Rated;
