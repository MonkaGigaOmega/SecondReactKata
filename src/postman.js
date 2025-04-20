const requestOptions = {
  method: 'GET',
  redirect: 'follow',
};

fetch(
  'https://api.themoviedb.org/3/trending/all/day?api_key=34c3a46faa654dbc0fab960ecd4f6c31&api_key=34c3a46faa654dbc0fab960ecd4f6c31',
  requestOptions
)
  .then((response) => response.text())
  .then((result) => console.log(result))
  .catch((error) => console.error(error));
