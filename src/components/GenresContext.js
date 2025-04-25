import React, { createContext, useContext } from 'react'

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
}

const GenresContext = createContext()

export function GenresProvider({ children }) {
  return <GenresContext.Provider value={genreIdsToNames}>{children}</GenresContext.Provider>
}

export const useGenres = () => useContext(GenresContext)
