import "./profileCell.scss";
import CircularAvatar from "../../circular-avatar/CircularAvatar";

const ProfileCell = ({ avatarUrl, name }) => {
  return (
    <div className="profile-cell">
      <CircularAvatar avatarUrl={avatarUrl} name={name} />
      <span>{name}</span>
    </div>
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
