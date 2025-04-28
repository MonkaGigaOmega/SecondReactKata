import './SearchTab.css';
import { Pagination, Spin, Alert } from 'antd';
import { useState, useEffect, useRef } from 'react';
import { format } from 'date-fns';
import { debounce } from 'lodash';
import { Offline } from 'react-detect-offline';
import SearchPanel from './SearchPanel';
import CardItem from './CardItem';
import { useGenres } from './GenresContext';

const API_KEY = '34c3a46faa654dbc0fab960ecd4f6c31';
const API_URL = 'https://api.themoviedb.org/3';
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';

function SearchTab({ updateRatedMovies, truncateText }) {
  const [movies, setMovies] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [filmName, setFilmName] = useState('');
  const [page, setPage] = useState(1);
  const [totalMovies, setTotalMovies] = useState(0);
  const [userRating] = useState(0);

  const fetchMovies = async (keyword, page) => {
    const endpoint = keyword ? 'search/movie' : 'movie/popular';
    const query = keyword ? `&query=${keyword}` : '';

    try {
      setIsLoading(true);
      const response = await fetch(
        `${API_URL}/${endpoint}?api_key=${API_KEY}&language=en-EN${query}&page=${page}`,
      );
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      setMovies(data.results);
      setTotalMovies(data.total_results);
      setPage(page);
    } catch (error) {
      setError('Fetch request failed. Turn on VPN or refresh the page.');
    } finally {
      setIsLoading(false);
    }
  };

  const debouncedFetch = useRef(
    debounce((keyword, page) => {
      fetchMovies(keyword, page);
    }, 800),
  ).current;

  useEffect(() => {
    if (filmName) {
      debouncedFetch(filmName, 1);
    } else {
      fetchMovies('', page);
    }
  }, [debouncedFetch, filmName]);

  useEffect(() => {
    if (filmName) {
      fetchMovies(filmName, page);
    } else {
      fetchMovies('', page);
    }
  }, [page]);

  const handleRateChange = (movie, value) => {
    const cachedMovies = JSON.parse(localStorage.getItem('ratedMovies')) || [];
    const updatedMovies = cachedMovies.some(
      (cachedMovie) => cachedMovie.id === movie.id,
    )
      ? cachedMovies.map((cachedMovie) =>
          cachedMovie.id === movie.id
            ? { ...cachedMovie, rating: value }
            : cachedMovie,
        )
      : [...cachedMovies, { ...movie, rating: value }];
    updateRatedMovies(updatedMovies);
  };

  const roundToHalf = (number) => Math.round(number * 10) / 10;

  const handlePageChange = (page) => {
    setPage(page);
  };

  const genreIdsToNames = useGenres();

  return (
    <>
      <Offline>
        <Alert
          message="No internet connection."
          type="error"
          showIcon
          className="network-error"
        />
      </Offline>
      {error && (
        <Alert
          message="Ошибка"
          description={error}
          type="error"
          showIcon
          closable
        />
      )}
      <>
        <SearchPanel filmName={filmName} setFilmName={setFilmName} />
        {isLoading && filmName.length > 0 ? (
          <div className="loader">
            <Spin size="large" />
          </div>
        ) : movies.length > 0 ? (
          <div className="slide">
            {movies.map((movie) => {
              const releaseDate = movie.release_date
                ? format(new Date(movie.release_date), 'MMMM d, yyyy')
                : 'Дата неизвестна';
              const genreIds =
                movie.genre_ids
                  ?.map((id) => genreIdsToNames[id])
                  .filter(Boolean) || [];
              return (
                <CardItem
                  key={movie.id}
                  imgSrc={`${IMAGE_BASE_URL}${movie.poster_path}`}
                  imgAlt={movie.title}
                  filmTitle={movie.title}
                  releaseDate={releaseDate}
                  genreIds={genreIds}
                  description={
                    truncateText(movie.overview, 140).length !== 0
                      ? truncateText(movie.overview, 140)
                      : 'No description'
                  }
                  rating={roundToHalf(movie.vote_average)}
                  userRating={userRating}
                  onRateChange={(value) => handleRateChange(movie, value)}
                />
              );
            })}
          </div>
        ) : (
          <div className="slide-noFilms">
            {filmName.length > 0
              ? 'Oops! Something went wrong or this movie doesn&apos;t exist.'
              : 'Write the name of the movie.'}
          </div>
        )}
        <Pagination
          className="pagination"
          current={page}
          total={totalMovies}
          defaultPageSize={20}
          onChange={handlePageChange}
          showSizeChanger={false}
        />
      </>
    </>
  );
}

export default SearchTab;
