import ReactDOM from 'react-dom/client';
import { Tabs } from 'antd';
import { useState, useEffect } from 'react';
import SearchTab from './components/SearchTab';
import Rated from './components/Rated';
import { createGuestSession } from './components/createGuestSession'; // Обновленный импорт

const App = () => {
  const [guestSessionId, setGuestSessionId] = useState(null);
  const [ratedMovies, setRatedMovies] = useState([]);

  useEffect(() => {
    const initGuestSession = async () => {
      try {
        const sessionId = await createGuestSession();
        setGuestSessionId(sessionId);
        console.log(sessionId);

        // Загружаем оцененные фильмы из localStorage при инициализации
        const cachedMovies = localStorage.getItem('ratedMovies');
        if (cachedMovies) {
          setRatedMovies(JSON.parse(cachedMovies));
        }
      } catch (error) {
        console.error('Ошибка при создании гостевой сессии:', error);
      }
    };

    initGuestSession();
  }, []);

  const updateRatedMovies = (movies) => {
    setRatedMovies(movies);
    localStorage.setItem('ratedMovies', JSON.stringify(movies));
  };

  if (!guestSessionId) {
    return <div>Loading...</div>;
  }

  const items = [
    {
      key: '1',
      label: 'Search',
      children: <SearchTab updateRatedMovies={updateRatedMovies} />,
    },
    {
      key: '2',
      label: 'Rated',
      children: <Rated ratedMovies={ratedMovies} updateRatedMovies={updateRatedMovies} />,
    },
  ];

  return <Tabs defaultActiveKey="1" items={items} />;
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
