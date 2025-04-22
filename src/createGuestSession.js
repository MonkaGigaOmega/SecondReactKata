import axios from 'axios';

export const createGuestSession = async () => {
  const apiKey = process.env.REACT_APP_API_KEY;
  const url = `https://api.themoviedb.org/3/authentication/guest_session/new?api_key=${apiKey}`;

  try {
    const response = await axios.get(url);
    return response.data.guest_session_id;
  } catch (error) {
    console.error('Ошибка при создании гостевой сессии:', error);
    throw error;
  }
};
