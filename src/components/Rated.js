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
  const roundToHalf = (number) => Math.round(number * 10) / 10;
  const genreIdsToNames = useGenres();

  const handleRateChange = (movieId, value) => {
    const updatedMovies = ratedMovies.map((movie) =>
      movie.id === movieId ? { ...movie, rating: value } : movie,
    );
    updateRatedMovies(updatedMovies);
  };

  return (
    <>
      {ratedMovies.length === 0 ? (
        <div className="slide-noFilms">List of ratings is empty</div>
      ) : (
        <div className="slide">
          {ratedMovies.map((movie) => {
            if (!movie) return null;

            const releaseDate = movie.release_date
              ? format(new Date(movie.release_date), 'MMMM d, yyyy')
              : 'Date unknown';

            return (
              <CardItem
                key={movie.id}
                imgSrc={`${IMAGE_BASE_URL}${movie.poster_path}`}
                imgAlt={movie.title}
                filmTitle={movie.title}
                releaseDate={releaseDate}
                genreIds={(movie.genre_ids || []).map(
                  (id) => genreIdsToNames[id],
                )}
                description={
                  truncateText(movie.overview, 140) || 'No description'
                }
                rating={roundToHalf(movie.vote_average)}
                userRating={movie.rating}
                onRateChange={(value) => handleRateChange(movie.id, value)}
              />
            );
          })}
        </div>
      )}
      <div className="rating-button-wrapper">
        {ratedMovies.length !== 0 && (
          <button
            onClick={clearLocalStorage}
            type="button"
            className="rating-button"
          >
            Clear list
          </button>
        )}
      </div>
    </>
  );
}

export default Rated;
