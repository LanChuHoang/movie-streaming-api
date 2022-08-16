import "./actionCell.scss";

const ActionCell = (props) => {
  return (
    <div className="action-cell-container">
      <i onClick={props.onDelete} className="bx bx-trash delete-icon"></i>
      <i onClick={props.onEdit} className="bx bx-pencil edit-icon"></i>
    </div>
  );
};

export default ActionCell;
