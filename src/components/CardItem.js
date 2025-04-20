import './CardItem.css';

export default function CardItem({ imgSrc, imgAlt, filmTitle, releaseDate, genreIds, description }) {
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
      <img className="film-logo" src={imgSrc} alt={imgAlt} />
      <div className="content">
        <h2 className="title">{filmTitle}</h2>
        <div className="release-date">{releaseDate}</div>
        <div className="genre">
          {genreIds.map((genre, index) => (
            <span key={index} className="genre__item">
              {genre}
            </span>
          ))}
        </div>
        <div className="description">{description}</div>
      </div>
    </div>
  );
}
