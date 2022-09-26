import "./centerModal.scss";
import { Modal } from "@mui/material";

const CenterModal = ({ open, onClose, className, children }) => {
  return (
    <Modal
      open={open}
      onClose={() => onClose(false)}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
      keepMounted
    >
      <div className={`center-modal-container ${className}`}>{children}</div>
    </Modal>
  );
};

export default CenterModal;
