import ReactDOM from 'react-dom/client';
import { DatePicker } from 'antd';
import './index.css';
import CardItem from './components/CardItem';
function App() {
  return (
    <>
      <div className="slide">
        <CardItem />
        <CardItem />
        <CardItem />
        <CardItem />
        <CardItem />
        <CardItem />
      </div>
    </>
  );
}
// const requestOptions = {
//   method: 'GET',
//   redirect: 'follow',
// };

// fetch(
//   'https://api.themoviedb.org/3/movie/11?append_to_response=videos&api_key=34c3a46faa654dbc0fab960ecd4f6c31',
//   requestOptions
// )
//   .then((response) => response.text())
//   .then((result) => console.log(result))
//   .catch((error) => console.error(error));

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
