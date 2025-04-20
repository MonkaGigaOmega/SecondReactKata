import './CardItem.css';
import { useState } from 'react';

export default function CardItem() {
  // const [cardInfo, setCardInfo] = useState({
  //   imgSrc: null,
  //   imgAlt: null,
  //   filmTitle: null,
  //   releaseDate: null,
  //   genreIds: [],
  //   description: null,
  // });
  // setCardInfo({});
  return (
    <div className="cardItem">
      <img
        className="film-logo"
        src="https://i.pinimg.com/236x/ee/8c/9f/ee8c9f9e9a91ae6f361d388c58da22bd.jpg"
        alt="poster film"
      />
      <div className="content">
        <h2 className="title">Лололошка ушел с ютуба</h2>
        <div className="release-date">March 333, 2077</div>
        <div className="genre">
          <span className="genre__item">Драма</span>
          <span className="genre__item">Треш</span>
        </div>
        <div className="description">
          Lololoshka вики — это сообщество Фэндома на портале Увлечения. Полная версия. Company Logo. Privacy Preference
          Center. When you visit any website, it may store ...
        </div>
      </div>
    </div>
  );
}
