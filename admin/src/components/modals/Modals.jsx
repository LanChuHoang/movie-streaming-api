import PropTypes from "prop-types";
import "./modals.scss";

const Modal = ({ active, children }) => {
  return (
    <div className={`modal-container ${active ? "modal-active" : ""}`}>
      {children}
    </div>
  );
};

Modal.propTypes = {
  active: PropTypes.bool,
};

export const ConfirmModal = (props) => {
  return (
    <div
      className={`modal confirm-modal-container ${
        props.active ? "modal-active" : ""
      }`}
    >
      <div className="modal-content confirm-modal">
        {props.children}
        <div className="confirm-buttons">
          <button className="cancel-button" onClick={props.onCancel}>
            Cancel
          </button>
          <button className="confirm-button" onClick={props.onConfirm}>
            {props.confirmButtonTitle || "OK"}
          </button>
        </div>
      </div>
    </div>
  );
};

ConfirmModal.propTypes = {
  active: PropTypes.bool,
  confirmButtonTitle: PropTypes.string,
  onCancel: PropTypes.func,
  onConfirm: PropTypes.func,
};

export const MessageModal = (props) => {
  return (
    <div
      className={`modal message-modal-container ${
        props.active ? "modal-active" : ""
      }`}
    >
      <div className="modal-content message-modal">
        {props.children}
        <div className="message-buttons">
          <button onClick={props.onConfirm}>
            {props.confirmButtonTitle || "Close"}
          </button>
        </div>
      </div>
    </div>
  );
};

MessageModal.propTypes = {
  active: PropTypes.bool,
  confirmButtonTitle: PropTypes.string,
  onConfirm: PropTypes.func,
};

export default Modal;
