import "./fallbackImage.scss";
import PropTypes from "prop-types";

const FallbackImage = ({ fallback, image }) => {
  return (
    <div className="fallback-image-container">
      <div className="fallback-image">{fallback}</div>
      <div className="success-image">{image}</div>
    </div>
  );
};

FallbackImage.propTypes = {
  fallback: PropTypes.element,
  image: PropTypes.element,
};

export default FallbackImage;
