import { Link } from "react-router-dom";
import Button from "../../button/Button";
import "./SeasonCell.scss";

const SeasonCell = ({ item = {} }) => {
  return (
    <Link to={item.videoUrl || "/"}>
      <div className="season-cell">
        <div className="thumbnail">
          {item.thumbnailUrl ? (
            <img src={item.thumbnailUrl} alt={item.title} />
          ) : (
            <DefaultThumbnail />
          )}

          <Button>
            <i className="bx bx-play"></i>
          </Button>
        </div>

        <div className="itemInfo">
          <div className="miniInfo">
            <span className="episode-span">{`EPISODE ${item.episodeNumber}`}</span>
            <span>{formatAirDate(item.airDate)}</span>
            <span>{formatRuntime(item.runtime)}</span>
          </div>
          <br />
          <label>{item.title}</label>
          <p>{formatOverview(item.overview)}</p>
        </div>
      </div>
    </Link>
  );
};

const DefaultThumbnail = () => {
  return (
    <div className="default-thumbnail">
      <i className="bx bxs-movie-play"></i>
    </div>
  );
};

const formatOverview = (overview) => {
  const limit = 250;
  return overview.length <= limit
    ? overview
    : overview.substring(0, limit).trim() + "...";
};

const formatRuntime = (minutes) => {
  if (minutes !== 0 && !minutes) return "";
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

export default SeasonCell;
