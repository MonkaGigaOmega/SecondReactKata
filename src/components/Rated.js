import React from 'react';
import { Spin } from 'antd';
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

const Rated = ({ ratedMovies, updateRatedMovies }) => {
  const clearLocalStorage = () => {
    updateRatedMovies([]);
  };

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
                description={truncateText(movie.overview, 33) || 'Описание отсутствует'}
                rating={movie.rating || 0} // Передаем текущий рейтинг
                onRateChange={(value) => handleRateChange(movie.id, value)} // Добавляем обработчик изменения рейтинга
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
};

export default Rated;
