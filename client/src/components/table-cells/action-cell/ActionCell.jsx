import {
  ViewButton,
  DeleteButton,
} from "../../buttons/action-button/ActionButton";
import "./actionCell.scss";

const ActionCell = (props) => {
  return (
    <div className="action-cell-container">
      <ViewButton onClick={props.onView} />
      <DeleteButton onClick={props.onDelete} />
    </div>
  );
};

export default ActionCell;
