import "./actionCell.scss";
import { GridActionsCellItem } from "@mui/x-data-grid";

const ActionCell = (props) => {
  return (
    <div className="action-cell-container">
      <i onClick={props.onDelete} className="bx bx-trash delete-icon"></i>
      <i onClick={props.onEdit} className="bx bx-pencil edit-icon"></i>
    </div>
  );
};

export const DeleteActionCell = ({ onClick }) => {
  return (
    <GridActionsCellItem
      className="delete-action-button"
      icon={<i className="bx bx-trash delete-icon" />}
      label="Delete"
      onClick={onClick}
    />
  );
};

export const EditActionCell = ({ onClick }) => {
  return (
    <GridActionsCellItem
      className="edit-action-button"
      icon={<i className="bx bx-pencil edit-icon" />}
      label="Edit"
      onClick={onClick}
    />
  );
};

export default ActionCell;
