import "./movie-card.scss";
import { Link } from "react-router-dom";
import PlayButton from "../buttons/play-button/PlayButton";
import Overlay from "../overlay/Overlay";

const MovieCard = ({ item, itemType }) => {
  const bg =
    item.posterUrl?.replace("w185", "w500") ||
    item.backdropUrl?.replace("original", "w500") ||
    item.thumbnailUrl;

  return (
    <Link to={`/${itemType}/${item._id}`}>
      <div className="movie-card-container">
        <div className="movie-image-container">
          <img className="swiper-lazy" data-src={bg} alt={item.title} />
          <Overlay />
          <PlayButton />
        </div>
        <h3 className="movie-title">{item.title}</h3>
      </div>
    </Link>
  );
};

export default MovieCard;
