import "./roleCell.scss";

const RoleCell = ({ children, className }) => {
  return <div className={`role-cell-root ${className}`}>{children}</div>;
};

export default RoleCell;
