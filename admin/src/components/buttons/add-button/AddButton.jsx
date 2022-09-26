import PropTypes from "prop-types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import "./addButton.scss";

const AddButton = (props) => {
  return (
    <button className="add-button" onClick={props.onClick || null}>
      <FontAwesomeIcon icon={faPlus} />
      {props.children}
    </button>
  );
};

AddButton.propTypes = {
  onClick: PropTypes.func,
};

export default AddButton;
