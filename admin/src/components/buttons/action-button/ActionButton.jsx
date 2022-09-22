import PropTypes from "prop-types";
import "./actionButton.scss";

const ActionButton = (props) => {
  return (
    <button
      className={"action-button " + props.className}
      onClick={props.onClick || null}
    >
      {props.children}
    </button>
  );
};

export const ViewButton = (props) => {
  return (
    <ActionButton className="view-action-button" onClick={props.onClick}>
      {props.children || "View"}
    </ActionButton>
  );
};

export const DeleteButton = (props) => {
  return (
    <ActionButton className="delete-action-button" onClick={props.onClick}>
      {props.children || "Delete"}
    </ActionButton>
  );
};

ActionButton.propTypes = {
  onClick: PropTypes.func,
};

export default ActionButton;
