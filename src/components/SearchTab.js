import './SearchTab.css';
import { Pagination, Spin, Alert } from 'antd';
import { useState, useEffect, useRef } from 'react';
import { format } from 'date-fns';
import { debounce } from 'lodash';

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
  const [filmName, setFilmName] = useState('return');
  const [page, setPage] = useState(1);
  const [totalMovies, setTotalMovies] = useState(0);
  const [userRating] = useState(0);
  const fetchMoviesByKeyword = async (keyword, page) => {
    try {
      setIsLoading(true);
      const response = await fetch(
        `${API_URL}/search/movie?api_key=${API_KEY}&language=en-EN&query=${keyword}&page=${page}`,
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

  const debouncedFetch = useRef(debounce(fetchMoviesByKeyword, 800)).current;

  useEffect(() => {
    if (filmName) {
      debouncedFetch(filmName, page);
    }
  }, [debouncedFetch, filmName, page]);

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
    fetchMoviesByKeyword(filmName, page);
  };
  const genreIdsToNames = useGenres();
  return (
    <>
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
        {isLoading ? (
          filmName.length > 0 ? (
            <div className="loader">
              <Spin size="large" />
            </div>
          ) : (
            <div className="slide-noFilms">Write the name of the movie.</div>
          )
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
            Oops! Something went wrong or this movie doesn&apos;t exist.
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
