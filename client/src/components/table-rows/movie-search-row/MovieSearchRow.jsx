import "./movieSearchRow.scss";
import TMDBSearchRow from "../tmdb-search-row/TMDBSearchRow";

const MovieSearchRow = ({ posterUrl, title, subTitle, onClick }) => {
  return (
    <TMDBSearchRow className="movie-search-row-container" onClick={onClick}>
      <div className="movie-search-row-image-wrapper">
        <img src={posterUrl} alt="poster" />
      </div>
      <div className="movie-search-row-detail-wrapper">
        <p className="movie-search-row-title">{title}</p>
        <p className="movie-search-row-sub-title">{subTitle}</p>
      </div>
    </TMDBSearchRow>
  );
};

export default MovieSearchRow;
