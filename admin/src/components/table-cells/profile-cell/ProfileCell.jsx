import "./profileCell.scss";
import { CardHeader } from "@mui/material";
import CircularAvatar from "../../circular-avatar/CircularAvatar";

const ProfileCell = ({ avatarUrl, name, avatarSize: size }) => {
  return (
    <CardHeader
      className="profile-cell-card-header"
      avatar={<CircularAvatar {...{ avatarUrl, name, size }} />}
      title={name}
    />
  );
};

export const RectangularProfileCell = ({ imgUrl, name }) => {
  return (
    <div className="profile-cell">
      {imgUrl ? (
        <img className="rect-image" src={imgUrl} alt="profile" />
      ) : (
        <div className="default-rect-image rect-image">
          <i className="bx bxs-movie-play"></i>
        </div>
      )}
      <span>{name}</span>
    </div>
  );
};

export default ProfileCell;
