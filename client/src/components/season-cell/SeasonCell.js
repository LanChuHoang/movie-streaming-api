import { Link } from "react-router-dom";
import Button from "../button/Button";
import "./SeasonCell.scss";

const SeasonCell = (props) => {
  const formatOverview = (overview) => {
    const limit = 250;
    return overview.length <= limit
      ? overview
      : overview.substring(0, limit).trim() + "...";
  };

  const formatRuntime = (minutes) => {
    if (minutes < 60) return `${minutes} mins`;
    const numHours = Math.floor(minutes / 60);
    const numMins = minutes % 60;
    return `${numHours}h ${numMins ? `${numMins} mins` : ""}`;
  };

  const formatAirDate = (date) => {
    return new Date(date).toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };
  console.log(props.item);

  return (
    <Link to={props.item.videoUrl || "/"}>
      <div className="season-cell">
        <div className="thumbnail">
          <img src={props.item.thumbnailUrl} alt="" />
          <Button>
            <i className="bx bx-play"></i>
          </Button>
        </div>

        <div className="itemInfo">
          <div className="miniInfo">
            <span className="episode-span">{`EPISODE ${props.item.episodeNumber}`}</span>
            <span>{formatAirDate(props.item.airDate)}</span>
            <span>{formatRuntime(props.item.runtime)}</span>
          </div>
          <br />
          <label>{props.item.title}</label>
          <p>{formatOverview(props.item.overview)}</p>
        </div>
      </div>
    </Link>
  );
};

export default SeasonCell;
