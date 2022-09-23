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
            image={
              <img
                loading="lazy"
                src={item.thumbnailUrl?.replace("w300", "w780")}
                alt={item.title}
              />
            }
          />
          <PlayButton />
        </div>
        <div className="season-info-container">
          <div className="season-mini-info">
            <div className="mini-info-item">{`EPISODE ${item.episodeNumber}`}</div>
            <div className="mini-info-item">{formatRuntime(item.runtime)}</div>
            <div className="mini-info-item">{formatAirDate(item.airDate)}</div>
          </div>
          <div className="season-title">{item.title}</div>
          <div className="season-overview">{item.overview}</div>
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

const formatRuntime = (minutes) => {
  if (minutes !== 0 && !minutes) return "";
  if (minutes < 60) return `${minutes} min`;
  const numHours = Math.floor(minutes / 60);
  const numMins = minutes % 60;
  return `${numHours} hr${numMins ? ` ${numMins} min` : ""}`;
};

const formatAirDate = (date) => {
  return new Date(date).toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};
export default SeasonCell;
