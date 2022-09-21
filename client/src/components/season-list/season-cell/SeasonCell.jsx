import { Link } from "react-router-dom";
import PlayButton from "../../buttons/play-button/PlayButton";
import FallbackImage from "../../fallback-image/FallbackImage";
import Overlay from "../../overlay/Overlay";
import "./SeasonCell.scss";

const SeasonCell = ({ item = {} }) => {
  return (
    <Link to={item.videoUrl || "/"}>
      <div className="season-cell-container">
        <div className="thumbnail-container">
          <FallbackImage
            fallback={<DefaultThumbnail />}
            image={<img src={item.thumbnailUrl} alt={item.title} />}
          />
          <PlayButton />
        </div>
        <div className="season-info-container">
          <div className="season-mini-info">
            <span className="episode-number">{`EPISODE ${item.episodeNumber}`}</span>
            <span>{formatAirDate(item.airDate)}</span>
            <span>{formatRuntime(item.runtime)}</span>
          </div>
          <br />
          <label>{item.title}</label>
          <p>{formatOverview(item.overview)}</p>
        </div>
        <Overlay />
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
