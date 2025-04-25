import React, { createContext, useContext, useEffect, useState } from 'react';

const API_KEY = '34c3a46faa654dbc0fab960ecd4f6c31';
const API_URL = 'https://api.themoviedb.org/3';

const GenresContext = createContext();

export function GenresProvider({ children }) {
  const [genreIdsToNames, setGenreIdsToNames] = useState({});

  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const response = await fetch(
          `${API_URL}/genre/movie/list?api_key=${API_KEY}&language=en-US`,
        );
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        const genresMap = data.genres.reduce((acc, genre) => {
          acc[genre.id] = genre.name;
          return acc;
        }, {});
        setGenreIdsToNames(genresMap);
      } catch (error) {
        console.error('Error fetching genres:', error);
      }
    };

    fetchGenres();
  }, []);

  return (
    <GenresContext.Provider value={genreIdsToNames}>
      {children}
    </GenresContext.Provider>
  );
}

export const useGenres = () => useContext(GenresContext);
