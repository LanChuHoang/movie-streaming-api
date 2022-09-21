import "./playButton.scss";
import Button from "../../button/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlay } from "@fortawesome/free-solid-svg-icons";

const PlayButton = ({ className, ...otherProps }) => {
  return (
    <Button className={`small-play-button ${className}`} {...otherProps}>
      <FontAwesomeIcon icon={faPlay} />
    </Button>
  );
};

export default PlayButton;
