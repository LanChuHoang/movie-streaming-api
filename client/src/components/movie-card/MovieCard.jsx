import React from "react";
import "./movie-card.scss";
import { Link } from "react-router-dom";
import Button from "../button/Button";

const MovieCard = (props) => {
  const item = props.item;
  const link = `/${props.itemType}/${item._id}/detail`;
  // console.log(link);
  const bg =
    item.posterUrl?.replace("w185", "w500") ||
    item.backdropUrl?.replace("original", "w500") ||
    item.thumbnailUrl;

  return (
    <Link to={link}>
      <div className="movie-card" style={{ backgroundImage: `url(${bg})` }}>
        <Button>
          <i className="bx bx-play"></i>
        </Button>
      </div>
      <h3>{item.title}</h3>
    </Link>
  );
};

export default MovieCard;
