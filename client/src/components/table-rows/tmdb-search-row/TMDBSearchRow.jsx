import "./tmdbSearchRow.scss";

const TMDBSearchRow = ({ className, onClick, children }) => {
  return (
    <li className={`tmdb-search-row-wrapper ${className}`} onClick={onClick}>
      {children}
    </li>
  );
};

export default TMDBSearchRow;
