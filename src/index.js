import ReactDOM from 'react-dom/client';
import './index.css';
import { Tabs, Alert } from 'antd';
import { useState, useEffect } from 'react';
import { Offline } from 'react-detect-offline';

import SearchTab from './components/SearchTab';
import Rated from './components/Rated';
import { createGuestSession } from './components/createGuestSession';
import { GenresProvider } from './components/GenresContext';

function App() {
  const [guestSessionId, setGuestSessionId] = useState(null);
  const [ratedMovies, setRatedMovies] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const initGuestSession = async () => {
      try {
        const sessionId = await createGuestSession();
        setGuestSessionId(sessionId);

        const cachedMovies = localStorage.getItem('ratedMovies');
        if (cachedMovies) {
          setRatedMovies(JSON.parse(cachedMovies));
        }
      } catch (error) {
        setError('Ошибка при создании гостевой сессии. Пожалуйста, включите VPN');
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
  const truncateText = (text, charLimit) => {
    if (text.length <= charLimit) {
      return text;
    }
    const truncated = text.slice(0, charLimit);
    const lastSpaceIndex = truncated.lastIndexOf(' ');
    if (lastSpaceIndex !== -1) {
      return `${truncated.slice(0, lastSpaceIndex)}...`;
    }
    return `${truncated}...`;
  };

  const items = [
    {
      key: '1',
      label: 'Search',
      children: (
        <SearchTab ratedMovies={ratedMovies} updateRatedMovies={updateRatedMovies} truncateText={truncateText} />
      ),
    },
    {
      key: '2',
      label: 'Rated',
      children: <Rated ratedMovies={ratedMovies} updateRatedMovies={updateRatedMovies} truncateText={truncateText} />,
    },
  ];

  return (
    <GenresProvider>
      <Offline>
        <Alert message="Отсутствует подключение к интернету." type="error" showIcon />
      </Offline>
      {error && <Alert message="Ошибка" description={error} type="error" showIcon closable />}
      <Tabs defaultActiveKey="1" items={items} centered />
    </GenresProvider>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
