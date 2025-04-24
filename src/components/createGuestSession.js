const API_KEY = '34c3a46faa654dbc0fab960ecd4f6c31';

export const createGuestSession = async () => {
  const url = `https://api.themoviedb.org/3/authentication/guest_session/new?api_key=${API_KEY}`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await response.json();
    return data.guest_session_id;
  } catch (error) {
    console.error('Ошибка при создании гостевой сессии:', error);
    throw error;
  }
};
