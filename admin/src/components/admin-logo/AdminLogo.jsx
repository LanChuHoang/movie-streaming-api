import "./adminLogo.scss";
import { Link } from "react-router-dom";

const SIZE = {
  small: "small-logo",
  standard: "standard-logo",
  large: "large-logo",
};

const AdminLogo = ({ className, size = "standard" }) => {
  return (
    <Link to="/">
      <span className={`admin-logo ${SIZE[size]} ${className}`}>tMovie</span>
    </Link>
  );
};

export default AdminLogo;
