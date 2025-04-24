import { createContext, useState, useEffect } from 'react';

const RatedMoviesContext = createContext();

const RatedMoviesProvider = ({ children }) => {
  const [ratedMovies, setRatedMovies] = useState([]);

  useEffect(() => {
    const cachedMovies = localStorage.getItem('ratedMovies');
    if (cachedMovies) {
      setRatedMovies(JSON.parse(cachedMovies));
    }
  }, []);

  const updateRatedMovies = (movies) => {
    setRatedMovies(movies);
    localStorage.setItem('ratedMovies', JSON.stringify(movies));
  };

  return (
    <RatedMoviesContext.Provider value={{ ratedMovies, updateRatedMovies }}>{children}</RatedMoviesContext.Provider>
  );
};

export { RatedMoviesContext, RatedMoviesProvider };
