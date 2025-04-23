import ReactDOM from 'react-dom/client';
import './index.css';
import { Pagination } from 'antd';
import CardItem from './components/CardItem';
import { useState, useEffect, useCallback } from 'react';
import { format } from 'date-fns';
import { Spin, Alert, Rate } from 'antd';
import { Online, Offline } from 'react-detect-offline';
import SearchPanel from './components/SearchPanel';
import { debounce } from 'lodash';
import axios from 'axios';
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

export const createGuestSession = async () => {
  const url = `https://api.themoviedb.org/3/authentication/guest_session/new?api_key=${API_KEY}`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await response.json();
    return data.guest_session_id;
  } catch (error) {
    console.error('Ошибка при создании гостевой сессии:', error);
    throw error;
  }
};

const App = () => {
  const [movies, setMovies] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [filmName, setFilmName] = useState('boy');
  const [guestSessionId, setGuestSessionId] = useState(null);
  const [page, setPage] = useState(1);
  const [totalMovies, setTotalMovies] = useState(0);

  const fetchMoviesByKeyword = useCallback(
    debounce(async (keyword, page) => {
      try {
        setIsLoading(true);
        const response = await fetch(
          `${API_URL}/search/movie?api_key=${API_KEY}&language=ru-RU&query=${keyword}&page=${page}`
        );
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setMovies(data.results);
        setTotalMovies(data.total_results);
        setPage(page);
      } catch (error) {
        console.error('Ошибка при получении данных:', error);
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    }, 800),
    []
  );

  useEffect(() => {
    const initGuestSession = async () => {
      try {
        const sessionId = await createGuestSession();
        setGuestSessionId(sessionId);
      } catch (error) {
        console.error('Ошибка при создании гостевой сессии:', error);
      }
    };

    initGuestSession();
  }, []);

  useEffect(() => {
    if (filmName) {
      fetchMoviesByKeyword(filmName, page);
    }
  }, [filmName, page, fetchMoviesByKeyword]);

  const handleRateChange = async (movieId, value) => {
    const url = `${API_URL}/movie/${movieId}/rating?api_key=${API_KEY}&guest_session_id=${guestSessionId}`;
    try {
      await axios.post(url, { value });
    } catch (error) {
      console.error('Ошибка при отправке рейтинга:', error);
    }
  };

  const handlePageChange = (page) => {
    setPage(page);
    fetchMoviesByKeyword(filmName, page);
  };

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
        ) : movies.length > 0 ? (
          <div className="slide">
            {movies.map((movie) => {
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
                  onRateChange={(value) => handleRateChange(movie.id, value)}
                />
              );
            })}
          </div>
        ) : (
          <div className="slide-noFilms">Oops! Что-то пошло не так или такого фильма не существует.</div>
        )}
        <Pagination
          className="pagination"
          current={page}
          total={totalMovies}
          pageSize={20}
          onChange={handlePageChange}
        />
      </>
    </>
  );
};
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
