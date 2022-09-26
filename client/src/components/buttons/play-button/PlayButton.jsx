import "./playButton.scss";
import { IconButton } from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlay } from "@fortawesome/free-solid-svg-icons";

const PlayButton = ({ className, ...otherProps }) => {
  return (
    <IconButton
      classes={{ root: `small-play-button apple-light-blur ${className}` }}
      disableRipple
      {...otherProps}
    >
      <FontAwesomeIcon icon={faPlay} />
    </IconButton>
  );
};

export default PlayButton;
