import ReactDOM from 'react-dom/client';
import { DatePicker } from 'antd';
import './index.css';
import CardItem from './components/CardItem';
import { useState, useEffect } from 'react';
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

  useEffect(() => {
    const fetchMoviesByKeyword = async (keyword) => {
      try {
        const response = await fetch(`${API_URL}/search/movie?api_key=${API_KEY}&language=ru-RU&query=${keyword}`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setMovies(data.results);
      } catch (error) {
        console.error('Ошибка при получении данных:', error);
      }
    };

    fetchMoviesByKeyword('return');
  }, []);

  const displayedMovies = movies.slice(0, 6);
  return (
    <>
      <div className="slide">
        {displayedMovies.map((movie) => (
          <CardItem
            key={movie.id}
            imgSrc={`${IMAGE_BASE_URL}${movie.poster_path}`}
            imgAlt={movie.title}
            filmTitle={movie.title}
            releaseDate={movie.release_date}
            genreIds={movie.genre_ids.map((id) => genreIdsToNames[id])}
            description={truncateText(movie.overview, 20)}
          />
        ))}
      </div>
    </>
  );
};
// const requestOptions = {
//   method: 'GET',
//   redirect: 'follow',
// };

// fetch(
//   'https://api.themoviedb.org/3/movie/11?append_to_response=videos&api_key=34c3a46faa654dbc0fab960ecd4f6c31',
//   requestOptions
// )
//   .then((response) => response.text())
//   .then((result) => console.log(result))
//   .catch((error) => console.error(error));

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
