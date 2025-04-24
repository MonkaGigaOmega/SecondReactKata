import ReactDOM from 'react-dom/client';
import { Tabs, Alert } from 'antd';
import { useState, useEffect } from 'react';
import SearchTab from './components/SearchTab';
import Rated from './components/Rated';
import { createGuestSession } from './components/createGuestSession';
import { Offline } from 'react-detect-offline';
const App = () => {
  const [guestSessionId, setGuestSessionId] = useState(null);
  const [ratedMovies, setRatedMovies] = useState([]);
  const [error, setError] = useState(null); // Состояние для хранения сообщения об ошибке

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
        setError('Ошибка при создании гостевой сессии. Пожалуйста, включите VPN'); // Устанавливаем сообщение об ошибке
      }
    };

    initGuestSession();
  }, []);

  const updateRatedMovies = (movies) => {
    setRatedMovies(movies);
    localStorage.setItem('ratedMovies', JSON.stringify(movies));
  };

  if (!guestSessionId && !error) {
    return <div>Loading...</div>;
  }

  const items = [
    {
      key: '1',
      label: 'Search',
      children: <SearchTab ratedMovies={ratedMovies} updateRatedMovies={updateRatedMovies} />,
    },
    {
      key: '2',
      label: 'Rated',
      children: <Rated ratedMovies={ratedMovies} updateRatedMovies={updateRatedMovies} />,
    },
  ];

  return (
    <>
      <Offline>
        <Alert message="Отсутствует подключение к интернету." type="error" showIcon />
      </Offline>
      {error && <Alert message="Ошибка" description={error} type="error" showIcon closable />}
      <Tabs defaultActiveKey="1" items={items} />
    </>
  );
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
