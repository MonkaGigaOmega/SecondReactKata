import React, { useState, useEffect } from 'react';
import { Spin, Alert } from 'antd';
import CardItem from './CardItem';
import { format } from 'date-fns';
import './Rated.css';

const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';

const genreIdsToNames = {
  28: 'Боевик',
  12: 'Приключения',
  16: 'Анимация',
  35: 'Комедия',
  80: 'Криминал',
  99: 'Документальный',
  18: 'Драма',
  10751: 'Семейный',
  14: 'Фэнтези',
  36: 'История',
  27: 'Ужасы',
  10402: 'Музыка',
  9648: 'Детектив',
  10749: 'Мелодрама',
  878: 'Фантастика',
  10770: 'Телевизионный фильм',
  53: 'Триллер',
  10752: 'Военный',
  37: 'Вестерн',
};

const truncateText = (text, wordLimit) => {
  const words = text.split(' ');
  if (words.length <= wordLimit) {
    return text;
  }
  return words.slice(0, wordLimit).join(' ') + '...';
};

const Rated = () => {
  const [ratedMovies, setRatedMovies] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchRatedMovies = () => {
      try {
        const cachedMovies = localStorage.getItem('ratedMovies');
        if (cachedMovies) {
          const parsedMovies = JSON.parse(cachedMovies);
          setRatedMovies(parsedMovies);
        } else {
          setError('Вы еще не оценили ни одного фильма.');
        }
      } catch (error) {
        console.error('Ошибка при получении оцененных фильмов:', error);
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRatedMovies();
  }, []);

  const clearLocalStorage = () => {
    localStorage.removeItem('ratedMovies');
    setRatedMovies([]);
    setError('Вы еще не оценили ни одного фильма.');
  };

  return (
    <>
      {error && <Alert message="Ошибка" description={error} type="error" showIcon closable />}
      {isLoading ? (
        <div className="loader">
          <Spin size="large" />
        </div>
      ) : Array.isArray(ratedMovies) && ratedMovies.length > 0 ? (
        <>
          <div className="slide">
            {ratedMovies.map((movie) => {
              if (!movie || !movie.genre_ids) {
                console.error('Invalid movie data:', movie);
                return null;
              }
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
                  genreIds={movie.genre_ids.map((id) => genreIdsToNames[id])}
                  description={truncateText(movie.overview, 50)}
                  rating={movie.rating}
                />
              );
            })}
          </div>
          <div className="rating-button-wrapper">
            <button onClick={clearLocalStorage} type="button" className="rating-button">
              Очистить список
            </button>
          </div>
        </>
      ) : (
        <div className="slide-noFilms">Oops! Вы еще не оценили ни одного фильма.</div>
      )}
    </>
  );
};

export default Rated;
