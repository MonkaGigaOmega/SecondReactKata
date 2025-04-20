import ReactDOM from 'react-dom/client';
import './index.css';
import { Pagination } from 'antd';
import CardItem from './components/CardItem';
import { useState, useEffect, useCallback } from 'react';
import { format } from 'date-fns';
import { Spin, Alert } from 'antd';
import { Online, Offline } from 'react-detect-offline';
import SearchPanel from './components/SearchPanel';
import { debounce } from 'lodash';
const API_KEY = '34c3a46faa654dbc0fab960ecd4f6c31';
const API_URL = 'https://api.themoviedb.org/3';
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

const App = () => {
  const [movies, setMovies] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [filmName, setFilmName] = useState('boy');
  const fetchMoviesByKeyword = useCallback(
    debounce(async (keyword) => {
      try {
        setIsLoading(true);
        const response = await fetch(`${API_URL}/search/movie?api_key=${API_KEY}&language=ru-RU&query=${keyword}`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setMovies(data.results);
      } catch (error) {
        console.error('Ошибка при получении данных:', error);
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    }, 300),
    []
  );

  useEffect(() => {
    if (filmName) {
      fetchMoviesByKeyword(filmName);
    }
  }, [filmName, fetchMoviesByKeyword]);

  const displayedMovies = movies.slice(0, 6);
  return (
    <>
      <Offline>
        <Alert message="Отсутствует подключение к интернету" type="error" showIcon />
      </Offline>
      {error && <Alert message="Ошибка" description={error} type="error" showIcon closable />}
      <>
        <SearchPanel filmName={filmName} setFilmName={setFilmName} />
        {isLoading ? (
          <div className="loader">
            <Spin size="large" />
          </div>
        ) : displayedMovies.length > 0 ? (
          <div className="slide">
            {displayedMovies.map((movie) => {
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
                  description={truncateText(movie.overview, 20)}
                />
              );
            })}
          </div>
        ) : (
          <div className="slide-noFilms">
            Oops! It seems you typed something incorrectly or such a movie does not exist.
          </div>
        )}
        <Pagination className="pagination" defaultCurrent={1} total={50} />;
      </>
    </>
  );
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
