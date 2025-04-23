import ReactDOM from 'react-dom/client';
import { Tabs } from 'antd';
import { useState, useEffect } from 'react';
import SearchTab from './components/SearchTab';
import Rated from './components/Rated';
import { createGuestSession } from './components/SearchTab';

const App = () => {
  const [guestSessionId, setGuestSessionId] = useState(null);

  useEffect(() => {
    const initGuestSession = async () => {
      try {
        const sessionId = await createGuestSession();
        setGuestSessionId(sessionId);
        console.log(sessionId);
      } catch (error) {
        console.error('Ошибка при создании гостевой сессии:', error);
      }
    };

    initGuestSession();
  }, []);

  if (!guestSessionId) {
    return <div>Loading...</div>; // Показываем загрузку, пока guestSessionId не инициализирован
  }

  const items = [
    {
      key: '1',
      label: 'Search',
      children: <SearchTab />,
    },
    {
      key: '2',
      label: 'Rated',
      children: <Rated />,
    },
  ];

  return <Tabs defaultActiveKey="1" items={items} />;
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
