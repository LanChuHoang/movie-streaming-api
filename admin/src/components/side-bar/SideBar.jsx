import { Link, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCircleUser,
  faFilm,
  faTv,
  faPerson,
} from "@fortawesome/free-solid-svg-icons";
import { faRectangleList } from "@fortawesome/free-regular-svg-icons";
import "./sideBar.scss";
import AdminLogo from "../admin-logo/AdminLogo";

const sideBarItems = [
  {
    display: "Dashboard",
    rootPath: "",
    icon: faRectangleList,
  },
  {
    display: "Users",
    rootPath: "user",
    icon: faCircleUser,
  },
  {
    display: "Movies",
    rootPath: "movie",
    icon: faFilm,
  },
  {
    display: "Shows",
    rootPath: "show",
    icon: faTv,
  },
  {
    display: "People",
    rootPath: "person",
    icon: faPerson,
  },
];

function findSelectedIndex(path) {
  const rootPath = path.split("/")[1];
  const index = sideBarItems.findIndex((i) => rootPath === i.rootPath);
  return index !== -1 ? index : 0;
}

const SideBar = () => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const location = useLocation();

  useEffect(() => {
    setSelectedIndex(findSelectedIndex(location.pathname));
  }, [location]);

  return (
    <div className="sidebar-container">
      <div className="logo-section">
        <AdminLogo />
      </div>
      <div className="main-section">
        <ul>
          <h2 className="group-header">Monitor</h2>
          <SideBarItem
            key={sideBarItems[0].display}
            item={sideBarItems[0]}
            selected={selectedIndex === 0}
          />
          <h2 className="group-header">Database</h2>
          {sideBarItems.slice(1).map((item, i) => (
            <SideBarItem
              key={item.display}
              item={item}
              selected={selectedIndex === i + 1}
            />
          ))}
        </ul>
      </div>
    </div>
  );
};

const SideBarItem = ({ item, selected }) => {
  return (
    <Link to={`/${item.rootPath}`}>
      <li className={selected ? "selected" : ""}>
        <FontAwesomeIcon icon={item.icon} />
        <p className="sidebar-item-name">{item.display}</p>
      </li>
    </Link>
  );
};

export default SideBar;
