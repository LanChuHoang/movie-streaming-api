import "./trailerModal.scss";
import { Modal, Fade } from "@mui/material";

const TrailerModal = ({ open, onClose, srcUrl }) => {
  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="trailer-modal-title"
      aria-describedby="trailer-modal-description"
    >
      <Fade in={open}>
        <div className="trailer-modal">
          {srcUrl ? (
            <iframe
              width="100%"
              height="100%"
              title="trailer"
              allow="fullscreen"
              src={srcUrl}
            />
          ) : (
            <p>Cannot play this video</p>
          )}
        </div>
      </Fade>
    </Modal>
  );
};

export default TrailerModal;
