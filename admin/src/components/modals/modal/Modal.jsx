import React, { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
// import "./modal.scss";

const Modal = (props) => {
  return (
    <div className={`modal ${props.active ? "modal-active" : ""}`}>
      <div className="modal-content">
        {props.children}
        {!props.emptyModal && (
          <div className="modal-close-button" onClick={props.onClose}>
            <i className="bx bx-x"></i>
          </div>
        )}
      </div>
    </div>
  );
};

Modal.propTypes = {
  id: PropTypes.string,
  active: PropTypes.bool,
  emptyModal: PropTypes.bool,
  onClose: PropTypes.func,
};

export default Modal;
