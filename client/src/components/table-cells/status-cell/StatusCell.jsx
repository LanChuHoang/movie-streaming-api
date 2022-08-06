import "./statusCell.scss";

const StatusCell = (props) => {
  return props.isUpcoming ? (
    <div className="upcoming-role-cell">Upcoming</div>
  ) : (
    <div className="released-role-cell">Released</div>
  );
};

export default StatusCell;
