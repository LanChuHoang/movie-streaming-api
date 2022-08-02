import "./roleCell.scss";

const RoleCell = (props) => {
  return props.isAdmin ? (
    <div className="admin-role-cell">Admin</div>
  ) : (
    <div className="user-role-cell">User</div>
  );
};

export default RoleCell;
