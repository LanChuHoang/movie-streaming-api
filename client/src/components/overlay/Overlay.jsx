import "./overlay.scss";

const Overlay = ({ className, ...otherProps }) => {
  return (
    <div
      className={`overlay-component-container ${className}`}
      {...otherProps}
    />
  );
};

export default Overlay;
